import {
  CentralComponentCreateRequest,
  CentralComponentDto,
  IdResponse,
} from '@sovity.de/authority-portal-client';

let centralComponents: Record<string, CentralComponentDto[]> = {
  development: [
    {
      centralComponentId: '1',
      name: 'Broker',
      homepageUrl: 'https://broker.dev.my-dataspace.sovity.io',
      endpointUrl: 'https://broker.dev.my-dataspace.sovity.io/backend/api/dsp',
      createdByUserFullName: 'Your Name',
      createdByOrgName: 'Your Org Name',
      createdByOrgMdsId: 'MDSL1234XX',
    },
    {
      centralComponentId: '2',
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
    centralComponentId: Math.random().toString().substring(2),
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
