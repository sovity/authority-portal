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
import {ControlCenterOrganizationMemberDetailPageComponent} from './control-center-organization-member-detail-page/control-center-organization-member-detail-page.component';
import {ControlCenterOrganizationMemberDetailPageStateImpl} from './state/control-center-organization-member-detail-page-state-impl';

@NgModule({
  declarations: [ControlCenterOrganizationMemberDetailPageComponent],
  imports: [
    CommonModule,
    RouterModule,

    // NGXS
    NgxsModule.forFeature([ControlCenterOrganizationMemberDetailPageStateImpl]),

    SharedModule,
  ],
})
export class ControlCenterOrganizationMemberDetailPageModule {}
