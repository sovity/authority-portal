import {
  ChangeApplicationRoleRequest,
  ChangeParticipantRoleRequest,
  ClearApplicationRoleRequest,
  IdResponse,
  InviteParticipantUserRequest,
  MemberInfo,
  OnboardingUserUpdateDto,
  PossibleCreatorSuccessor,
  UserDeletionCheck,
  UserDetailDto,
  UserInfo,
  UserRoleDto,
} from '@sovity.de/authority-portal-client';
import {Patcher, patchObj} from 'src/app/core/utils/object-utils';
import {isApplicationRole} from '../../../utils/user-role-utils';
import {
  deleteOrganization,
  getOrganizationDetails,
  getParticipantAdmins,
  updateOrganization,
} from './fake-organizations';

export const TEST_USERS: Record<string, UserInfo> = {
  '00000000-0000-0000-0000-000000000001': {
    authenticationStatus: 'AUTHENTICATED',
    userId: '00000000-0000-0000-0000-000000000001',
    firstName: 'Authority',
    lastName: 'Admin',
    roles: ['AUTHORITY_ADMIN', 'AUTHORITY_USER', 'ADMIN', 'KEY_USER', 'USER'],
    registrationStatus: 'ACTIVE',
    organizationName: 'Authority Organization',
    organizationMdsId: 'MDSL1111AA',
  },
  '00000000-0000-0000-0000-000000000002': {
    authenticationStatus: 'AUTHENTICATED',
    userId: '00000000-0000-0000-0000-000000000002',
    firstName: 'Authority',
    lastName: 'User',
    roles: ['AUTHORITY_USER', 'USER'],
    registrationStatus: 'ACTIVE',
    organizationName: 'Authority Organization',
    organizationMdsId: 'MDSL1111AA',
  },
  '00000000-0000-0000-0000-000000000003': {
    authenticationStatus: 'AUTHENTICATED',
    userId: '00000000-0000-0000-0000-000000000003',
    firstName: 'Participant',
    lastName: 'Admin',
    roles: ['ADMIN', 'KEY_USER', 'USER'],
    registrationStatus: 'ACTIVE',
    organizationName: 'Participant Organization',
    organizationMdsId: 'MDSL2222BB',
  },
  '00000000-0000-0000-0000-000000000004': {
    authenticationStatus: 'AUTHENTICATED',
    userId: '00000000-0000-0000-0000-000000000004',
    firstName: 'Participant',
    lastName: 'User',
    roles: ['USER'],
    registrationStatus: 'ACTIVE',
    organizationName: 'Participant Organization',
    organizationMdsId: 'MDSL2222BB',
  },
  '00000000-0000-0000-0000-000000000007': {
    authenticationStatus: 'AUTHENTICATED',
    userId: '00000000-0000-0000-0000-000000000007',
    firstName: 'Service',
    lastName: 'Partner',
    roles: ['SERVICE_PARTNER_ADMIN', 'ADMIN', 'KEY_USER', 'USER'],
    registrationStatus: 'ACTIVE',
    organizationName: 'Service Partner Organization',
    organizationMdsId: 'MDSL7777AA',
  },
  '00000000-0000-0000-0000-000000000009': {
    authenticationStatus: 'AUTHENTICATED',
    userId: '00000000-0000-0000-0000-000000000009',
    firstName: 'Operator',
    lastName: 'Admin',
    roles: ['OPERATOR_ADMIN', 'ADMIN', 'KEY_USER', 'USER'],
    registrationStatus: 'ACTIVE',
    organizationName: 'Operator Organization',
    organizationMdsId: 'MDSL8888EE',
  },
  unauthenticated: {
    authenticationStatus: 'UNAUTHENTICATED',
    userId: 'unauthenticated',
    roles: ['UNAUTHENTICATED'],
    registrationStatus: undefined,
    firstName: 'Unauthenticated',
    lastName: 'User',
    organizationName: 'No Organization',
    organizationMdsId: 'unauthenticated',
  },
  '00000000-0000-0000-0000-00000013': {
    authenticationStatus: 'AUTHENTICATED',
    userId: '00000000-0000-0000-0000-00000013',
    firstName: 'Onboarding',
    lastName: 'Organization',
    roles: ['ADMIN'],
    registrationStatus: 'ONBOARDING',
    organizationName: 'Dev Organization 1',
    organizationMdsId: 'MDSL1111AA',
  },
  '00000000-0000-0000-0000-00000014': {
    authenticationStatus: 'AUTHENTICATED',
    userId: '00000000-0000-0000-0000-00000014',
    firstName: 'Onboarding',
    lastName: 'User',
    roles: ['USER'],
    registrationStatus: 'ONBOARDING',
    organizationName: 'Dev Organization 2',
    organizationMdsId: 'MDSL2222BB',
  },
  '00000000-0000-0000-0000-000000000006': {
    authenticationStatus: 'AUTHENTICATED',
    userId: '00000000-0000-0000-0000-000000000006',
    firstName: 'Pending',
    lastName: 'User',
    roles: [],
    registrationStatus: 'PENDING',
    organizationName: '',
    organizationMdsId: 'MDSL5555EE',
  },
  '00000000-0000-0000-0000-00000011': {
    authenticationStatus: 'AUTHENTICATED',
    userId: '00000000-0000-0000-0000-00000011',
    firstName: 'Rejected',
    lastName: 'User',
    roles: ['ADMIN', 'KEY_USER', 'USER'],
    registrationStatus: 'REJECTED',
    organizationName: 'Rejected Organization',
    organizationMdsId: 'MDSL6666EE',
  },
};

