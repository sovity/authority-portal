import {OwnOrganizationDetailsDto} from '@sovity.de/authority-portal-client';
import {TEST_ORGANIZATIONS} from './fake-organizations';

export const getOrganizationDetails = (
  mdsId: string,
): OwnOrganizationDetailsDto => {
  return TEST_ORGANIZATIONS.find(
    (organization) => organization.mdsId === mdsId,
  ) as OwnOrganizationDetailsDto;
};
