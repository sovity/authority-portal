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
import {SharedModule} from 'src/app/shared/shared.module';
import {LoadingElementModule} from '../../common/components/loading-element/loading-element.module';
import {MdsHomePageComponent} from './mds-home/mds-home.component';

@NgModule({
  imports: [
    // Angular
    CommonModule,

    // Authority Portal
    SharedModule,
    LoadingElementModule,
  ],
  declarations: [MdsHomePageComponent],
  exports: [MdsHomePageComponent],
})
export class MdsHomePageModule {}
