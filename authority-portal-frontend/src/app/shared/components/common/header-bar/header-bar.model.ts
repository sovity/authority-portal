import {UserRoleDto} from '@sovity.de/authority-portal-client';

export interface HeaderBarConfig {
  title: string;
  subtitle: string;
  headerActions: HeaderBarAction[];
}

export interface HeaderBarAction {
  label: string;
  icon?: string;
  action: string;
  permissions: UserRoleDto[];
}
