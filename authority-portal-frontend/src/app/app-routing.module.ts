import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AuthorityInviteNewOrganizationComponent} from 'src/app/pages/authority-invite-new-organization/authority-invite-new-organization/authority-invite-new-organization.component';
import {AuthorityOrganizationUserDetailPageComponent} from 'src/app/pages/authority-organization-user-detail-page/authority-organization-user-detail-page/authority-organization-user-detail-page.component';
import {ParticipantOrganizationProfilePageComponent} from 'src/app/pages/participant-organization-profile-page/participant-organization-profile-page/participant-organization-profile-page.component';
import {ParticipantUserDetailPageComponent} from 'src/app/pages/participant-user-detail-page/participant-user-detail-page/participant-user-detail-page.component';
import {UserProfilePageComponent} from 'src/app/pages/user-profile-page/user-profile-page/user-profile-page.component';
import {UserRoleDto} from '../../../authority-portal-backend/authority-portal-api-client-ts';
import {requiresRole} from './common/auth/requires-role-guard';
import {PortalLayoutComponent} from './common/layouts/portal-layout/portal-layout/portal-layout.component';
import {AuthorityConnectorDetailPageComponent} from './pages/authority-connector-detail-page/authority-connector-detail-page/authority-connector-detail-page.component';
import {AuthorityConnectorListPageComponent} from './pages/authority-connector-list-page/authority-connector-list-page/authority-connector-list-page.component';
import {AuthorityOrganizationDetailPageComponent} from './pages/authority-organization-detail-page/authority-organization-detail-page/authority-organization-detail-page.component';
import {AuthorityOrganizationListPageComponent} from './pages/authority-organization-list-page/authority-organization-list-page/authority-organization-list-page.component';
import {CentralComponentCreatePageComponent} from './pages/central-component-create-page/central-component-create-page/central-component-create-page.component';
import {CentralComponentListPageComponent} from './pages/central-component-list-page/central-component-list-page/central-component-list-page.component';
import {DashboardPageComponent} from './pages/dashboard-page/dashboard-page/dashboard-page.component';
import {LoadingPageComponent} from './pages/loading-page/loading-page/loading-page.component';
import {ParticipantInviteNewUserComponent} from './pages/participant-invite-new-user/participant-invite-new-user/participant-invite-new-user.component';
import {ParticipantOwnConnectorDetailPageComponent} from './pages/participant-own-connector-detail-page/participant-own-connector-detail-page/participant-own-connector-detail-page.component';
import {ParticipantOwnConnectorListPageComponent} from './pages/participant-own-connector-list-page/participant-own-connector-list-page/participant-own-connector-list-page.component';
import {ParticipantRegisterOwnConnectorPageComponent} from './pages/participant-register-own-connector-page/participant-register-own-connector-page/participant-register-own-connector-page.component';
import {RegisterConnectorPageComponent} from './pages/participant-register-own-connector-page/sub-pages/register-connector-page/register-connector-page.component';
import {SetupConnectorPageComponent} from './pages/participant-register-own-connector-page/sub-pages/setup-connector-page/setup-connector-page.component';
import {ProvideConnectorPageComponent} from './pages/provide-connector-page/provide-connector-page/provide-connector-page.component';
import {RegistrationProcessWizardComponent} from './pages/registration-process-wizard/registration-process-wizard.component';

export const REGISTRATION_PROCESS_ROUTES: Routes = [
  {
    path: 'create-organization',
    component: RegistrationProcessWizardComponent,
  },
  {
    path: '**',
    redirectTo: 'create-organization',
    pathMatch: 'full',
  },
];

export const LOADING_ROUTES: Routes = [
  {
    path: '**',
    component: LoadingPageComponent,
  },
];

