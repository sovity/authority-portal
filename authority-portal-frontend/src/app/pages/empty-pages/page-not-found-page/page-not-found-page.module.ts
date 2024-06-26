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
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../../shared/shared.module';
import { PageNotFoundPageComponent } from './page-not-found-page/page-not-found-page.component';


@NgModule({
  declarations: [PageNotFoundPageComponent],
  imports: [CommonModule, RouterModule, SharedModule],
  exports: [PageNotFoundPageComponent],
})
export class PageNotFoundPageModule {}
