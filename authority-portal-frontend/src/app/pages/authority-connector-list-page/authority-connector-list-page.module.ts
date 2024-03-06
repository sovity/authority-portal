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
import {RouterModule} from '@angular/router';
import {NgxsModule} from '@ngxs/store';
import {DevUtilsModule} from 'src/app/common/components/dev-utils/dev-utils.module';
import {LoadingElementModule} from 'src/app/common/components/loading-element/loading-element.module';
import {PipesAndDirectivesModule} from 'src/app/common/components/pipes-and-directives/pipes-and-directives.module';
import {MaterialModule} from 'src/app/common/material/material.module';
import {SharedModule} from 'src/app/shared/shared.module';
import {AuthorityConnectorListPageComponent} from './authority-connector-list-page/authority-connector-list-page.component';
import {AuthorityConnectorListPageStateImpl} from './state/authority-connector-list-page-state-impl';

@NgModule({
  declarations: [AuthorityConnectorListPageComponent],
  imports: [
    // Angular
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    MaterialModule,
    DevUtilsModule,
    SharedModule,

    // NGXS
    NgxsModule.forFeature([AuthorityConnectorListPageStateImpl]),

    // Authority Portal
    PipesAndDirectivesModule,
    LoadingElementModule,
  ],
})
export class AuthorityConnectorListPageModule {}
