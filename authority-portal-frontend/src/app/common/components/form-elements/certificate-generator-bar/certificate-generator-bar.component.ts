import {Component, HostBinding, Input, OnDestroy, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {Subject, takeUntil} from 'rxjs';
import {UserInfo} from '@sovity.de/authority-portal-client';
import {
  CertificateGeneratorConfig,
  CertificateResult,
} from 'src/app/shared/services/certificate-generate.service';
import {GlobalStateUtils} from '../../../../core/global-state/global-state-utils';
import {downloadFile} from '../../../../core/utils/download-utils';
import {CertificateGeneratorDialogComponent} from '../../../../shared/components/business/certificate-generator-dialog/certificate-generator-dialog.component';

@Component({
  selector: 'app-certificate-generator-bar',
  templateUrl: './certificate-generator-bar.component.html',
})
export class CertificateGeneratorBarComponent implements OnInit, OnDestroy {
  @HostBinding('class.flex')
  @HostBinding('class.flex-wrap')
  @HostBinding('class.gap-4')
  @HostBinding('class.justify-start')
  cls = true;

  @Input()
  certificateCtrl: FormControl<string> = new FormControl();

  @Input()
  locationCtrl: FormControl<string> = new FormControl();

  @Input()
  urlCtrl: FormControl<string> = new FormControl();

  p12Certificate: Blob | null = null;

  userInfo: UserInfo | null = null;

  private ngOnDestroy$ = new Subject();

  constructor(
    private dialog: MatDialog,
    private globalStateUtils: GlobalStateUtils,
  ) {}

  ngOnInit() {
    this.startListeningToUserInfo();
  }

  openCertificateDialog() {
    const config: CertificateGeneratorConfig = {
      country: this.locationCtrl.value,
      legalName: this.userInfo?.organizationName ?? '',
      commonName: this.urlCtrl.value,
      email: '',
    };

    const dialogRef = this.dialog.open(CertificateGeneratorDialogComponent, {
      data: config,
      width: '50%',
    });
    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.ngOnDestroy$))
      .subscribe((result: CertificateResult) => {
        if (result.certificateBlob) {
          this.certificateCtrl.setValue(result.pemCertificate);
          this.p12Certificate = result.certificateBlob;
          this.onDownloadP12Click();
        }
      });
  }

  onDownloadP12Click() {
    if (!this.p12Certificate) {
      return;
    }
    downloadFile(this.p12Certificate, 'generated-certificate.p12');
  }

  private startListeningToUserInfo() {
    this.globalStateUtils.userInfo$
      .pipe(takeUntil(this.ngOnDestroy$))
      .subscribe((userInfo: UserInfo) => {
        this.userInfo = userInfo;
      });
  }

  ngOnDestroy() {
    this.ngOnDestroy$.next(null);
    this.ngOnDestroy$.complete();
  }
}
