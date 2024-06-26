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
import {RouterModule} from '@angular/router';
import {NgxsModule} from '@ngxs/store';
import {SharedModule} from 'src/app/shared/shared.module';
import {ControlCenterOrganizationProfilePageComponent} from './control-center-organization-profile-page/control-center-organization-profile-page.component';
import {ControlCenterOrganizationProfilePageStateImpl} from './state/control-center-organization-profile-page-state-impl';

@NgModule({
  declarations: [ControlCenterOrganizationProfilePageComponent],
  imports: [
    CommonModule,
    RouterModule,

    // NGXS
    NgxsModule.forFeature([ControlCenterOrganizationProfilePageStateImpl]),

    SharedModule,
  ],
})
export class ControlCenterOrganizationProfilePageModule {}
