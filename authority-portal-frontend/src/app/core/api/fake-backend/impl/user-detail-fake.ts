import {UserDetailDto} from '@sovity.de/authority-portal-client';

/**
 * User Detail
 */
let user: UserDetailDto = {
  firstName: 'John',
  lastName: 'Doe',
  email: 'johndoe@example.com',
  roles: ['USER', 'AUTHORITY_ADMIN'],
  registrationStatus: 'ACTIVE',
  creationDate: new Date(),
  onboardingType: 'SELF_REGISTRATION',
  organizationName: 'Example GmbH',
  phone: '+49 123 4567890',
  position: 'CTO',
};

/**
 * Fake implementation for "Organizations User Detail" endpoint
 */
export const userDetails = (userId: string): UserDetailDto => user;
