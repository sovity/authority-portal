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
import {RouterModule} from '@angular/router';
import {NgxsModule} from '@ngxs/store';
import {SharedModule} from 'src/app/shared/shared.module';
import {AuthorityOrganizationDetailPageComponent} from './authority-organization-detail-page/authority-organization-detail-page.component';
import {AuthorityOrganizationDetailPageStateImpl} from './state/authority-organization-detail-page-state-impl';
import {OrganizationDetailInfoComponent} from './sub-pages/organization-detail-info/organization-detail-info.component';
import {OrganizationUserDetailComponent} from './sub-pages/organization-user-detail/organization-user-detail.component';
import {OrganizationUserListComponent} from './sub-pages/organization-user-list/organization-user-list.component';

@NgModule({
  declarations: [
    AuthorityOrganizationDetailPageComponent,

    //sub-pages
    OrganizationDetailInfoComponent,
    OrganizationUserListComponent,
    OrganizationUserDetailComponent,
  ],
  imports: [
    // Angular
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,

    // NGXS
    NgxsModule.forFeature([AuthorityOrganizationDetailPageStateImpl]),

    // Authority Portal
    SharedModule,
  ],
})
export class AuthorityOrganizationDetailPageModule {}
