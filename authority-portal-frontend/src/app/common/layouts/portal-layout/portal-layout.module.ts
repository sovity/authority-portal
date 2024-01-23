import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {RouterModule} from '@angular/router';
import {SharedModule} from 'src/app/shared/shared.module';
import {PipesAndDirectivesModule} from '../../components/pipes-and-directives/pipes-and-directives.module';
import {MaterialModule} from '../../material/material.module';
import {BreadcrumbComponent} from './breadcrumb/breadcrumb.component';
import {FooterComponent} from './footer/footer.component';
import {PortalLayoutComponent} from './portal-layout/portal-layout.component';
import {SidebarElementComponent} from './sidebar-element/sidebar-element.component';
import {CentralComponentsElementComponent} from './sidebar-elements/central-components-element.component';
import {SidebarComponent} from './sidebar/sidebar.component';
import {ToolbarComponent} from './toolbar/toolbar.component';
import {UserSettingsComponent} from './user-settings/user-settings.component';

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
    BreadcrumbComponent,
    CentralComponentsElementComponent,
    FooterComponent,
    PortalLayoutComponent,
    SidebarComponent,
    UserSettingsComponent,
    ToolbarComponent,
    SidebarElementComponent,
  ],
  exports: [
    BreadcrumbComponent,
    CentralComponentsElementComponent,
    FooterComponent,
    PortalLayoutComponent,
    SidebarComponent,
  ],
})
export class PortalLayoutModule {}
