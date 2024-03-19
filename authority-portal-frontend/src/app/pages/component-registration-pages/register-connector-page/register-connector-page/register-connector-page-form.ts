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
  ConnectorTabFormModel,
  DEFAULT_REGISTER_CONNECTOR_PAGE_FORM_VALUE,
  RegisterConnectorPageFormModel,
  RegisterConnectorPageFormValue,
} from './register-connector-page-form-model';
import {connectorUrlValidator} from "../../../../core/utils/validators/connector-url-validator";

@Injectable()
export class RegisterConnectorPageForm {
  group = this.buildFormGroup();

  get connectorTab(): FormGroup<ConnectorTabFormModel> {
    return this.group.controls.connectorTab;
  }

  get certificateTab(): FormGroup<CertificateTabFormModel> {
    return this.group.controls.certificateTab;
  }

  get value(): RegisterConnectorPageFormValue {
    return this.group.value as RegisterConnectorPageFormValue;
  }

  constructor(private formBuilder: FormBuilder) {}

  buildFormGroup(): FormGroup<RegisterConnectorPageFormModel> {
    const initial = DEFAULT_REGISTER_CONNECTOR_PAGE_FORM_VALUE;

    const connectorTab = this.formBuilder.nonNullable.group({
      name: [
        initial.connectorTab.name,
        [Validators.required, Validators.maxLength(128)],
      ],
      location: [
        initial.connectorTab.location,
        [Validators.required, Validators.maxLength(128)],
      ],
      frontendUrl: [
        initial.connectorTab.frontendUrl,
        [Validators.required, Validators.maxLength(128), connectorUrlValidator],
      ],
      endpointUrl: [
        initial.connectorTab.endpointUrl,
        [Validators.required, Validators.maxLength(128), connectorUrlValidator],
      ],
      managementUrl: [
        initial.connectorTab.managementUrl,
        [Validators.required, Validators.maxLength(128), connectorUrlValidator],
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
      connectorTab,
      certificateTab,
    });
  }
}
