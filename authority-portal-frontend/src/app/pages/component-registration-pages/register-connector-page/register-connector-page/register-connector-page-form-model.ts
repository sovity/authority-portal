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

import {FormControl, FormGroup, ɵFormGroupRawValue} from '@angular/forms';
import {
  CertificateFormModel,
  DEFAULT_CERTIFICATE_FORM_VALUE,
} from '../../../../common/components/form-elements/certificate-input-form/certificate-input-form-model';

export interface ConnectorTabFormModel {
  name: FormControl<string>;
  location: FormControl<string>;
  frontendUrl: FormControl<string>;
  endpointUrl: FormControl<string>;
  managementUrl: FormControl<string>;
}

export type ConnectorTabFormValue = ɵFormGroupRawValue<ConnectorTabFormModel>;
export const DEFAULT_CONNECTOR_TAB_FORM_VALUE: ConnectorTabFormValue = {
  name: '',
  location: '',
  frontendUrl: '',
  endpointUrl: '',
  managementUrl: '',
};

export interface CertificateTabFormModel extends CertificateFormModel {}

export type CertificateTabFormValue =
  ɵFormGroupRawValue<CertificateTabFormModel>;
export const DEFAULT_CERTIFICATE_TAB_FORM_VALUE: CertificateTabFormValue =
  DEFAULT_CERTIFICATE_FORM_VALUE;

export interface RegisterConnectorPageFormModel {
  connectorTab: FormGroup<ConnectorTabFormModel>;
  certificateTab: FormGroup<CertificateTabFormModel>;
  canSwitchTabs: FormControl<boolean>;
}

export const DEFAULT_REGISTER_CONNECTOR_PAGE_FORM_VALUE: RegisterConnectorPageFormValue =
  {
    connectorTab: DEFAULT_CONNECTOR_TAB_FORM_VALUE,
    certificateTab: DEFAULT_CERTIFICATE_TAB_FORM_VALUE,
    canSwitchTabs: true,
  };
export type RegisterConnectorPageFormValue =
  ɵFormGroupRawValue<RegisterConnectorPageFormModel>;
