/*
 * Copyright (c) 2024 sovity GmbH
 *
 * This program and the accompanying materials are made available under the
 * terms of the Apache License, Version 2.0 which is available at
 * https://www.apache.org/licenses/LICENSE-2.0
 *
 * SPDX-License-Identifier: Apache-2.0
 *
 * Contributors:
 *      sovity GmbH - initial implementation
 */

import {
  UserDetailDto,
  UserInfo,
  UserRoleDto,
} from '@sovity.de/authority-portal-client';
import {
  getAvailableRoles,
  getHighestApplicationRole,
  getHighestParticipantRole,
  getHighestRolesString,
  isApplicationRole,
  isParticipantRole,
} from '../../../../core/utils/user-role-utils';

export interface UserRoleUpdateConfig {
  canEdit: boolean;

  currentParticipantRole: UserRoleDto;
  currentApplicationRole: UserRoleDto | null;

  canChangeApplicationRole: boolean;
  canChangeParticipantRole: boolean;

  availableParticipantRoles: UserRoleDto[];
  availableApplicationRoles: UserRoleDto[];

  readableRolesAsString: string;
  onRoleUpdateSuccessful: () => void;
}

export function buildUserRoleUpdateConfig(options: {
  ownUserId: string;
  ownUserMdsId: string;
  ownRoles: UserRoleDto[];
  targetUserId: string;
  targetUserMdsId: string;
  targetRoles: UserRoleDto[];
  onRoleUpdateSuccessful: () => void;
}): UserRoleUpdateConfig {
  const {
    ownUserId,
    ownUserMdsId,
    ownRoles,
    targetUserId,
    targetUserMdsId,
    targetRoles,
    onRoleUpdateSuccessful,
  } = options;

  const currentApplicationRole = getHighestApplicationRole(targetRoles);
  const currentParticipantRole = getHighestParticipantRole(targetRoles);

  const availableRoles = getAvailableRoles(
    ownRoles,
    ownUserMdsId === targetUserMdsId,
  );
  const canChangeApplicationRole = availableRoles.some(isApplicationRole);
  const canChangeParticipantRole = availableRoles.some(isParticipantRole);

  const filterAvailableRoles = (
    filter: (role: UserRoleDto) => boolean,
    mustInclude: UserRoleDto | null,
  ) => {
    const available = availableRoles.filter(filter);
    if (mustInclude && !available.includes(mustInclude)) {
      available.push(mustInclude);
    }
    return available;
  };

  const availableApplicationRoles = filterAvailableRoles(
    isApplicationRole,
    currentApplicationRole,
  );

  const availableParticipantRoles = filterAvailableRoles(
    isParticipantRole,
    currentParticipantRole,
  );

  const readableRoleList = getHighestRolesString(targetRoles);

  return {
    canEdit:
      ownUserId !== targetUserId &&
      (canChangeApplicationRole || canChangeParticipantRole),
    currentApplicationRole,
    currentParticipantRole,
    canChangeApplicationRole,
    canChangeParticipantRole,
    availableApplicationRoles,
    availableParticipantRoles,
    readableRolesAsString: readableRoleList,
    onRoleUpdateSuccessful,
  };
}

export function buildUserRoleUpdateConfigFromUserInfo(options: {
  currentUser: UserInfo;
  target: UserInfo | UserDetailDto;
  onRoleUpdateSuccessful: () => void;
}): UserRoleUpdateConfig {
  const {currentUser, target, onRoleUpdateSuccessful} = options;

  return buildUserRoleUpdateConfig({
    ownRoles: currentUser.roles,
    ownUserId: currentUser.userId,
    ownUserMdsId: currentUser.organizationMdsId,
    targetRoles: target.roles,
    targetUserId: target.userId,
    targetUserMdsId: target.organizationMdsId,
    onRoleUpdateSuccessful,
  });
}

export function buildUserRoleUpdateConfigUneditable(
  roles: UserRoleDto[],
): UserRoleUpdateConfig {
  return buildUserRoleUpdateConfig({
    ownRoles: [],
    ownUserId: '',
    ownUserMdsId: '',
    targetRoles: roles,
    targetUserId: '',
    targetUserMdsId: '',
    onRoleUpdateSuccessful: () => {},
  });
}
