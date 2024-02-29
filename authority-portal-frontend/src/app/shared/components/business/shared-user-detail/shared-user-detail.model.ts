import {UserDetailDto} from '@sovity.de/authority-portal-client';
import {UserRoleUpdateConfig} from './user-role-update-config';

export interface UserDetailConfig {
  userId: string;
  user: UserDetailDto;
  pageFor: 'AUTHORITY_VIEW' | 'INTERNAL_VIEW' | 'OWN';
  usageType: 'DETAIL_PAGE' | 'CONTROL_CENTER_PAGE';
  roles: UserRoleUpdateConfig;
}
