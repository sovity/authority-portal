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
import {ReserveProvidedConnectorPageComponent} from './reserve-provided-connector-page/reserve-provided-connector-page.component';
import {ReserveProvidedConnectorPageStateImpl} from './state/reserve-provided-connector-page-state-impl';

@NgModule({
  declarations: [ReserveProvidedConnectorPageComponent],
  exports: [ReserveProvidedConnectorPageComponent],
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,

    NgxsModule.forFeature([ReserveProvidedConnectorPageStateImpl]),

    SharedModule,
  ],
})
export class ReserveProvidedConnectorPageModule {}
