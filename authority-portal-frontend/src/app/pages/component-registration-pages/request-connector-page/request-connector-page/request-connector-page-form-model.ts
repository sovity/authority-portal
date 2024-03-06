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

import {FormControl, ɵFormGroupRawValue} from '@angular/forms';

export interface RequestConnectorPageFormModel {
  connectorTitle: FormControl<string>;
  connectorSubdomain: FormControl<string>;
  connectorDescription: FormControl<string>;
}

export type RequestConnectorPageFormValue =
  ɵFormGroupRawValue<RequestConnectorPageFormModel>;

export const DEFAULT_REQUEST_CONNECTOR_PAGE_FORM_VALUE: RequestConnectorPageFormValue =
  {
    connectorTitle: '',
    connectorSubdomain: '',
    connectorDescription: '',
  };
