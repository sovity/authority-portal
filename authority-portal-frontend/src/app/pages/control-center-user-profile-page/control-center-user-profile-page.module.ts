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
import {ControlCenterUserProfilePageComponent} from './control-center-user-profile-page/control-center-user-profile-page.component';
import {ControlCenterUserProfilePageStateImpl} from './state/control-center-user-profile-page-state-impl';

@NgModule({
  declarations: [ControlCenterUserProfilePageComponent],
  imports: [
    CommonModule,
    RouterModule,

    // NGXS
    NgxsModule.forFeature([ControlCenterUserProfilePageStateImpl]),

    SharedModule,
  ],
})
export class ControlCenterUserProfilePageModule {}