export const OTHER_USERS: Record<string, UserInfo> = {
  '00000000-0000-0000-0000-100000000001': {
    userId: '00000000-0000-0000-0000-100000000001',
    firstName: 'New Participant',
    lastName: 'Admin',
    roles: ['ADMIN', 'KEY_USER', 'USER'],
    registrationStatus: 'ACTIVE',
    authenticationStatus: 'AUTHENTICATED',
    organizationName: 'Three Users',
    organizationMdsId: 'MDSL9111ZZ',
  },
  '00000000-0000-0000-0000-100000000002': {
    userId: '00000000-0000-0000-0000-100000000002',
    firstName: 'Organization',
    lastName: 'Creator',
    roles: ['ADMIN', 'KEY_USER', 'USER'],
    registrationStatus: 'ACTIVE',
    authenticationStatus: 'AUTHENTICATED',
    organizationName: 'Three Users',
    organizationMdsId: 'MDSL9111ZZ',
  },
  '00000000-0000-0000-0000-100000000003': {
    userId: '00000000-0000-0000-0000-100000000003',
    firstName: 'Normal',
    lastName: 'User',
    roles: ['AUTHORITY_USER', 'USER'],
    registrationStatus: 'ACTIVE',
    authenticationStatus: 'AUTHENTICATED',
    organizationName: 'Three Users',
    organizationMdsId: 'MDSL9111ZZ',
  },
};

export let ALL_USERS = {...TEST_USERS, ...OTHER_USERS};

/**
 * Currently "logged-in user" for local dev UI
 */
let currentlyLoggedInUser: UserInfo =
  TEST_USERS['00000000-0000-0000-0000-000000000001'];

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

export const getUserOrThrow = (userId: string): UserInfo => {
  const id = Object.keys(ALL_USERS).find((id) => id === userId);
  if (!id) throw new Error(`User not found ${userId}`);

  return ALL_USERS[id];
};

export const userDetails = (userId: string): UserDetailDto => {
  const user = ALL_USERS[userId];

  return {
    firstName: user.firstName,
    lastName: user.lastName,
    email: 'email@example.com',
    roles: user.roles,
    registrationStatus: user.registrationStatus!,
    creationDate: new Date(),
    organizationName: user.organizationName,
    phone: '+49 231 1234567',
    position: 'Employee',
    onboardingType: 'SELF_REGISTRATION',
    invitingUserId: '00000000-0000-0000-0000-000000000001',
    invitingUserFirstName: 'Authority',
    invitingUserLastName: 'Admin',
  };
};

