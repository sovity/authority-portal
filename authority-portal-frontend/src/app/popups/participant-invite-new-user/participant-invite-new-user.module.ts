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
import {ReactiveFormsModule} from '@angular/forms';
import {NgxsModule} from '@ngxs/store';
import {ErrorElementModule} from 'src/app/common/components/error-element/error-element.module';
import {FormElementsModule} from 'src/app/common/components/form-elements/form-elements.module';
import {LoadingElementModule} from 'src/app/common/components/loading-element/loading-element.module';
import {PipesAndDirectivesModule} from 'src/app/common/components/pipes-and-directives/pipes-and-directives.module';
import {MaterialModule} from 'src/app/common/material/material.module';
import {SharedModule} from 'src/app/shared/shared.module';
import {ParticipantInviteNewUserComponent} from './participant-invite-new-user/participant-invite-new-user.component';
import {ParticipantInviteNewUserPageStateImpl} from './state/participant-invite-new-user-page-state-impl';

@NgModule({
  declarations: [ParticipantInviteNewUserComponent],
  imports: [
    // Angular
    CommonModule,
    ReactiveFormsModule,

    // NGXS
    NgxsModule.forFeature([ParticipantInviteNewUserPageStateImpl]),

    // Angular Material
    MaterialModule,

    // Authority Portal
    SharedModule,
    LoadingElementModule,
    ErrorElementModule,
    PipesAndDirectivesModule,
    FormElementsModule,
  ],
})
export class ParticipantInviteNewUserModule {}
