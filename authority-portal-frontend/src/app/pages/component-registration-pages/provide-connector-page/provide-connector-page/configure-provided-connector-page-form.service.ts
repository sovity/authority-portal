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
import {configureProvideConnectorPageFormEnabledCtrls} from './configure-provide-connector-page-form-enabled-ctrls';
import {
  CertificateTabFormModel,
  CertificateTabFormValue,
  ConfigureProvidedConnectorPageFormModel,
  ConfigureProvidedConnectorPageFormValue,
  ConnectorTabFormModel,
  ConnectorTabFormValue,
  DEFAULT_PROVIDE_CONNECTOR_PAGE_FORM_VALUE,
} from './configure-provided-connector-page-form-model';

@Injectable()
export class ConfigureProvidedConnectorPageForm {
  group = this.buildFormGroup();

  get connectorTab(): FormGroup<ConnectorTabFormModel> {
    return this.group.controls.connectorTab;
  }

  get certificateTab(): FormGroup<CertificateTabFormModel> {
    return this.group.controls.certificateTab;
  }

  get value(): ConfigureProvidedConnectorPageFormValue {
    return this.group.value as ConfigureProvidedConnectorPageFormValue;
  }

  constructor(private formBuilder: FormBuilder) {}

  buildFormGroup(): FormGroup<ConfigureProvidedConnectorPageFormModel> {
    const initial = DEFAULT_PROVIDE_CONNECTOR_PAGE_FORM_VALUE;

    const connectorTab = this.formBuilder.nonNullable.group({
      name: [
        initial.connectorTab.name,
        [Validators.required, Validators.maxLength(128), notBlankValidator()],
      ],
      location: [
        initial.connectorTab.location,
        [Validators.required, Validators.maxLength(128), notBlankValidator()],
      ],
      frontendUrl: [
        initial.connectorTab.frontendUrl,
        [
          Validators.required,
          Validators.maxLength(128),
          notBlankValidator(),
          connectorUrlValidator,
        ],
      ],
      endpointUrl: [
        initial.connectorTab.endpointUrl,
        [
          Validators.required,
          Validators.maxLength(128),
          notBlankValidator(),
          connectorUrlValidator,
        ],
      ],
      managementUrl: [
        initial.connectorTab.managementUrl,
        [
          Validators.required,
          Validators.maxLength(128),
          notBlankValidator(),
          connectorUrlValidator,
        ],
      ],
      organization: [
        initial.connectorTab.organization,
        [Validators.required, Validators.maxLength(128)],
      ],
      useJwks: [initial.connectorTab.useJwks],
      jwksUrl: [
        initial.connectorTab.jwksUrl,
        [
          Validators.required,
          Validators.maxLength(128),
          notBlankValidator(),
          connectorUrlValidator,
        ],
      ],
    });

    const certificateTab = buildCertificateInputForm(
      this.formBuilder,
      initial.certificateTab,
    );

    switchDisabledControls<CertificateTabFormValue>(certificateTab, (value) =>
      certificateInputFormEnabledCtrls(value),
    );

    switchDisabledControls<ConnectorTabFormValue>(connectorTab, (value) =>
      configureProvideConnectorPageFormEnabledCtrls(value),
    );

    return this.formBuilder.nonNullable.group({
      connectorTab,
      certificateTab,
    });
  }
}