export const addUser = (user: UserInfo) => {
  ALL_USERS[user.userId] = user;
};

export const inviteUser = (
  request: InviteParticipantUserRequest,
): IdResponse => {
  const newUserId = generateNewId();

  const newUser: UserInfo = {
    authenticationStatus: 'AUTHENTICATED',
    userId: newUserId,
    firstName: request.firstName,
    lastName: request.lastName,
    roles: generateRoles(request.role),
    registrationStatus: 'INVITED',
    organizationMdsId: getUserInfo().organizationMdsId,
    organizationName: getUserInfo().organizationName,
  };

  updateOrganization(getUserInfo().organizationMdsId, (organization) => {
    return {
      ...organization,
      memberList: [...organization.memberList, newUser as MemberInfo],
      memberCount: organization.memberCount + 1,
    };
  });

  addUser(newUser);

  return {id: newUserId, changedDate: new Date()};
};

const generateNewId = (): string => {
  const usersCounter = Object.keys(TEST_USERS).length;
  const counterStr = usersCounter.toString().padStart(8, '0');
  return `00000000-0000-0000-0000-${counterStr + 1}`;
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

  if (newRole === 'ADMIN') {
    new_participant_roles = ['ADMIN', 'KEY_USER', 'USER'];
  } else if (newRole === 'KEY_USER') {
    new_participant_roles = ['KEY_USER', 'USER'];
  } else if (newRole === 'USER') {
    new_participant_roles = ['USER'];
  }

  const oldApplicationRoles = user.roles.filter((role: UserRoleDto) =>
    isApplicationRole(role),
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

  const oldParticipantRoles = user.roles.filter(
    (role: UserRoleDto) => !isApplicationRole(role),
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

  const oldParticipantRoles = user.roles.filter(
    (role: UserRoleDto) => !isApplicationRole(role),
  );

  TEST_USERS[request.userId] = {
    ...user,
    roles: [...oldParticipantRoles],
  };

  return {id: request.userId, changedDate: new Date()};
};

export const onboardUser = (request: OnboardingUserUpdateDto): IdResponse => {
  return {id: '000001', changedDate: new Date()};
};

export const cascadeDeleteUser = (
  userId: string,
  successorUserId: string | null,
): IdResponse => {
  const userDeletionCheck = checkUserDeletion(userId);
  const user = getUserOrThrow(userId);
  const organization = getOrganizationDetails(user.organizationMdsId);

  if (userDeletionCheck.isLastParticipantAdmin) {
    deleteOrganization(organization.mdsId);
  } else {
    if (userDeletionCheck.isOrganizationCreator) {
      if (!successorUserId) {
        throw new Error("Can't delete organization creator without successor");
      }
      const successorUser = getUserOrThrow(successorUserId);
      updateOrganization(organization.mdsId, () => ({
        createdByUserId: successorUser.userId,
        createdByFirstName: successorUser.firstName,
        createdByLastName: successorUser.lastName,
      }));
    }
    updateOrganization(organization.mdsId, (o) => ({
      memberList: o.memberList.filter((x) => x.userId !== userId),
      memberCount: o.memberCount - 1,
    }));
  }

  return deleteUser(userId);
};

const deleteUser = (userId: string): IdResponse => {
  delete ALL_USERS[userId];
  return {id: userId, changedDate: new Date()};
};

export const checkUserDeletion = (userId: string): UserDeletionCheck => {
  const user = getUserOrThrow(userId);
  const organization = getOrganizationDetails(user.organizationMdsId);
  const participantAdmins = getParticipantAdmins(organization);

  const isLastParticipantAdmin =
    participantAdmins.length === 1 && userId === participantAdmins[0].userId;
  const isOrganizationCreator = organization.createdByUserId === userId;
  let possibleSuccessors: PossibleCreatorSuccessor[] = [];

  if (!isLastParticipantAdmin && isOrganizationCreator) {
    possibleSuccessors = participantAdmins.filter((x) => x.userId !== userId);
  }

  return {
    userId,
    isLastParticipantAdmin,
    isOrganizationCreator,
    possibleSuccessors,
  };
};
