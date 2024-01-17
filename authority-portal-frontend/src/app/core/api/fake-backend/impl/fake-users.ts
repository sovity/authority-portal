import {
  ChangeApplicationRoleRequest,
  ChangeParticipantRoleRequest,
  ClearApplicationRoleRequest,
  IdResponse,
  InviteParticipantUserRequest,
  MemberInfo,
  UserDetailDto,
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
    roles: [
      'AUTHORITY_ADMIN',
      'AUTHORITY_USER',
      'PARTICIPANT_ADMIN',
      'PARTICIPANT_CURATOR',
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
  '00000000-0000-0000-0000-00000007': {
    userId: '00000000-0000-0000-0000-00000007',
    firstName: 'Service Partner',
    lastName: 'PartAdmin',
    roles: [
      'SERVICE_PARTNER_ADMIN',
      'PARTICIPANT_ADMIN',
      'PARTICIPANT_CURATOR',
      'PARTICIPANT_USER',
    ],
    registrationStatus: 'ACTIVE',
    organizationName: 'Service Partner Organization',
    organizationMdsId: 'MDSL7777AA',
  },
  '00000000-0000-0000-0000-00000008': {
    userId: '00000000-0000-0000-0000-00000008',
    firstName: 'Service Partner',
    lastName: 'PartUser',
    roles: ['PARTICIPANT_USER'],
    registrationStatus: 'ACTIVE',
    organizationName: 'Service Partner Organization',
    organizationMdsId: 'MDSL7777AA',
  },
  '00000000-0000-0000-0000-00000009': {
    userId: '00000000-0000-0000-0000-00000009',
    firstName: 'Operator',
    lastName: 'Admin',
    roles: [
      'OPERATOR_ADMIN',
      'PARTICIPANT_ADMIN',
      'PARTICIPANT_CURATOR',
      'PARTICIPANT_USER',
    ],
    registrationStatus: 'ACTIVE',
    organizationName: 'Operator Organization',
    organizationMdsId: 'MDSL8888EE',
  },
  '00000000-0000-0000-0000-00000010': {
    userId: '00000000-0000-0000-0000-00000010',
    firstName: 'Operator',
    lastName: 'User',
    roles: ['PARTICIPANT_USER'],
    registrationStatus: 'ACTIVE',
    organizationName: 'Operator Organization',
    organizationMdsId: 'MDSL8888EE',
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

export const userDetails = (userId: string): UserDetailDto => {
  const user = TEST_USERS[userId];
  return {
    firstName: user.firstName,
    lastName: user.lastName,
    email: 'email@example.com',
    roles: user.roles,
    registrationStatus: user.registrationStatus,
    creationDate: new Date(),
    organizationName: user.organizationName,
    phone: '+49 231 1234567',
    position: 'Employee',
    onboardingType: 'SELF_REGISTRATION'
  };
};

export const inviteUser = (
  request: InviteParticipantUserRequest,
): IdResponse => {
  const newUserId = generateNewId();

  const newUser = {
    userId: newUserId,
    firstName: request.firstName,
    lastName: request.lastName,
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
        registrationStatus: user.registrationStatus
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

export const changeParticipantRole = (
  request: ChangeParticipantRoleRequest,
): IdResponse => {
  const user = TEST_USERS[request.userId];
  const newRole = request.body;

  let new_participant_roles: UserRoleDto[] = [];

  if (newRole === 'PARTICIPANT_ADMIN') {
    new_participant_roles = [
      'PARTICIPANT_ADMIN',
      'PARTICIPANT_CURATOR',
      'PARTICIPANT_USER',
    ];
  } else if (newRole === 'PARTICIPANT_CURATOR') {
    new_participant_roles = ['PARTICIPANT_CURATOR', 'PARTICIPANT_USER'];
  } else if (newRole === 'PARTICIPANT_USER') {
    new_participant_roles = ['PARTICIPANT_USER'];
  }

  let oldApplicationRoles = user.roles.filter(
    (role: UserRoleDto) => !role.startsWith('PARTICIPANT_'),
  );

  TEST_USERS[request.userId] = {
    ...user,
    roles: [...oldApplicationRoles, ...new_participant_roles],
  };

  return {id: request.userId, changedDate: new Date()};
};

export const changeApplicationRole = (
  request: ChangeApplicationRoleRequest,
): IdResponse => {
  const user = TEST_USERS[request.userId];
  const newRole = request.body;

  let new_application_roles: UserRoleDto[] = [];

  if (newRole === 'AUTHORITY_ADMIN') {
    new_application_roles = ['AUTHORITY_ADMIN', 'AUTHORITY_USER'];
  } else if (newRole === 'AUTHORITY_USER') {
    new_application_roles = ['AUTHORITY_USER'];
  } else if (newRole === 'SERVICE_PARTNER_ADMIN') {
    new_application_roles = ['SERVICE_PARTNER_ADMIN'];
  } else if (newRole === 'OPERATOR_ADMIN') {
    new_application_roles = ['OPERATOR_ADMIN'];
  }

  let oldParticipantRoles = user.roles.filter((role: UserRoleDto) =>
    role.startsWith('PARTICIPANT_'),
  );

  TEST_USERS[request.userId] = {
    ...user,
    roles: [...new_application_roles, ...oldParticipantRoles],
  };

  return {id: request.userId, changedDate: new Date()};
};

export const clearApplicationRole = (
  request: ClearApplicationRoleRequest,
): IdResponse => {
  const user = TEST_USERS[request.userId];

  let oldParticipantRoles = user.roles.filter((role: UserRoleDto) =>
    role.startsWith('PARTICIPANT_'),
  );

  TEST_USERS[request.userId] = {
    ...user,
    roles: [...oldParticipantRoles],
  };

  return {id: request.userId, changedDate: new Date()};
};
