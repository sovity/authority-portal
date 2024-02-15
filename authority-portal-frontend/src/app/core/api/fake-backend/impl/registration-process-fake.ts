import {
  IdResponse,
  RegistrationRequestDto,
} from '@sovity.de/authority-portal-client';
import {updateLoggedInUser} from './fake-users';

export const createOrganization = (
  request: RegistrationRequestDto,
): IdResponse => {
  // User is now pending
  updateLoggedInUser(() => ({
    organizationName: request.organizationName,
    registrationStatus: 'PENDING',
  }));

  return {id: 'test-organization-id', changedDate: new Date()};
};

export const registerOrganization = (
  request: RegistrationRequestDto,
): IdResponse => {
  // User is now pending
  updateLoggedInUser(() => ({
    organizationName: request.organizationName,
    registrationStatus: 'PENDING',
  }));

  return {id: 'test-organization-id', changedDate: new Date()};
};
