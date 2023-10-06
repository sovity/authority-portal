import {UserInfo} from '@sovity.de/authority-portal-client';
import {Patcher, patchObj} from '../../../utils/object-utils';

/**
 * List of dummy users so local dev UI can choose between multiple user registration states
 */
export let DUMMY_USERS: UserInfo[] = [
  {
    firstName: 'Authority',
    lastName: 'Admin',
    roles: [
      'AUTHORITY_ADMIN',
      'AUTHORITY_USER',
      'PARTICIPANT_ADMIN',
      'PARTICIPANT_USER',
    ],
    registrationStatus: 'ACTIVE',
    organizationName: 'Test Organization',
    organizationMdsId: 'MDSL9999999999BB',
  },
  {
    firstName: 'Participant',
    lastName: 'Admin',
    roles: ['PARTICIPANT_ADMIN', 'PARTICIPANT_USER'],
    registrationStatus: 'ACTIVE',
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
