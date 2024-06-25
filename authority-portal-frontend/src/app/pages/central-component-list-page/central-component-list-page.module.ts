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
import {SharedModule} from 'src/app/shared/shared.module';
import {CentralComponentListPageComponent} from './central-component-list-page/central-component-list-page.component';
import {DeleteIconButtonComponent} from './delete-icon-button/delete-icon-button.component';
import {CentralComponentListPageStateImpl} from './state/central-component-list-page-state-impl';

@NgModule({
  declarations: [CentralComponentListPageComponent, DeleteIconButtonComponent],
  exports: [CentralComponentListPageComponent],
  imports: [
    // Angular
    CommonModule,
    ReactiveFormsModule,
    RouterModule,

    // NGXS
    NgxsModule.forFeature([CentralComponentListPageStateImpl]),

    // Authority Portal
    SharedModule,
  ],
})
export class CentralComponentListPageModule {}
