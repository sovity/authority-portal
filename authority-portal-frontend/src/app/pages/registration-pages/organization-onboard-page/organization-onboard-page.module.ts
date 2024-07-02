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
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {RouterModule} from '@angular/router';
import {NgxsModule} from '@ngxs/store';
import {SharedModule} from 'src/app/shared/shared.module';
import {OrganizationOnboardPageComponent} from './organization-onboard-page/organization-onboard-page.component';
import {OrganizationOnboardPageStateImpl} from './state/organization-onboard-page-state-impl';

@NgModule({
  declarations: [OrganizationOnboardPageComponent],
  imports: [
    // Angular
    CommonModule,
    BrowserModule,
    RouterModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,

    // NGXS
    NgxsModule.forFeature([OrganizationOnboardPageStateImpl]),

    // Authority Portal
    SharedModule,
  ],
  exports: [OrganizationOnboardPageComponent],
})
export class OrganizationOnboardPageModule {}
