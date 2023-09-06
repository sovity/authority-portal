import {UserInfo} from '@sovity.de/authority-portal-client';
import {Patcher, patchObj} from '../../../utils/object-utils';

/**
 * List of dummy users so local dev UI can choose between multiple user registration states
 */
export let DUMMY_USERS: UserInfo[] = [
  {
    firstName: 'Authority',
    lastName: 'Admin',
    roles: ['AUTHORITY_ADMIN'],
    registrationStatus: 'APPROVED',
    organizationName: 'Test Organization',
    organizationMdsId: 'MDSL0123456789ZZ',
  },
  {
    firstName: 'Participant',
    lastName: 'User',
    roles: ['PARTICIPANT_USER'],
    registrationStatus: 'APPROVED',
    organizationName: 'Test Organization',
    organizationMdsId: 'MDSL0123456789ZZ',
  },
  {
    firstName: 'Unregistered',
    lastName: 'User',
    roles: [],
    registrationStatus: 'CREATED',
    organizationName: '',
    organizationMdsId: '',
  },
];

/**
 * Currently "logged-in user" for local dev UI
 */
let currentlyLoggedInUser: UserInfo = DUMMY_USERS[0];

/**
 * Update currently logged-in User for local dev UI
 */
export const updateLoggedInUser = (patcher: Patcher<UserInfo>) => {
  currentlyLoggedInUser = patchObj<UserInfo>(currentlyLoggedInUser, patcher);
};

/**
 * Fake implementation for "userInfo" endpoint
 */
export const getUserInfo = (): UserInfo => currentlyLoggedInUser;
