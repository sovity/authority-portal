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
import { DeploymentEnvironmentDto } from '@sovity.de/authority-portal-client';
import { fakeEnv } from './fake-environments';


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
