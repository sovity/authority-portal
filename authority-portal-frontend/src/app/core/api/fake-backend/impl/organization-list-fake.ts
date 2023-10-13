import {
  OrganizationDetailResult,
  OrganizationOverviewEntryDto,
  OrganizationOverviewResult,
} from '@sovity.de/authority-portal-client';
import {TEST_ORGANIZATIONS} from './fake-organizations';

export const getOrganizations = (): OrganizationDetailResult[] => {
  return TEST_ORGANIZATIONS;
};

export const getListOfOrganizationsForTable =
  (): OrganizationOverviewResult => {
    return {
      organizations: TEST_ORGANIZATIONS.map(
        (organization: OrganizationDetailResult) => {
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
