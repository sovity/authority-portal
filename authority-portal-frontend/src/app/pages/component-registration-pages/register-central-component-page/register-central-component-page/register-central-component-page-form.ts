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
import {Injectable} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {switchDisabledControls} from 'src/app/core/utils/form-utils';
import {connectorUrlValidator} from 'src/app/core/utils/validators/connector-url-validator';
import {notBlankValidator} from 'src/app/core/utils/validators/not-blank-validator';
import {buildCertificateInputForm} from '../../../../shared/form-elements/certificate-input-form/certificate-input-form-builder';
import {certificateInputFormEnabledCtrls} from '../../../../shared/form-elements/certificate-input-form/certificate-input-form-enabled-ctrls';
import {
  CertificateTabFormModel,
  CertificateTabFormValue,
  ComponentTabFormModel,
  DEFAULT_REGISTER_CENTRAL_COMPONENT_PAGE_FORM_VALUE,
  RegisterCentralComponentPageFormModel,
  RegisterCentralComponentPageFormValue,
} from './register-central-component-page-form-model';

@Injectable()
export class RegisterCentralComponentPageForm {
  group = this.buildFormGroup();

  get componentTab(): FormGroup<ComponentTabFormModel> {
    return this.group.controls.componentTab;
  }

  get certificateTab(): FormGroup<CertificateTabFormModel> {
    return this.group.controls.certificateTab;
  }

  get value(): RegisterCentralComponentPageFormValue {
    return this.group.value as RegisterCentralComponentPageFormValue;
  }

  constructor(private formBuilder: FormBuilder) {}

  buildFormGroup(): FormGroup<RegisterCentralComponentPageFormModel> {
    const initial = DEFAULT_REGISTER_CENTRAL_COMPONENT_PAGE_FORM_VALUE;

    const componentTab = this.formBuilder.nonNullable.group({
      name: [
        initial.componentTab.name,
        [Validators.required, Validators.maxLength(128), notBlankValidator()],
      ],
      location: [
        initial.componentTab.location,
        [Validators.required, Validators.maxLength(128), notBlankValidator()],
      ],
      frontendUrl: [
        initial.componentTab.frontendUrl,
        [Validators.required, connectorUrlValidator, Validators.maxLength(128)],
      ],
      endpointUrl: [
        initial.componentTab.endpointUrl,
        [Validators.required, connectorUrlValidator, Validators.maxLength(128)],
      ],
    });

    const certificateTab = buildCertificateInputForm(
      this.formBuilder,
      initial.certificateTab,
    );

    switchDisabledControls<CertificateTabFormValue>(certificateTab, (value) =>
      certificateInputFormEnabledCtrls(value),
    );

    return this.formBuilder.nonNullable.group({
      componentTab,
      certificateTab,
    });
  }
}
