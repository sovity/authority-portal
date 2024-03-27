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
import {Route} from '@angular/router';
import {UserRoleDto} from '@sovity.de/authority-portal-client';
import {ControlCenterOrganizationEditPageComponent} from '../control-center-organization-edit-page/control-center-organization-edit-page/control-center-organization-edit-page.component';
import {ControlCenterOrganizationMemberDetailPageComponent} from '../control-center-organization-member-detail-page/control-center-organization-member-detail-page/control-center-organization-member-detail-page.component';
import {ControlCenterOrganizationMembersPageComponent} from '../control-center-organization-members-page/control-center-organization-members-page/control-center-organization-members-page.component';
import {ControlCenterOrganizationProfilePageComponent} from '../control-center-organization-profile-page/control-center-organization-profile-page/control-center-organization-profile-page.component';
import {ControlCenterUserEditPageComponent} from '../control-center-user-edit-page/control-center-user-edit-page/control-center-user-edit-page.component';
import {ControlCenterUserProfilePageComponent} from '../control-center-user-profile-page/control-center-user-profile-page/control-center-user-profile-page.component';
import {PageNotFoundPageComponent} from '../empty-pages/page-not-found-page/page-not-found-page/page-not-found-page.component';

export type ControlCenterRoute = Route & {
  data:
    | {
        title: string;
      }
    | {
        excludeFromTabs: true;
        requiredRoles?: UserRoleDto[];
      };
};

export const CONTROL_CENTER_ROUTES: ControlCenterRoute[] = [
  {
    path: 'my-profile',
    component: ControlCenterUserProfilePageComponent,
    data: {
      title: 'My Profile',
    },
  },
  {
    path: 'my-profile/edit',
    component: ControlCenterUserEditPageComponent,
    data: {
      excludeFromTabs: true,
    },
  },
  {
    path: 'my-organization',
    component: ControlCenterOrganizationProfilePageComponent,
    data: {
      title: 'My Organization',
    },
  },
  {
    path: 'my-organization/edit',
    component: ControlCenterOrganizationEditPageComponent,
    data: {
      excludeFromTabs: true,
      requiredRoles: ['ADMIN'],
    },
  },
  {
    path: 'users-and-roles',
    component: ControlCenterOrganizationMembersPageComponent,
    data: {
      title: 'Users & Roles',
    },
  },
  {
    path: 'users-and-roles/:userId',
    component: ControlCenterOrganizationMemberDetailPageComponent,
    data: {
      excludeFromTabs: true,
    },
  },
  {
    path: '**',
    component: PageNotFoundPageComponent,
    pathMatch: 'full',
    data: {
      excludeFromTabs: true,
    },
  },
];
