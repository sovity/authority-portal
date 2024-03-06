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
  CentralComponentCreateRequest,
  CentralComponentDto,
  IdResponse,
} from '@sovity.de/authority-portal-client';

let centralComponents: Record<string, CentralComponentDto[]> = {
  development: [
    {
      centralComponentId: 'MDSL1234XX.C0001XX',
      name: 'Broker',
      homepageUrl: 'https://broker.dev.my-dataspace.sovity.io',
      endpointUrl: 'https://broker.dev.my-dataspace.sovity.io/backend/api/dsp',
      createdByUserFullName: 'Your Name',
      createdByOrgName: 'Your Org Name',
      createdByOrgMdsId: 'MDSL1234XX',
    },
    {
      centralComponentId: 'MDSL1234XX.C0002XX',
      name: 'Broker MDS 2.0 Test',
      homepageUrl: 'https://broker2.dev.my-dataspace.sovity.io',
      endpointUrl: 'https://broker2.dev.my-dataspace.sovity.io/backend/api/dsp',
      createdByUserFullName: 'Your Name',
      createdByOrgName: 'Your Org Name',
      createdByOrgMdsId: 'MDSL1234XX',
    },
  ],
};

export const centralComponentList = (
  environmentId: string,
): CentralComponentDto[] => centralComponents[environmentId] ?? [];

export const createCentralComponent = (
  request: CentralComponentCreateRequest,
  environmentId: string,
): IdResponse => {
  const newCentralComponent: CentralComponentDto = {
    centralComponentId:
      'MDSL1234XX.C' + Math.random().toString().substring(2).substring(0, 6),
    name: request.name,
    endpointUrl: request.endpointUrl,
    homepageUrl: request.homepageUrl,
    createdByOrgMdsId: 'MDSL1234XX',
    createdByOrgName: 'Your Org Name',
    createdByUserFullName: 'Your Name',
  };

  updateEnv(environmentId, (list) => [...list, newCentralComponent]);

  return {id: newCentralComponent.centralComponentId, changedDate: new Date()};
};

export const deleteCentralComponent = (
  centralComponentId: string,
): IdResponse => {
  updateAllEnvs((list) =>
    list.filter((it) => it.centralComponentId !== centralComponentId),
  );

  return {id: centralComponentId, changedDate: new Date()};
};

/**
 * Updates the list of central components under the given environment id.
 * @param envId environment id
 * @param mapper list mapper
 */
const updateEnv = (
  envId: string,
  mapper: (it: CentralComponentDto[]) => CentralComponentDto[],
): void => {
  centralComponents = {
    ...centralComponents,
    [envId]: mapper(centralComponents[envId] ?? []),
  };
};

/**
 * Updates the lists of central components of all deployment environments
 * @param mapper list mapper
 */
const updateAllEnvs = (
  mapper: (it: CentralComponentDto[]) => CentralComponentDto[],
): void => {
  centralComponents = Object.fromEntries(
    Object.entries(centralComponents).map(([envId, list]) => [
      envId,
      mapper(list),
    ]),
  );
};
