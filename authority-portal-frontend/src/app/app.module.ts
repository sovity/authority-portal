import {CommonModule} from '@angular/common';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {NgxsReduxDevtoolsPluginModule} from '@ngxs/devtools-plugin';
import {NgxsFormPluginModule} from '@ngxs/form-plugin';
import {NgxsModule} from '@ngxs/store';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {DevUtilsModule} from './common/components/dev-utils/dev-utils.module';
import {PipesAndDirectivesModule} from './common/components/pipes-and-directives/pipes-and-directives.module';
import {PortalLayoutModule} from './common/layouts/portal-layout/portal-layout.module';
import {ApiClientFactory} from './core/api/api-client-factory';
import {ApiService} from './core/api/api.service';
import {provideAppConfig} from './core/config/app-config-initializer';
import {GlobalStateImpl} from './core/global-state/global-state-impl';
import {AuthorityOrganizationDetailPageModule} from './pages/authority-organization-detail-page/authority-organization-detail-page.module';
import {AuthorityOrganizationListPageModule} from './pages/authority-organization-list-page/authority-organization-list-page.module';
import {DashboardPageModule} from './pages/dashboard-page/dashboard-page.module';
import {LoadingPageModule} from './pages/loading-page/loading-page.module';
import {PageNotFoundPageModule} from './pages/page-not-found-page/page-not-found-page.module';
import {ParticipantOwnConnectorDetailPageModule} from './pages/participant-own-connector-detail-page/participant-own-connector-detail-page.module';
import {ParticipantOwnConnectorListPageModule} from './pages/participant-own-connector-list-page/participant-own-connector-list-page.module';
import {ParticipantRegisterOwnConnectorPageModule} from './pages/participant-register-own-connector-page/participant-register-own-connector-page.module';
import {RegistrationProcessWizardModule} from './pages/registration-process-wizard/registration-process-wizard.module';
import {SpConnectorDetailPageModule} from './pages/sp-connector-detail-page/sp-connector-detail-page.module';
import {SpConnectorListPageModule} from './pages/sp-connector-list-page/sp-connector-list-page.module';
import {SpRegisterConnectorModule} from './pages/sp-register-connector/sp-register-connector.module';

@NgModule({
  declarations: [AppComponent],
  imports: [
    // Angular
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,

    // Angular Material
    MatButtonModule,

    // Ngxs
    NgxsModule.forRoot([GlobalStateImpl], {developmentMode: true}),
    // NgxsFormPluginModule.forRoot(),
    NgxsReduxDevtoolsPluginModule.forRoot(),

    // Authority Portal
    PortalLayoutModule,
    DashboardPageModule,
    DevUtilsModule,
    LoadingPageModule,
    AuthorityOrganizationListPageModule,
    AuthorityOrganizationDetailPageModule,
    ParticipantRegisterOwnConnectorPageModule,
    ParticipantOwnConnectorListPageModule,
    ParticipantOwnConnectorDetailPageModule,
    SpRegisterConnectorModule,
    SpConnectorDetailPageModule,
    SpConnectorListPageModule,
    PageNotFoundPageModule,
    RegistrationProcessWizardModule,

    // Routing Module
    AppRoutingModule,
  ],
  providers: [provideAppConfig(), ApiService, ApiClientFactory],
  bootstrap: [AppComponent],
})
export class AppModule {}
