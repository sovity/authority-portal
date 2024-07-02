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
import {BrowserModule} from '@angular/platform-browser';
import {RouterModule} from '@angular/router';
import {NgxsModule} from '@ngxs/store';
import {SharedModule} from 'src/app/shared/shared.module';
import {RegisterCentralComponentPageComponent} from './register-central-component-page/register-central-component-page.component';
import {RegisterCentralComponentPageStateImpl} from './state/register-central-component-page-state-impl';

@NgModule({
  declarations: [RegisterCentralComponentPageComponent],
  exports: [RegisterCentralComponentPageComponent],
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,

    NgxsModule.forFeature([RegisterCentralComponentPageStateImpl]),

    SharedModule,
  ],
})
export class RegisterCentralComponentPageModule {}
