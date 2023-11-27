import {UserRoleDto} from '@sovity.de/authority-portal-client';
import {SidebarMenu} from '../sidebar-element/sidebar-element.model';

export interface SidebarSection {
  title: string;
  userRoles: UserRoleDto[];
  menus: SidebarMenu[];
}
