import {Route} from '@angular/router';
import {ControlCenterOrganizationMemberDetailPageComponent} from '../control-center-organization-member-detail-page/control-center-organization-member-detail-page/control-center-organization-member-detail-page.component';
import {ControlCenterOrganizationMembersPageComponent} from '../control-center-organization-members-page/control-center-organization-members-page/control-center-organization-members-page.component';
import {ControlCenterOrganizationProfilePageComponent} from '../control-center-organization-profile-page/control-center-organization-profile-page/control-center-organization-profile-page.component';
import {ControlCenterUserProfilePageComponent} from '../control-center-user-profile-page/control-center-user-profile-page/control-center-user-profile-page.component';

export type ControlCenterRoute = Route & {
  data:
    | {
        title: string;
      }
    | {
        excludeFromTabs: true;
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
    path: 'my-organization',
    component: ControlCenterOrganizationProfilePageComponent,
    data: {
      title: 'My Organization',
    },
  },
  {
    path: 'my-users',
    component: ControlCenterOrganizationMembersPageComponent,
    data: {
      title: 'Users & Roles',
    },
  },
  {
    path: 'my-users/:userId',
    component: ControlCenterOrganizationMemberDetailPageComponent,
    data: {
      excludeFromTabs: true,
    },
  },
  {
    path: '**',
    redirectTo: 'user-profile',
    pathMatch: 'full',
    data: {
      excludeFromTabs: true,
    },
  },
];
