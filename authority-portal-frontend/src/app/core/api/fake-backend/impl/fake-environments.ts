import {DeploymentEnvironmentDto} from '@sovity.de/authority-portal-client';

export function fakeEnv(id: string): DeploymentEnvironmentDto {
  return {
    environmentId: id,
    title: id.charAt(0).toUpperCase() + id.substring(1),
    loggingHouseUrl: `https://logging-house.${id}.mobility-dataspace.com`,
    dapsJwksUrl: `https://daps.${id}.mobility-dataspace.com/jwks`,
    dapsTokenUrl: `https://daps.${id}.mobility-dataspace.com/token`,
  };
}
