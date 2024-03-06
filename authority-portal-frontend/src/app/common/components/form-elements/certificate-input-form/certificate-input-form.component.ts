/*
 * Copyright (c) 2024 sovity GmbH
 *
 * This program and the accompanying materials are made available under the
 * terms of the Apache License, Version 2.0 which is available at
 * https://www.apache.org/licenses/LICENSE-2.0
 *
 * SPDX-License-Identifier: Apache-2.0
 *
 * Contributors:
 *      sovity GmbH - initial implementation
 */
import {Component, HostBinding, Input, OnDestroy} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {Subject} from 'rxjs';
import {downloadFile} from '../../../../core/utils/download-utils';
import {
  CertificateAttributes,
  CertificateGenerateService,
} from '../../../../shared/services/certificate-generate.service';
import {
  CertificateFormModel,
  CertificateFormValue,
} from './certificate-input-form-model';

@Component({
  selector: 'app-certificate-input-form',
  templateUrl: './certificate-input-form.component.html',
})
export class CertificateInputFormComponent implements OnDestroy {
  @HostBinding('class.flex')
  @HostBinding('class.flex-col')
  @HostBinding('class.justify-center')
  @HostBinding('class.gap-8')
  @HostBinding('class.my-10')
  cls = true;

  @Input()
  organizationLegalName = '';

  @Input()
  commonName = '';

  @Input()
  location = '';

  @Input()
  group!: FormGroup<CertificateFormModel>;

  get canGenerate(): boolean {
    return (
      !this.isGenerating &&
      !!this.organizationLegalName &&
      (this.group.valid || this.onlyErrorIsGeneratedCert())
    );
  }

  get isBringOwnCert(): boolean {
    return this.group.controls.bringOwnCert.value;
  }

  isGenerating: boolean = false;
  isDisabled: boolean = false;

  private ngOnDestroy$ = new Subject();

  constructor(private certificateGenerateService: CertificateGenerateService) {}

  onGenerateCertificateClick() {
    if (this.isGenerating) {
      return;
    }

    this.isGenerating = true;
    setTimeout(() => {
      try {
        this.generateCertificateAndDownloadP12();
      } catch (e) {
        console.error('error while generating certificate', e);
        alert('error while generating certificate. Please check console');
      } finally {
        this.isGenerating = false;
      }
    }, 100);
  }

  private generateCertificateAndDownloadP12() {
    this.group.controls.generatedCertificate.setValue('');
    const formValue: CertificateFormValue = this.group
      .value as CertificateFormValue;

    const certificateAttributes: CertificateAttributes = {
      commonName: this.commonName,
      countryName: this.location,
      stateName: formValue.state,
      localityName: formValue.city,
      organizationName: this.organizationLegalName,
      organizationalUnitName: formValue.organizationalUnit,
      emailAddress: formValue.email,
    };

    const keyPair = this.certificateGenerateService.generateKeyPair(2048);
    const validUntil = this.plusYears(new Date(), 5);
    const selfSignedCertificate =
      this.certificateGenerateService.generateSelfSignedCertificate(
        keyPair,
        certificateAttributes,
        validUntil,
      );
    const pemCertificate = this.certificateGenerateService.certificateToPem(
      selfSignedCertificate,
    );
    const p12FormatCertificate =
      this.certificateGenerateService.convertToP12Format(
        keyPair.privateKey,
        selfSignedCertificate,
        formValue.password,
      );

    const certificateBlob =
      this.certificateGenerateService.getCertificateBlob(p12FormatCertificate);

    if (certificateBlob) {
      downloadFile(certificateBlob, 'connector-certificate.p12');
      this.group.controls.generatedCertificate.setValue(pemCertificate);
    }
  }

  private plusYears(date: Date, plusYears: number) {
    const copy = new Date(date);
    copy.setFullYear(date.getFullYear() + plusYears);
    return copy;
  }

  private onlyErrorIsGeneratedCert(): boolean {
    const failedControls = Object.entries(this.group.controls)
      .filter(([key, control]) => !control.valid && !control.disabled)
      .map((it) => it[0]);
    return (
      this.group.errors == null &&
      failedControls.length === 1 &&
      failedControls[0] === 'generatedCertificate'
    );
  }

  ngOnDestroy() {
    this.ngOnDestroy$.next(null);
    this.ngOnDestroy$.complete();
  }
}
