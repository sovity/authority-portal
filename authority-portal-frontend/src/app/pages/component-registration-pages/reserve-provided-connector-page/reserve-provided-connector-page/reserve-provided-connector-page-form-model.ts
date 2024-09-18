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
import {OrganizationOverviewEntryDto} from '@sovity.de/authority-portal-client';

export interface ConnectorInfoFormModel {
  name: FormControl<string>;
  location: FormControl<string>;
  organization: FormControl<OrganizationOverviewEntryDto | null>;
}
export type ConnectorTabFormValue = ɵFormGroupRawValue<ConnectorInfoFormModel>;
export const DEFAULT_CONNECTOR_INFO_FORM_VALUE: ConnectorTabFormValue = {
  name: '',
  location: '',
  organization: null,
};

export interface ReserveProvidedConnectorPageFormModel {
  connectorInfo: FormGroup<ConnectorInfoFormModel>;
}
export const DEFAULT_PROVIDE_CONNECTOR_PAGE_FORM_VALUE: ReserveProvidedConnectorPageFormValue =
  {
    connectorInfo: DEFAULT_CONNECTOR_INFO_FORM_VALUE,
  };
export type ReserveProvidedConnectorPageFormValue =
  ɵFormGroupRawValue<ReserveProvidedConnectorPageFormModel>;
