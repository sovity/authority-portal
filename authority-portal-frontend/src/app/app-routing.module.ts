import {NgModule, Type} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {UserRoleDto} from '@sovity.de/authority-portal-client';
import {requiresRole} from './common/auth/requires-role-guard';
import {PortalLayoutComponent} from './common/layouts/portal-layout/portal-layout/portal-layout.component';
import {AuthorityConnectorListPageComponent} from './pages/authority-connector-list-page/authority-connector-list-page/authority-connector-list-page.component';
import {AuthorityOrganizationListPageComponent} from './pages/authority-organization-list-page/authority-organization-list-page/authority-organization-list-page.component';
import {CentralComponentListPageComponent} from './pages/central-component-list-page/central-component-list-page/central-component-list-page.component';
import {ChooseParticipantCaasComponent} from './pages/choose-participant-caas/choose-participant-caas/choose-participant-caas.component';
import {ChooseParticipantConnectorComponent} from './pages/choose-participant-connector/choose-participant-connector/choose-participant-connector.component';
import {ProvideConnectorPageComponent} from './pages/component-registration-pages/provide-connector-page/provide-connector-page/provide-connector-page.component';
import {RegisterCentralComponentPageComponent} from './pages/component-registration-pages/register-central-component-page/register-central-component-page/register-central-component-page.component';
import {RegisterConnectorPageComponent} from './pages/component-registration-pages/register-connector-page/register-connector-page/register-connector-page.component';
import {RequestConnectorPageComponent} from './pages/component-registration-pages/request-connector-page/request-connector-page/request-connector-page.component';
import {ControlCenterPageComponent} from './pages/control-center-page/control-center-page/control-center-page.component';
import {CONTROL_CENTER_ROUTES} from './pages/control-center-page/control-center-routes';
import {DashboardPageComponent} from './pages/dashboard-page/dashboard-page/dashboard-page.component';
import {LoadingPageComponent} from './pages/empty-pages/loading-page/loading-page/loading-page.component';
import {PageNotFoundPageComponent} from './pages/empty-pages/page-not-found-page/page-not-found-page/page-not-found-page.component';
import {UnauthenticatedPageComponent} from './pages/empty-pages/unauthenticated-page/unauthenticated-page/unauthenticated-page.component';
import {MdsHomePageComponent} from './pages/mds-home/mds-home/mds-home.component';
import {ParticipantOwnConnectorDetailPageComponent} from './pages/participant-own-connector-detail-page/participant-own-connector-detail-page/participant-own-connector-detail-page.component';
import {ParticipantOwnConnectorListPageComponent} from './pages/participant-own-connector-list-page/participant-own-connector-list-page/participant-own-connector-list-page.component';
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
  'onboard',
  OrganizationOnboardPageComponent,
);

export const LOADING_ROUTES: Routes = [
  {
    path: '**',
    component: LoadingPageComponent,
  },
];

const REDIRECT_TO_HOME: string[] = [
  '',
  'registration/pending',
  'registration/rejected',
  'onboard',
];

const HOME_REDIRECTS: Routes = REDIRECT_TO_HOME.map((path) => ({
  path,
  redirectTo: 'mds-home',
  pathMatch: 'full',
}));

export const AUTHORITY_PORTAL_ROUTES: Routes = [
  // participant own connector registration
  {
    path: 'my-organization/connectors/new',
    component: ChooseParticipantConnectorComponent,
    data: {
      requiresRole: ['KEY_USER'] satisfies UserRoleDto[],
    },
    canActivate: [requiresRole],
  },
  {
    path: 'my-organization/connectors/new/choose-provider',
    component: ChooseParticipantCaasComponent,
    data: {
      requiresRole: ['KEY_USER'] satisfies UserRoleDto[],
    },
    canActivate: [requiresRole],
  },
  {
    path: 'my-organization/connectors/new/provided',
    component: RequestConnectorPageComponent,
    data: {
      requiresRole: ['KEY_USER'] satisfies UserRoleDto[],
    },
    canActivate: [requiresRole],
  },
  {
    path: 'my-organization/connectors/new/self-hosted',
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
      ...HOME_REDIRECTS,
      {
        path: 'mds-home',
        component: MdsHomePageComponent,
        data: {
          requiresRole: ['USER'] satisfies UserRoleDto[],
        },
        canActivate: [requiresRole],
      },
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
        children: CONTROL_CENTER_ROUTES,
      },
      // My Organization Section
      {
        path: 'my-organization/connectors',
        component: ParticipantOwnConnectorListPageComponent,
        data: {
          requiresRole: ['USER'] satisfies UserRoleDto[],
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
        component: RegisterCentralComponentPageComponent,
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
        path: 'operator/connectors',
        component: AuthorityConnectorListPageComponent,
        data: {
          requiresRole: ['OPERATOR_ADMIN'] satisfies UserRoleDto[],
        },
        canActivate: [requiresRole],
      },
    ],
  },
  {
    path: '**',
    component: PageNotFoundPageComponent,
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
