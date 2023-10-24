import {
  OrganizationOverviewEntryDto,
  OrganizationOverviewResult,
  OwnOrganizationDetailsDto,
} from '@sovity.de/authority-portal-client';
import {TEST_ORGANIZATIONS} from './fake-organizations';

export const getOrganizations = (): OwnOrganizationDetailsDto[] => {
  return TEST_ORGANIZATIONS;
};

export const getListOfOrganizationsForTable =
  (): OrganizationOverviewResult => {
    return {
      organizations: TEST_ORGANIZATIONS.map(
        (organization: OwnOrganizationDetailsDto) => {
          return {
            mdsId: organization.mdsId,
            name: organization.name,
            registrationStatus: organization.registrationStatus,
            url: organization.url,
          } satisfies OrganizationOverviewEntryDto;
        },
      ),
    };
  };
