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
import {ConnectorTabFormValue} from './configure-provided-connector-page-form-model';

export const configureProvideConnectorPageFormEnabledCtrls = (
  value: ConnectorTabFormValue,
): Record<keyof ConnectorTabFormValue, boolean> => {
  let useJwks = value.useJwks;
  return {
    frontendUrl: true,
    endpointUrl: true,
    managementUrl: true,
    useJwks: true,
    jwksUrl: useJwks,
  };
};
