import {UserRoleDto} from '@sovity.de/authority-portal-client';

export function mapRolesToReadableFormat(
  role: string | UserRoleDto | null,
): string {
  if (!role) {
    return 'None';
  }

  const words = role
    .split('_')
    .map(
      (word: string) =>
        word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(),
    );
  return words.join(' ');
}

export function getHighestApplicationRole(currentUserRoles: UserRoleDto[]) {
  return getHighestRole(currentUserRoles.filter((it) => isApplicationRole(it)));
}

export function getHighestParticipantRole(currentUserRoles: UserRoleDto[]) {
  return getHighestRole(
    currentUserRoles.filter((it) => !isApplicationRole(it)),
  );
}

/**
 * returns the highest role from the given roles
 * the roles are ordered from highest to lowest
 * @param roles
 * @returns
 */
export function getHighestRole(userRoles: UserRoleDto[]): UserRoleDto {
  const allRoles = Object.values(UserRoleDto);

  return allRoles[
    Math.min(
      ...userRoles.map((uRr) => allRoles.findIndex((aRr) => uRr === aRr)),
    )
  ];
}

export function getAvailableRoles(ownerUserRoles: string[]): string[] {
  if (ownerUserRoles.includes('AUTHORITY_ADMIN')) {
    return [
      'AUTHORITY_ADMIN',
      'AUTHORITY_USER',
      'SERVICE_PARTNER_ADMIN',
      'OPERATOR_ADMIN',
    ];
  } else if (ownerUserRoles.includes('SERVICE_PARTNER_ADMIN')) {
    return ['SERVICE_PARTNER_ADMIN'];
  } else if (ownerUserRoles.includes('OPERATOR_ADMIN')) {
    return ['OPERATOR_ADMIN'];
  } else if (ownerUserRoles.includes('ADMIN')) {
    return ['ADMIN', 'KEY_USER', 'USER'];
  } else {
    return [];
  }
}

export function isApplicationRole(role: UserRoleDto): boolean {
  return (
    role !== UserRoleDto.Admin &&
    role !== UserRoleDto.KeyUser &&
    role !== UserRoleDto.User
  );
}
