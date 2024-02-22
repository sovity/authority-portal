import {DeploymentEnvironmentDto} from '@sovity.de/authority-portal-client';
import {fakeEnv} from './fake-environments';

/**
 * Environment tList
 */
let environmentList: DeploymentEnvironmentDto[] = [
  fakeEnv('development'),
  fakeEnv('staging'),
  fakeEnv('production'),
];

/**
 * Fake implementation for "Environment List" endpoint
 */
export const deploymentEnvironmentList = (): DeploymentEnvironmentDto[] =>
  environmentList;
