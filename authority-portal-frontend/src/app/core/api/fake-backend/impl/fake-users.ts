import {
  IdResponse,
  InviteParticipantUserRequest,
  MemberInfo,
  UserInfo,
  UserRoleDto,
} from '@sovity.de/authority-portal-client';
import {Patcher, patchObj} from 'src/app/core/utils/object-utils';

export let TEST_USERS: {[key: string]: UserInfo} = {
  '00000000-0000-0000-0000-00000001': {
    userId: '00000000-0000-0000-0000-00000001',
    firstName: 'Authority',
    lastName: 'Admin',
    roles: [
      'AUTHORITY_ADMIN',
      'AUTHORITY_USER',
      'PARTICIPANT_ADMIN',
      'PARTICIPANT_USER',
    ],
    registrationStatus: 'ACTIVE',
    organizationName: 'Authority Organization',
    organizationMdsId: 'MDSL1111AA',
  },
  '00000000-0000-0000-0000-00000002': {
    userId: '00000000-0000-0000-0000-00000002',
    firstName: 'Authority',
    lastName: 'User',
    roles: ['AUTHORITY_USER', 'PARTICIPANT_USER'],
    registrationStatus: 'ACTIVE',
    organizationName: 'Authority Organization',
    organizationMdsId: 'MDSL1111AA',
  },
  '00000000-0000-0000-0000-00000003': {
    userId: '00000000-0000-0000-0000-00000003',
    firstName: 'Participant',
    lastName: 'Admin',
    roles: ['PARTICIPANT_ADMIN', 'PARTICIPANT_CURATOR', 'PARTICIPANT_USER'],
    registrationStatus: 'ACTIVE',
    organizationName: 'Participant Organization',
    organizationMdsId: 'MDSL2222BB',
  },
  '00000000-0000-0000-0000-00000004': {
    userId: '00000000-0000-0000-0000-00000004',
    firstName: 'Participant',
    lastName: 'User',
    roles: ['PARTICIPANT_USER'],
    registrationStatus: 'ACTIVE',
    organizationName: 'Participant Organization',
    organizationMdsId: 'MDSL2222BB',
  },
  '00000000-0000-0000-0000-00000005': {
    userId: '00000000-0000-0000-0000-00000005',
    firstName: 'Created',
    lastName: 'User',
    roles: [],
    registrationStatus: 'CREATED',
    organizationName: '',
    organizationMdsId: '',
  },
  '00000000-0000-0000-0000-00000006': {
    userId: '00000000-0000-0000-0000-00000006',
    firstName: 'Pending',
    lastName: 'User',
    roles: [],
    registrationStatus: 'PENDING',
    organizationName: '',
    organizationMdsId: 'MDSL5555EE',
  },
};

/**
 * Currently "logged-in user" for local dev UI
 */
let currentlyLoggedInUser: UserInfo =
  TEST_USERS['00000000-0000-0000-0000-00000001'];

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

export const inviteUser = (
  request: InviteParticipantUserRequest,
): IdResponse => {
  let newUserId = generateNewId();

  TEST_USERS[newUserId] = {
    userId: newUserId,
    firstName: request.firstName,
    lastName: request.lastName,
    roles: generateRoles(request.role),
    registrationStatus: 'INVITED',
    organizationMdsId: getUserInfo().organizationMdsId,
    organizationName: getUserInfo().organizationName,
  } satisfies UserInfo;

  return {id: newUserId, changedDate: new Date()};
};

export const getOrganizationMembers = (mdsId: string): MemberInfo[] => {
  return Object.values(TEST_USERS)
    .filter((user) => user.organizationMdsId === mdsId)
    .map((user) => {
      return {
        userId: user.userId,
        firstName: user.firstName,
        lastName: user.lastName,
        roles: user.roles,
      };
    });
};

export const getNumberOfOrganizationMembers = (mdsId: string): number => {
  return Object.values(TEST_USERS).filter(
    (user) => user.organizationMdsId === mdsId,
  ).length;
};

const generateNewId = (): string => {
  const usersCounter = Object.keys(TEST_USERS).length;
  const counterStr = usersCounter.toString().padStart(8, '0');
  const uuid = `00000000-0000-0000-0000-${counterStr}`;
  return uuid;
};

const generateRoles = (userRole: UserRoleDto): UserRoleDto[] => {
  return [userRole];
};
