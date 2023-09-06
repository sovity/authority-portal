import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {UserInfoRolesEnum} from '../../../authority-portal-backend/authority-portal-api-client-ts';
import {requiresRole} from './common/auth/requires-role-guard';
import {AuthorityLayoutComponent} from './common/layouts/authority-layout/authority-layout/authority-layout.component';
import {DashboardPageComponent} from './pages/dashboard-page/dashboard-page/dashboard-page.component';
import {LoadingPageComponent} from './pages/loading-page/loading-page/loading-page.component';
import {OrganizationListPageComponent} from './pages/organization-list-page/organization-list-page/organization-list-page.component';
import {PageNotFoundPageComponent} from './pages/page-not-found-page/page-not-found-page/page-not-found-page.component';
import {RegistrationProcessWizardComponent} from './pages/registration-process-wizard/registration-process-wizard.component';

export const LOADING_ROUTES: Routes = [
  {
    path: '**',
    component: LoadingPageComponent,
  },
];

export const REGISTRATION_PROCESS_ROUTES: Routes = [
  {
    path: '**',
    component: RegistrationProcessWizardComponent,
  },
];

export const AUTHORITY_ROUTES: Routes = [
  {
    path: '',
    component: AuthorityLayoutComponent,
    children: [
      {
        path: 'dashboard',
        component: DashboardPageComponent,
      },
      {
        path: 'organisation',
        component: PageNotFoundPageComponent,
      },
      {
        path: 'organisation/users',
        component: OrganizationListPageComponent,
        data: {
          requiresRole: [
            'AUTHORITY_ADMIN',
            'PARTICIPANT_ADMIN',
          ] satisfies UserInfoRolesEnum[],
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
