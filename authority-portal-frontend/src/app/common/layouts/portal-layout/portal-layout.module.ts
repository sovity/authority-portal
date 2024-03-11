/*
 * Copyright (c) 2024 sovity GmbH
 *
 * This program and the accompanying materials are made available under the
 * terms of the Apache License, Version 2.0 which is available at
 * https://www.apache.org/licenses/LICENSE-2.0
 *
 * SPDX-License-Identifier: Apache-2.0
 *
 * Contributors:
 *      sovity GmbH - initial implementation
 */
import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {RouterModule} from '@angular/router';
import {SharedModule} from 'src/app/shared/shared.module';
import {DevUtilsModule} from '../../components/dev-utils/dev-utils.module';
import {PipesAndDirectivesModule} from '../../components/pipes-and-directives/pipes-and-directives.module';
import {MaterialModule} from '../../material/material.module';
import {BreadcrumbComponent} from './breadcrumb/breadcrumb.component';
import {ControlCenterComponent} from './control-center/control-center.component';
import {PortalLayoutComponent} from './portal-layout/portal-layout.component';
import {SidebarElementComponent} from './sidebar-element/sidebar-element.component';
import {SidebarComponent} from './sidebar/sidebar.component';
import {ToolbarComponent} from './toolbar/toolbar.component';

@NgModule({
  imports: [
    // Angular
    BrowserModule,
    CommonModule,
    MaterialModule,
    PipesAndDirectivesModule,
    RouterModule,

    // Authority Portal
    SharedModule,
    DevUtilsModule,
  ],
  declarations: [
    BreadcrumbComponent,
    PortalLayoutComponent,
    SidebarComponent,
    ControlCenterComponent,
    ToolbarComponent,
    SidebarElementComponent,
  ],
  exports: [BreadcrumbComponent, PortalLayoutComponent, SidebarComponent],
})
export class PortalLayoutModule {}
