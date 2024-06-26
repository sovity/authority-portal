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
} from '../../../../shared/form-elements/certificate-input-form/certificate-input-form-model';

export interface ComponentTabFormModel {
  name: FormControl<string>;
  location: FormControl<string>;
  frontendUrl: FormControl<string>;
  endpointUrl: FormControl<string>;
}

export type ComponentTabFormValue = ɵFormGroupRawValue<ComponentTabFormModel>;
export const DEFAULT_COMPONENT_TAB_FORM_VALUE: ComponentTabFormValue = {
  name: '',
  location: '',
  frontendUrl: '',
  endpointUrl: '',
};

export interface CertificateTabFormModel extends CertificateFormModel {}

export type CertificateTabFormValue =
  ɵFormGroupRawValue<CertificateTabFormModel>;
export const DEFAULT_CERTIFICATE_TAB_FORM_VALUE: CertificateTabFormValue =
  DEFAULT_CERTIFICATE_FORM_VALUE;

export interface RegisterCentralComponentPageFormModel {
  componentTab: FormGroup<ComponentTabFormModel>;
  certificateTab: FormGroup<CertificateTabFormModel>;
}

export const DEFAULT_REGISTER_CENTRAL_COMPONENT_PAGE_FORM_VALUE: RegisterCentralComponentPageFormValue =
  {
    componentTab: DEFAULT_COMPONENT_TAB_FORM_VALUE,
    certificateTab: DEFAULT_CERTIFICATE_TAB_FORM_VALUE,
  };
export type RegisterCentralComponentPageFormValue =
  ɵFormGroupRawValue<RegisterCentralComponentPageFormModel>;
