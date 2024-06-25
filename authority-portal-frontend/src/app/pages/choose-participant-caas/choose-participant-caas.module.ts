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
import {FormsModule} from '@angular/forms';
import {BrowserModule} from '@angular/platform-browser';
import {RouterModule} from '@angular/router';
import {SharedModule} from 'src/app/shared/shared.module';
import {ChooseParticipantCaasComponent} from './choose-participant-caas/choose-participant-caas.component';

@NgModule({
  declarations: [ChooseParticipantCaasComponent],
  exports: [ChooseParticipantCaasComponent],
  imports: [
    // Angular
    BrowserModule,
    CommonModule,
    FormsModule,
    RouterModule,

    // Authority Portal
    SharedModule,
  ],
})
export class ChooseParticipantCaasModule {}
