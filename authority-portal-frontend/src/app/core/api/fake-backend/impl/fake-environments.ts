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


export function fakeEnv(id: string): DeploymentEnvironmentDto {
  return {
    environmentId: id,
    title: id.charAt(0).toUpperCase() + id.substring(1),
    loggingHouseUrl: `https://logging-house.${id}.mobility-dataspace.com`,
    dapsJwksUrl: `https://daps.${id}.mobility-dataspace.com/jwks`,
    dapsTokenUrl: `https://daps.${id}.mobility-dataspace.com/token`,
  };
}
