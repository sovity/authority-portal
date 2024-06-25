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
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {NgxsModule} from '@ngxs/store';
import {SharedModule} from 'src/app/shared/shared.module';
import {ControlCenterOrganizationMembersPageComponent} from './control-center-organization-members-page/control-center-organization-members-page.component';
import {ControlCenterOrganizationMembersPageStateImpl} from './control-center-organization-members-page/state/control-center-organization-members-page-state-impl';
import {ParticipantInviteNewUserComponent} from './participant-invite-new-user/participant-invite-new-user.component';
import {ParticipantInviteNewUserPageStateImpl} from './participant-invite-new-user/state/participant-invite-new-user-page-state-impl';

@NgModule({
  declarations: [
    ControlCenterOrganizationMembersPageComponent,
    ParticipantInviteNewUserComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,

    // NGXS
    NgxsModule.forFeature([
      ControlCenterOrganizationMembersPageStateImpl,
      ParticipantInviteNewUserPageStateImpl,
    ]),

    SharedModule,
  ],
})
export class ControlCenterOrganizationMembersPageModule {}
