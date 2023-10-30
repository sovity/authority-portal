import {DeploymentEnvironmentDto} from '@sovity.de/authority-portal-client';

/**
 * Environment tList
 */
let environmentList: DeploymentEnvironmentDto[] = [
  {
    environmentId: 'development',
    title: 'Development',
  },
  {
    environmentId: 'staging',
    title: 'Staging',
  },
  {
    environmentId: 'production',
    title: 'Production',
  },
];

/**
 * Fake implementation for "Environment List" endpoint
 */
export const deploymentEnvironmentList = (): DeploymentEnvironmentDto[] =>
  environmentList;
