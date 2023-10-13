import {
  CreateOrganizationRequest,
  IdResponse,
} from '@sovity.de/authority-portal-client';
import {updateLoggedInUser} from './user-info-fake';

export const createOrganization = (
  request: CreateOrganizationRequest,
): IdResponse => {
  // User is now pending
  updateLoggedInUser(() => ({
    organizationName: request.name,
    registrationStatus: 'PENDING',
  }));

  return {id: 'test-organization-id', changedDate: new Date()};
};