export const AUTHORITY_PORTAL_ROUTES: Routes = [
  // participant own connector registration
  {
    path: 'my-organization/connectors/registration',
    component: ParticipantRegisterOwnConnectorPageComponent,
    data: {
      requiresRole: ['PARTICIPANT_CURATOR'] satisfies UserRoleDto[],
    },
    canActivate: [requiresRole],
  },
  {
    path: 'my-organization/connectors/registration/setup',
    component: SetupConnectorPageComponent,
    data: {
      requiresRole: ['PARTICIPANT_CURATOR'] satisfies UserRoleDto[],
    },
    canActivate: [requiresRole],
  },
  {
    path: 'my-organization/connectors/registration/register',
    component: RegisterConnectorPageComponent,
    data: {
      requiresRole: ['PARTICIPANT_CURATOR'] satisfies UserRoleDto[],
    },
    canActivate: [requiresRole],
  },

  {
    path: '',
    component: PortalLayoutComponent,
    children: [
      {path: '', redirectTo: 'dashboard', pathMatch: 'full'},
      {
        path: 'dashboard',
        component: DashboardPageComponent,
        data: {
          requiresRole: ['PARTICIPANT_USER'] satisfies UserRoleDto[],
        },
        canActivate: [requiresRole],
      },
      {
        path: 'profile',
        component: UserProfilePageComponent,
        data: {
          requiresRole: ['PARTICIPANT_USER'] satisfies UserRoleDto[],
        },
        canActivate: [requiresRole],
      },
      // My Organization Section
      {
        path: 'my-organization/profile',
        component: ParticipantOrganizationProfilePageComponent,
        data: {
          requiresRole: ['PARTICIPANT_USER'] satisfies UserRoleDto[],
        },
        canActivate: [requiresRole],
      },
      {
        path: 'my-organization/users/invite',
        component: ParticipantInviteNewUserComponent,
        data: {
          requiresRole: ['PARTICIPANT_ADMIN'] satisfies UserRoleDto[],
        },
        canActivate: [requiresRole],
      },
      {
        path: 'my-organization/users/:userId',
        component: ParticipantUserDetailPageComponent,
        data: {
          requiresRole: ['PARTICIPANT_USER'] satisfies UserRoleDto[],
        },
        canActivate: [requiresRole],
      },
      {
        path: 'my-organization/connectors',
        component: ParticipantOwnConnectorListPageComponent,
        data: {
          requiresRole: ['PARTICIPANT_USER'] satisfies UserRoleDto[],
        },
        canActivate: [requiresRole],
      },
      {
        path: 'my-organization/connectors/register',
        component: ParticipantRegisterOwnConnectorPageComponent,
        data: {
          requiresRole: ['PARTICIPANT_CURATOR'] satisfies UserRoleDto[],
        },
        canActivate: [requiresRole],
      },
      {
        path: 'my-organization/connectors/provide-connector',
        component: ProvideConnectorPageComponent,
        data: {
          requiresRole: ['SERVICE_PARTNER_ADMIN'] satisfies UserRoleDto[],
        },
        canActivate: [requiresRole],
      },
      {
        path: 'my-organization/connectors/:connectorId',
        component: ParticipantOwnConnectorDetailPageComponent,
        data: {
          requiresRole: ['PARTICIPANT_USER'] satisfies UserRoleDto[],
        },
        canActivate: [requiresRole],
      },

      {
        path: 'my-organization',
        redirectTo: 'my-organization/profile',
        pathMatch: 'full',
      },

      // Operator Admin Section
      {
        path: 'operator/central-components',
        component: CentralComponentListPageComponent,
        data: {
          requiresRole: ['OPERATOR_ADMIN'] satisfies UserRoleDto[],
        },
        canActivate: [requiresRole],
      },
      {
        path: 'operator/central-components/provide',
        component: CentralComponentCreatePageComponent,
        data: {
          requiresRole: ['OPERATOR_ADMIN'] satisfies UserRoleDto[],
        },
        canActivate: [requiresRole],
      },

      // Service Provider Section

      // Participant Section

      // Authority Section
      {
        path: 'authority/organizations/invite-new-organization',
        component: AuthorityInviteNewOrganizationComponent,
        data: {
          requiresRole: ['AUTHORITY_USER'] satisfies UserRoleDto[],
        },
        canActivate: [requiresRole],
      },
      {
        path: 'authority/organizations',
        component: AuthorityOrganizationListPageComponent,
        data: {
          requiresRole: ['AUTHORITY_USER'] satisfies UserRoleDto[],
        },
        canActivate: [requiresRole],
      },
      {
        path: 'authority/organizations/:mdsId',
        component: AuthorityOrganizationDetailPageComponent,
        data: {
          requiresRole: ['AUTHORITY_USER'] satisfies UserRoleDto[],
        },
        canActivate: [requiresRole],
      },
      {
        path: 'authority/organizations/:mdsId/users/:userId',
        component: AuthorityOrganizationUserDetailPageComponent,
        data: {
          requiresRole: ['AUTHORITY_USER'] satisfies UserRoleDto[],
        },
        canActivate: [requiresRole],
      },
      {
        path: 'authority/connectors',
        component: AuthorityConnectorListPageComponent,
        data: {
          requiresRole: ['AUTHORITY_USER'] satisfies UserRoleDto[],
        },
        canActivate: [requiresRole],
      },
      {
        path: '**',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(LOADING_ROUTES)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
