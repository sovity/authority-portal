import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {RouterModule} from '@angular/router';
import {PipesAndDirectivesModule} from '../../components/pipes-and-directives/pipes-and-directives.module';
import {AuthorityLayoutComponent} from './authority-layout/authority-layout.component';
import {BreadcrumbComponent} from './breadcrumb/breadcrumb.component';
import {FooterComponent} from './footer/footer.component';
import {ConnectorsElementComponent} from './sidebar-elements/connectors-element.component';
import {DashboardElementComponent} from './sidebar-elements/dashboard-element.component';
import {NotificationsElementComponent} from './sidebar-elements/notifications-element.component';
import {OrganisationsElementComponent} from './sidebar-elements/organisations-element.component';
import {OrganisationProfileElementComponent} from './sidebar-elements/organization-profile-element.component';
import {UsersElementComponent} from './sidebar-elements/users-element.component';
import {SidebarComponent} from './sidebar/sidebar.component';

@NgModule({
  imports: [
    // Angular
    CommonModule,
    BrowserModule,
    RouterModule,

    // Authority Portal
    PipesAndDirectivesModule,
  ],
  declarations: [
    AuthorityLayoutComponent,
    BreadcrumbComponent,
    ConnectorsElementComponent,
    DashboardElementComponent,
    FooterComponent,
    NotificationsElementComponent,
    OrganisationProfileElementComponent,
    OrganisationsElementComponent,
    SidebarComponent,
    UsersElementComponent,
  ],
  exports: [
    AuthorityLayoutComponent,
    BreadcrumbComponent,
    ConnectorsElementComponent,
    DashboardElementComponent,
    FooterComponent,
    NotificationsElementComponent,
    OrganisationProfileElementComponent,
    OrganisationsElementComponent,
    SidebarComponent,
    UsersElementComponent,
  ],
})
export class AuthorityLayoutModule {}
