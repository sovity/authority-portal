import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {UserInfoRolesEnum} from '../../../authority-portal-backend/authority-portal-api-client-ts';
import {requiresRole} from './common/auth/requires-role-guard';
import {PortalLayoutComponent} from './common/layouts/portal-layout/portal-layout/portal-layout.component';
import {AuthorityOrganizationDetailPageComponent} from './pages/authority-organization-detail-page/authority-organization-detail-page/authority-organization-detail-page.component';
import {AuthorityOrganizationListPageComponent} from './pages/authority-organization-list-page/authority-organization-list-page/authority-organization-list-page.component';
import {DashboardPageComponent} from './pages/dashboard-page/dashboard-page/dashboard-page.component';
import {LoadingPageComponent} from './pages/loading-page/loading-page/loading-page.component';
import {PageNotFoundPageComponent} from './pages/page-not-found-page/page-not-found-page/page-not-found-page.component';
import {ParticipantOwnConnectorDetailPageComponent} from './pages/participant-own-connector-detail-page/participant-own-connector-detail-page/participant-own-connector-detail-page.component';
import {ParticipantOwnConnectorListPageComponent} from './pages/participant-own-connector-list-page/participant-own-connector-list-page/participant-own-connector-list-page.component';
import {ParticipantRegisterOwnConnectorPageComponent} from './pages/participant-register-own-connector-page/participant-register-own-connector-page/participant-register-own-connector-page.component';
import {RegistrationProcessWizardComponent} from './pages/registration-process-wizard/registration-process-wizard.component';
import {SpRegisterConnectorPageComponent} from './pages/sp-register-connector/sp-register-connector/sp-register-connector-page.component';

export const REGISTRATION_PROCESS_ROUTES: Routes = [
  {
    path: '**',
    component: RegistrationProcessWizardComponent,
  },
];

export const LOADING_ROUTES: Routes = [
  {
    path: '**',
    component: LoadingPageComponent,
  },
];

export const AUTHORITY_PORTAL_ROUTES: Routes = [
  {
    path: '',
    component: PortalLayoutComponent,
    children: [
      {path: '', redirectTo: 'dashboard', pathMatch: 'full'},
      {
        path: 'dashboard',
        component: DashboardPageComponent,
        data: {
          requiresRole: ['PARTICIPANT_USER'] satisfies UserInfoRolesEnum[],
        },
        canActivate: [requiresRole],
      },
      // My Organization Section
      {
        path: 'my-organization/connectors',
        component: ParticipantOwnConnectorListPageComponent,
        data: {
          requiresRole: ['PARTICIPANT_USER'] satisfies UserInfoRolesEnum[],
        },
        canActivate: [requiresRole],
      },
      {
        path: 'my-organization/connectors/register',
        component: ParticipantRegisterOwnConnectorPageComponent,
        data: {
          requiresRole: ['PARTICIPANT_CURATOR'] satisfies UserInfoRolesEnum[],
        },
        canActivate: [requiresRole],
      },
      {
        path: 'my-organization/connectors/provide-connector',
        component: SpRegisterConnectorPageComponent,
        data: {
          requiresRole: [
            'AUTHORITY_ADMIN',
            'SERVICEPARTNER_ADMIN',
          ] satisfies UserInfoRolesEnum[],
        },
        canActivate: [requiresRole],
      },
      {
        path: 'my-organization/connectors/:connectorId',
        component: ParticipantOwnConnectorDetailPageComponent,
        data: {
          requiresRole: ['PARTICIPANT_USER'] satisfies UserInfoRolesEnum[],
        },
        canActivate: [requiresRole],
      },

      // Service Provider Section

      // Participant Section

      // Authority Section
      {
        path: 'authority/organizations',
        component: AuthorityOrganizationListPageComponent,
        data: {
          requiresRole: ['AUTHORITY_USER'] satisfies UserInfoRolesEnum[],
        },
        canActivate: [requiresRole],
      },
      {
        path: 'authority/organizations/:mdsId',
        component: AuthorityOrganizationDetailPageComponent,
        data: {
          requiresRole: ['AUTHORITY_USER'] satisfies UserInfoRolesEnum[],
        },
        canActivate: [requiresRole],
      },
      {
        path: '**',
        component: PageNotFoundPageComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(LOADING_ROUTES)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
