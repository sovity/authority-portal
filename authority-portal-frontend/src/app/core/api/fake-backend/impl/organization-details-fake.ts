import {
  MemberInfo,
  OrganizationDetailsDto,
  OwnOrganizationDetailsDto,
} from '@sovity.de/authority-portal-client';
import {TEST_ORGANIZATIONS} from './fake-organizations';

export const getOrganizationDetails = (
  mdsId: string,
): OrganizationDetailsDto => {
  let organization = TEST_ORGANIZATIONS.find(
    (organization) => organization.mdsId === mdsId,
  ) as OwnOrganizationDetailsDto;
  return {
    ...organization,
    memberCount: organization.memberInfos.length,
    dataOfferCount: 0,
    connectorCount: 0,
  };
};
