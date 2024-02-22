import {CommonModule, NgFor} from '@angular/common';
import {HttpClientModule} from '@angular/common/http';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {NgxsReduxDevtoolsPluginModule} from '@ngxs/devtools-plugin';
import {NgxsModule} from '@ngxs/store';
import {ErrorElementModule} from 'src/app/common/components/error-element/error-element.module';
import {LoadingElementModule} from 'src/app/common/components/loading-element/loading-element.module';
import {MaterialModule} from 'src/app/common/material/material.module';
import {AuthorityOrganizationUserDetailPageModule} from 'src/app/pages/authority-organization-user-detail-page/authority-organization-user-detail-page.module';
import {ParticipantOrganizationProfileModule} from 'src/app/pages/participant-organization-profile-page/participant-organization-profile.module';
import {ParticipantUserDetailPageModule} from 'src/app/pages/participant-user-detail-page/participant-user-detail-page.module';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {DevUtilsModule} from './common/components/dev-utils/dev-utils.module';
import {PortalLayoutModule} from './common/layouts/portal-layout/portal-layout.module';
import {ApiClientFactory} from './core/api/api-client-factory';
import {ApiService} from './core/api/api.service';
import {provideAppConfig} from './core/config/app-config-initializer';
import {GlobalStateImpl} from './core/global-state/global-state-impl';
import {NgxsInZoneExecutionStrategy} from './core/global-state/ngxs-in-zone-execution-strategy';
import {ToastNotificationsModule} from './core/toast-notifications/toast-notifications.module';
import {AuthorityConnectorDetailPageModule} from './pages/authority-connector-detail-page/authority-connector-detail-page.module';
import {AuthorityConnectorListPageModule} from './pages/authority-connector-list-page/authority-connector-list-page.module';
import {AuthorityOrganizationDetailPageModule} from './pages/authority-organization-detail-page/authority-organization-detail-page.module';
import {AuthorityOrganizationListPageModule} from './pages/authority-organization-list-page/authority-organization-list-page.module';
import {CentralComponentCreatePageModule} from './pages/central-component-create-page/central-component-create-page.module';
import {CentralComponentListPageModule} from './pages/central-component-list-page/central-component-list-page.module';
import {ProvideConnectorPageModule} from './pages/component-registration-pages/provide-connector-page/provide-connector-page.module';
import {ControlCenterPageModule} from './pages/control-center-page/control-center-page.module';
import {DashboardPageModule} from './pages/dashboard-page/dashboard-page.module';
import {ErrorPageModule} from './pages/empty-pages/error-page/error-page.module';
import {LoadingPageModule} from './pages/empty-pages/loading-page/loading-page.module';
import {PageNotFoundPageModule} from './pages/empty-pages/page-not-found-page/page-not-found-page.module';
import {UnauthenticatedPageModule} from './pages/empty-pages/unauthenticated-page/unauthenticated-page.module';
import {ParticipantOwnConnectorDetailPageModule} from './pages/participant-own-connector-detail-page/participant-own-connector-detail-page.module';
import {ParticipantOwnConnectorListPageModule} from './pages/participant-own-connector-list-page/participant-own-connector-list-page.module';
import {ParticipantRegisterOwnConnectorPageModule} from './pages/participant-register-own-connector-page/participant-register-own-connector-page.module';
import {OrganizationCreatePageModule} from './pages/registration-pages/organization-create-page/organization-create-page.module';
import {OrganizationOnboardPageModule} from './pages/registration-pages/organization-onboard-page/organization-onboard-page.module';
import {OrganizationPendingPageModule} from './pages/registration-pages/organization-pending-page/organization-pending-page.module';
import {OrganizationRejectedPageModule} from './pages/registration-pages/organization-rejected-page/organization-rejected-page.module';
import {SpConnectorDetailPageModule} from './pages/sp-connector-detail-page/sp-connector-detail-page.module';
import {SpConnectorListPageModule} from './pages/sp-connector-list-page/sp-connector-list-page.module';
import {AuthorityInviteNewOrganizationModule} from './popups/authority-invite-new-organization/authority-invite-new-organization.module';
import {ParticipantInviteNewUserModule} from './popups/participant-invite-new-user/participant-invite-new-user.module';

@NgModule({
  declarations: [AppComponent],
  providers: [provideAppConfig(), ApiService, ApiClientFactory],
  bootstrap: [AppComponent],
  imports: [
    // Angular
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    NgFor,
    // Angular Material
    MaterialModule,
    // Ngxs
    NgxsModule.forRoot([GlobalStateImpl], {
      developmentMode: true,
      executionStrategy: NgxsInZoneExecutionStrategy,
    }),
    NgxsReduxDevtoolsPluginModule.forRoot(),

    // Authority Portal pages
    AuthorityConnectorDetailPageModule,
    AuthorityConnectorListPageModule,
    AuthorityOrganizationDetailPageModule,
    AuthorityOrganizationListPageModule,
    AuthorityOrganizationUserDetailPageModule,
    CentralComponentCreatePageModule,
    CentralComponentListPageModule,
    ControlCenterPageModule,
    DashboardPageModule,
    DevUtilsModule,
    ErrorElementModule,
    ErrorPageModule,
    LoadingElementModule,
    LoadingPageModule,
    OrganizationCreatePageModule,
    OrganizationOnboardPageModule,
    OrganizationPendingPageModule,
    OrganizationRejectedPageModule,
    PageNotFoundPageModule,
    ParticipantOrganizationProfileModule,
    ParticipantOwnConnectorDetailPageModule,
    ParticipantOwnConnectorListPageModule,
    ParticipantRegisterOwnConnectorPageModule,
    ParticipantUserDetailPageModule,
    PortalLayoutModule,
    ProvideConnectorPageModule,
    SpConnectorDetailPageModule,
    SpConnectorListPageModule,
    ToastNotificationsModule,
    UnauthenticatedPageModule,

    // Authority Portal popups
    AuthorityInviteNewOrganizationModule,
    ParticipantInviteNewUserModule,

    // Authority Portal popups
    AuthorityInviteNewOrganizationModule,
    ParticipantInviteNewUserModule,

    // Routing Module
    AppRoutingModule,
  ],
})
export class AppModule {}
