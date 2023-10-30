import {
  OrganizationDetailsDto,
  OwnOrganizationDetailsDto,
} from '@sovity.de/authority-portal-client';
import {TEST_ORGANIZATIONS} from './fake-organizations';

export const getMyOrganizationDetails = (): OrganizationDetailsDto => {
  let organization = TEST_ORGANIZATIONS.find(
    (organization) => organization.mdsId === 'MDSL3334C4',
  ) as OwnOrganizationDetailsDto;
  return {
    ...organization,
    memberCount: organization.memberInfos.length,
    dataOfferCount: 0,
    connectorCount: 0,
  };
};
