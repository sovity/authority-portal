import {CreateOrganizationRequest} from '@sovity.de/authority-portal-client';
import {updateLoggedInUser} from './user-info-fake';

export const createOrganization = (
  request: CreateOrganizationRequest,
): string => {
  // save info for a following "getCurrentUserPendingOrganizationCreateRequest" call
  // TODO

  // User is now pending
  updateLoggedInUser(() => ({registrationStatus: 'PENDING'}));

  // Emulate approval after 10 seconds
  setTimeout(() => {
    updateLoggedInUser(() => ({
      registrationStatus: 'APPROVED',
      organizationName: request.name,
    }));
  }, 4_000);

  return 'test-organization-id';
};
