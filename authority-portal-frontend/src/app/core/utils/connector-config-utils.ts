import {
  CreateConnectorResponse,
  DeploymentEnvironmentDto,
} from '@sovity.de/authority-portal-client';

export function buildConnectorConfig(
  deploymentEnvironment: DeploymentEnvironmentDto,
  response: CreateConnectorResponse,
): string {
  return [
    `MY_EDC_PARTICIPANT_ID: "${response.id}"`,
    `EDC_OAUTH_TOKEN_URL: "${deploymentEnvironment.dapsTokenUrl}"`,
    `EDC_OAUTH_PROVIDER_JWKS_URL: "${deploymentEnvironment.dapsJwksUrl}"`,
    `EDC_CLEARINGHOUSE_LOG_URL: "${deploymentEnvironment.loggingHouseUrl}"`,
  ].join('\n');
}
