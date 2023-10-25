import {UserDetailDto} from '@sovity.de/authority-portal-client';

/**
 * User Detail
 */
let user: UserDetailDto = {
  firstName: 'John',
  lastName: 'Doe',
  email: 'johndoe@example.com',
  roles: [],
  registrationStatus: 'ACTIVE',
  creationDate: new Date(),
};

/**
 * Fake implementation for "Organizations User Detail" endpoint
 */
export const userDetails = (userId: string): UserDetailDto => user;
