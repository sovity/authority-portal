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
import {urlValidator} from 'src/app/core/utils/validators/url-validator';
import {buildCertificateInputForm} from '../../../../common/components/form-elements/certificate-input-form/certificate-input-form-builder';
import {certificateInputFormEnabledCtrls} from '../../../../common/components/form-elements/certificate-input-form/certificate-input-form-enabled-ctrls';
import {switchDisabledControls} from '../../../../core/utils/form-utils';
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
      name: [initial.componentTab.name, [Validators.required]],
      location: [initial.componentTab.location, [Validators.required]],
      frontendUrl: [initial.componentTab.frontendUrl, [urlValidator]],
      endpointUrl: [
        initial.componentTab.endpointUrl,
        [Validators.required, urlValidator],
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
      canSwitchTabs: [true, Validators.requiredTrue],
      componentTab,
      certificateTab,
    });
  }
}
