import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {BrowserModule} from '@angular/platform-browser';
import {RouterModule} from '@angular/router';
import {SharedModule} from 'src/app/shared/shared.module';
import {PipesAndDirectivesModule} from '../../components/pipes-and-directives/pipes-and-directives.module';
import {MaterialModule} from '../../material/material.module';
import {BreadcrumbComponent} from './breadcrumb/breadcrumb.component';
import {FooterComponent} from './footer/footer.component';
import {PortalLayoutComponent} from './portal-layout/portal-layout.component';
import {ConnectorsElementComponent} from './sidebar-elements/connectors-element.component';
import {DashboardElementComponent} from './sidebar-elements/dashboard-element.component';
import {MyConnectorsElementComponent} from './sidebar-elements/my-connectors-element.component';
import {MyOrganizationElementComponent} from './sidebar-elements/my-organization-element.component';
import {NotificationsElementComponent} from './sidebar-elements/notifications-element.component';
import {OrganizationsElementComponent} from './sidebar-elements/organizations-element.component';
import {UsersElementComponent} from './sidebar-elements/users-element.component';
import {SidebarComponent} from './sidebar/sidebar.component';
import {UserAvatarComponent} from './user-avatar/user-avatar.component';

@NgModule({
  imports: [
    // Angular
    CommonModule,
    BrowserModule,
    RouterModule,

    MaterialModule,

    PipesAndDirectivesModule,
    // Authority Portal
    SharedModule,
  ],
  declarations: [
    PortalLayoutComponent,
    BreadcrumbComponent,
    ConnectorsElementComponent,
    MyConnectorsElementComponent,
    DashboardElementComponent,
    FooterComponent,
    NotificationsElementComponent,
    MyOrganizationElementComponent,
    OrganizationsElementComponent,
    SidebarComponent,
    UsersElementComponent,
    UserAvatarComponent,
  ],
  exports: [
    PortalLayoutComponent,
    BreadcrumbComponent,
    MyConnectorsElementComponent,
    ConnectorsElementComponent,
    DashboardElementComponent,
    FooterComponent,
    NotificationsElementComponent,
    MyOrganizationElementComponent,
    OrganizationsElementComponent,
    SidebarComponent,
    UsersElementComponent,
  ],
})
export class PortalLayoutModule {}
