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
import {NgxsModule} from '@ngxs/store';
import {SharedModule} from 'src/app/shared/shared.module';
import {AuthorityConnectorDetailPageComponent} from './authority-connector-detail-page/authority-connector-detail-page.component';
import {AuthorityConnectorDetailPageStateImpl} from './state/authority-connector-detail-page-state-impl';

@NgModule({
  declarations: [AuthorityConnectorDetailPageComponent],
  imports: [
    CommonModule,

    // NGXS
    NgxsModule.forFeature([AuthorityConnectorDetailPageStateImpl]),

    // Authority Portal
    SharedModule,
  ],
})
export class AuthorityConnectorDetailPageModule {}
