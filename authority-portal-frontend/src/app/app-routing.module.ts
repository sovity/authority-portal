import {NgModule, Type} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {UserRoleDto} from '@sovity.de/authority-portal-client';
import {ParticipantUserDetailPageComponent} from 'src/app/pages/participant-user-detail-page/participant-user-detail-page/participant-user-detail-page.component';
import {requiresRole} from './common/auth/requires-role-guard';
import {PortalLayoutComponent} from './common/layouts/portal-layout/portal-layout/portal-layout.component';
import {AuthorityConnectorListPageComponent} from './pages/authority-connector-list-page/authority-connector-list-page/authority-connector-list-page.component';
import {AuthorityOrganizationListPageComponent} from './pages/authority-organization-list-page/authority-organization-list-page/authority-organization-list-page.component';
import {CentralComponentCreatePageComponent} from './pages/central-component-create-page/central-component-create-page/central-component-create-page.component';
import {CentralComponentListPageComponent} from './pages/central-component-list-page/central-component-list-page/central-component-list-page.component';
import {ProvideConnectorPageComponent} from './pages/component-registration-pages/provide-connector-page/provide-connector-page/provide-connector-page.component';
import {ControlCenterPageComponent} from './pages/control-center-page/control-center-page/control-center-page.component';
import {DashboardPageComponent} from './pages/dashboard-page/dashboard-page/dashboard-page.component';
import {LoadingPageComponent} from './pages/empty-pages/loading-page/loading-page/loading-page.component';
import {UnauthenticatedPageComponent} from './pages/empty-pages/unauthenticated-page/unauthenticated-page/unauthenticated-page.component';
import {ParticipantOwnConnectorDetailPageComponent} from './pages/participant-own-connector-detail-page/participant-own-connector-detail-page/participant-own-connector-detail-page.component';
import {ParticipantOwnConnectorListPageComponent} from './pages/participant-own-connector-list-page/participant-own-connector-list-page/participant-own-connector-list-page.component';
import {ParticipantRegisterOwnConnectorPageComponent} from './pages/participant-register-own-connector-page/participant-register-own-connector-page/participant-register-own-connector-page.component';
import {RegisterConnectorPageComponent} from './pages/participant-register-own-connector-page/sub-pages/register-connector-page/register-connector-page.component';
import {RequestConnectorPageComponent} from './pages/participant-register-own-connector-page/sub-pages/request-connector-page/request-connector-page.component';
import {SetupConnectorPageComponent} from './pages/participant-register-own-connector-page/sub-pages/setup-connector-page/setup-connector-page.component';
import {OrganizationCreatePageComponent} from './pages/registration-pages/organization-create-page/organization-create-page/organization-create-page.component';
import {OrganizationOnboardPageComponent} from './pages/registration-pages/organization-onboard-page/organization-onboard-page/organization-onboard-page.component';
import {OrganizationPendingPageComponent} from './pages/registration-pages/organization-pending-page/organization-pending-page/organization-pending-page.component';
import {OrganizationRejectedPageComponent} from './pages/registration-pages/organization-rejected-page/organization-rejected-page/organization-rejected-page.component';
import {SpConnectorListPageComponent} from './pages/sp-connector-list-page/sp-connector-list-page/sp-connector-list-page.component';

export const UNAUTHENTICATED_ROUTES: Routes = [
  {
    path: 'create-organization',
    component: OrganizationCreatePageComponent,
  },
  {
    path: '**',
    component: UnauthenticatedPageComponent,
  },
];

export const PENDING_ROUTES: Routes = singleComponent(
  'registration/pending',
  OrganizationPendingPageComponent,
);

export const REJECTED_ROUTES: Routes = singleComponent(
  'registration/rejected',
  OrganizationRejectedPageComponent,
);

export const ONBOARDING_ROUTES: Routes = singleComponent(
  'onboard-organization',
  OrganizationOnboardPageComponent,
);

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
      requiresRole: ['KEY_USER'] satisfies UserRoleDto[],
    },
    canActivate: [requiresRole],
  },
  {
    path: 'my-organization/connectors/registration/setup',
    component: SetupConnectorPageComponent,
    data: {
      requiresRole: ['KEY_USER'] satisfies UserRoleDto[],
    },
    canActivate: [requiresRole],
  },
  {
    path: 'my-organization/connectors/registration/request',
    component: RequestConnectorPageComponent,
    data: {
      requiresRole: ['KEY_USER'] satisfies UserRoleDto[],
    },
    canActivate: [requiresRole],
  },
  {
    path: 'my-organization/connectors/registration/register',
    component: RegisterConnectorPageComponent,
    data: {
      requiresRole: ['KEY_USER'] satisfies UserRoleDto[],
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
          requiresRole: ['USER'] satisfies UserRoleDto[],
        },
        canActivate: [requiresRole],
      },
      {
        path: 'control-center',
        component: ControlCenterPageComponent,
        data: {
          requiresRole: ['USER'] satisfies UserRoleDto[],
        },
        canActivate: [requiresRole],
      },
      // My Organization Section
      {
        path: 'my-organization/users/:userId',
        component: ParticipantUserDetailPageComponent,
        data: {
          requiresRole: ['USER'] satisfies UserRoleDto[],
        },
        canActivate: [requiresRole],
      },
      {
        path: 'my-organization/connectors',
        component: ParticipantOwnConnectorListPageComponent,
        data: {
          requiresRole: ['USER'] satisfies UserRoleDto[],
        },
        canActivate: [requiresRole],
      },
      {
        path: 'my-organization/connectors/register',
        component: ParticipantRegisterOwnConnectorPageComponent,
        data: {
          requiresRole: ['KEY_USER'] satisfies UserRoleDto[],
        },
        canActivate: [requiresRole],
      },
      {
        path: 'my-organization/connectors/:connectorId',
        component: ParticipantOwnConnectorDetailPageComponent,
        data: {
          requiresRole: ['USER'] satisfies UserRoleDto[],
        },
        canActivate: [requiresRole],
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

      // Service Partner Section
      {
        path: 'service-partner/provided-connectors',
        component: SpConnectorListPageComponent,
        data: {
          requiresRole: ['SERVICE_PARTNER_ADMIN'] satisfies UserRoleDto[],
        },
        canActivate: [requiresRole],
      },
      {
        path: 'service-partner/provided-connectors/provide-connector',
        component: ProvideConnectorPageComponent,
        data: {
          requiresRole: ['SERVICE_PARTNER_ADMIN'] satisfies UserRoleDto[],
        },
        canActivate: [requiresRole],
      },

      // Participant Section

      // Authority Section
      {
        path: 'authority/organizations',
        component: AuthorityOrganizationListPageComponent,
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

function singleComponent(path: string, component: Type<any>): Routes {
  return [
    {
      path,
      component,
    },
    {
      path: '**',
      redirectTo: path,
      pathMatch: 'full',
    },
  ];
}

@NgModule({
  imports: [RouterModule.forRoot(LOADING_ROUTES)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
