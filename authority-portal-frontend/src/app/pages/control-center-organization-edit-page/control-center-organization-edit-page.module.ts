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
import {ControlCenterOrganizationEditPageComponent} from './control-center-organization-edit-page/control-center-organization-edit-page.component';
import {ControlCenterOrganizationEditPageStateImpl} from './state/control-center-organization-edit-page-state-impl';

@NgModule({
  declarations: [ControlCenterOrganizationEditPageComponent],
  imports: [
    CommonModule,
    RouterModule,

    // NGXS
    NgxsModule.forFeature([ControlCenterOrganizationEditPageStateImpl]),

    SharedModule,
  ],
})
export class ControlCenterOrganizationEditPageModule {}
