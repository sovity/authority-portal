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
import {
  CreateConnectorResponse,
  DeploymentEnvironmentDto,
} from '@sovity.de/authority-portal-client';

export function buildConnectorConfigFromResponse(
  deploymentEnvironment: DeploymentEnvironmentDto,
  response: CreateConnectorResponse,
): string {
  return [
    `MY_EDC_PARTICIPANT_ID: "${response.id}"`,
    `EDC_OAUTH_CLIENT_ID: "${response.clientId}"`,
    `EDC_OAUTH_TOKEN_URL: "${deploymentEnvironment.dapsTokenUrl}"`,
    `EDC_OAUTH_PROVIDER_JWKS_URL: "${deploymentEnvironment.dapsJwksUrl}"`,
    `EDC_LOGGINGHOUSE_EXTENSION_URL: "${deploymentEnvironment.loggingHouseUrl}"`,
  ].join('\n');
}

export function buildConnectorConfigFromLocalData(
  deploymentEnvironment: DeploymentEnvironmentDto,
  connectorId: string,
  clientId: string,
): string {
  return [
    `MY_EDC_PARTICIPANT_ID: "${connectorId}"`,
    `EDC_OAUTH_CLIENT_ID: "${clientId}"`,
    `EDC_OAUTH_TOKEN_URL: "${deploymentEnvironment.dapsTokenUrl}"`,
    `EDC_OAUTH_PROVIDER_JWKS_URL: "${deploymentEnvironment.dapsJwksUrl}"`,
    `EDC_LOGGINGHOUSE_EXTENSION_URL: "${deploymentEnvironment.loggingHouseUrl}"`,
  ].join('\n');
}
