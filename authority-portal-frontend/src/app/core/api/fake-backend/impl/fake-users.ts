import {
  IdResponse,
  InviteParticipantUserRequest,
  MemberInfo,
  UserInfo,
  UserRoleDto,
} from '@sovity.de/authority-portal-client';
import {Patcher, patchObj} from 'src/app/core/utils/object-utils';
import {updateOrganization} from './fake-organizations';

export let TEST_USERS: {[key: string]: UserInfo} = {
  '00000000-0000-0000-0000-00000001': {
    userId: '00000000-0000-0000-0000-00000001',
    firstName: 'Authority',
    lastName: 'Admin',
    email: 'authority@admin.com',
    roles: [
      'AUTHORITY_ADMIN',
      'AUTHORITY_USER',
      'PARTICIPANT_ADMIN',
      'PARTICIPANT_USER',
      'PARTICIPANT_CURATOR',
    ],
    registrationStatus: 'ACTIVE',
    organizationName: 'Authority Organization',
    organizationMdsId: 'MDSL1111AA',
  },
  '00000000-0000-0000-0000-00000002': {
    userId: '00000000-0000-0000-0000-00000002',
    firstName: 'Authority',
    lastName: 'User',
    email: 'authority@user.com',
    roles: ['AUTHORITY_USER', 'PARTICIPANT_USER'],
    registrationStatus: 'ACTIVE',
    organizationName: 'Authority Organization',
    organizationMdsId: 'MDSL1111AA',
  },
  '00000000-0000-0000-0000-00000003': {
    userId: '00000000-0000-0000-0000-00000003',
    firstName: 'Participant',
    lastName: 'Admin',
    email: 'participant@admin.com',
    roles: ['PARTICIPANT_ADMIN', 'PARTICIPANT_CURATOR', 'PARTICIPANT_USER'],
    registrationStatus: 'ACTIVE',
    organizationName: 'Participant Organization',
    organizationMdsId: 'MDSL2222BB',
  },
  '00000000-0000-0000-0000-00000004': {
    userId: '00000000-0000-0000-0000-00000004',
    firstName: 'Participant',
    lastName: 'User',
    email: 'participant@user.com',
    roles: ['PARTICIPANT_USER'],
    registrationStatus: 'ACTIVE',
    organizationName: 'Participant Organization',
    organizationMdsId: 'MDSL2222BB',
  },
  '00000000-0000-0000-0000-00000005': {
    userId: '00000000-0000-0000-0000-00000005',
    firstName: 'Created',
    lastName: 'User',
    email: 'created@user.com',
    roles: [],
    registrationStatus: 'CREATED',
    organizationName: '',
    organizationMdsId: '',
  },
  '00000000-0000-0000-0000-00000006': {
    userId: '00000000-0000-0000-0000-00000006',
    firstName: 'Pending',
    lastName: 'User',
    email: 'pending@user.com',
    roles: [],
    registrationStatus: 'PENDING',
    organizationName: '',
    organizationMdsId: 'MDSL5555EE',
  },
  '00000000-0000-0000-0000-00000007': {
    userId: '00000000-0000-0000-0000-00000007',
    firstName: 'Pending',
    lastName: 'User',
    email: 'pending2@user.com',
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
  const newUserId = generateNewId();

  const newUser = {
    userId: newUserId,
    firstName: request.firstName,
    lastName: request.lastName,
    email: request.email,
    roles: generateRoles(request.role),
    registrationStatus: 'INVITED',
    organizationMdsId: getUserInfo().organizationMdsId,
    organizationName: getUserInfo().organizationName,
  } satisfies UserInfo;

  updateOrganization(getUserInfo().organizationMdsId, (organization) => {
    return {
      ...organization,
      memberInfos: [...organization.memberList, newUser],
    };
  });

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
        email: user.email
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
