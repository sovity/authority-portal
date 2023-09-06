import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {NgxsReduxDevtoolsPluginModule} from '@ngxs/devtools-plugin';
import {NgxsModule} from '@ngxs/store';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {DevUtilsModule} from './common/components/dev-utils/dev-utils.module';
import {AuthorityLayoutModule} from './common/layouts/authority-layout/authority-layout.module';
import {ApiClientFactory} from './core/api/api-client-factory';
import {ApiService} from './core/api/api.service';
import {provideAppConfig} from './core/config/app-config-initializer';
import {GlobalStateImpl} from './core/global-state/global-state-impl';
import {DashboardPageModule} from './pages/dashboard-page/dashboard-page.module';
import {LoadingPageModule} from './pages/loading-page/loading-page.module';
import {OrganizationListPageModule} from './pages/organization-list-page/organization-list-page.module';
import {PageNotFoundPageModule} from './pages/page-not-found-page/page-not-found-page.module';
import {RegistrationProcessWizardModule} from './pages/registration-process-wizard/registration-process-wizard.module';

@NgModule({
  declarations: [AppComponent],
  imports: [
    // Angular
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,

    // Angular Material
    MatButtonModule,

    // Ngxs
    NgxsModule.forRoot([GlobalStateImpl], {developmentMode: true}),
    NgxsReduxDevtoolsPluginModule.forRoot(),

    // Authority Portal
    AuthorityLayoutModule,
    DashboardPageModule,
    DevUtilsModule,
    LoadingPageModule,
    OrganizationListPageModule,
    PageNotFoundPageModule,
    RegistrationProcessWizardModule,

    // Routing Module
    AppRoutingModule,
  ],
  providers: [provideAppConfig(), ApiService, ApiClientFactory],
  bootstrap: [AppComponent],
})
export class AppModule {}
