import {UserRoleDto} from '@sovity.de/authority-portal-client';

export function mapRolesToReadableFormat(role: string | UserRoleDto): string {
  const words = role
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase());
  return words.join(' ');
}

export function roleSelectConfig(type: 'AUTHORITY' | 'PARTICIPANT') {
  if (type === 'PARTICIPANT') {
    return Object.values(UserRoleDto).filter((it) => it.startsWith(type));
  }
  return Object.values(UserRoleDto).filter(
    (it) => !it.startsWith('PARTICIPANT'),
  );
}

export function buildRoleSelectConfig(
  currentUserRoles: UserRoleDto[],
  type: 'AUTHORITY' | 'PARTICIPANT',
) {
  if (type === 'AUTHORITY') {
    return currentUserRoles.find((it) => !it.startsWith('PARTICIPANT')) ?? '';
  }
  return currentUserRoles.find((it) => it.startsWith('PARTICIPANT')) ?? '';
}
