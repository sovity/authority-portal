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
import {AuthorityInviteNewOrganizationComponent} from './authority-invite-new-organization/authority-invite-new-organization.component';
import {AuthorityInviteNewOrganizationPageStateImpl} from './authority-invite-new-organization/state/authority-invite-new-organization-page-state-impl';
import {AuthorityOrganizationListPageComponent} from './authority-organization-list-page/authority-organization-list-page.component';
import {AuthorityOrganizationListPageStateImpl} from './authority-organization-list-page/state/authority-organization-list-page-state-impl';

@NgModule({
  declarations: [
    AuthorityOrganizationListPageComponent,
    AuthorityInviteNewOrganizationComponent,
  ],
  imports: [
    // Angular
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,

    // NGXS
    NgxsModule.forFeature([
      AuthorityOrganizationListPageStateImpl,
      AuthorityInviteNewOrganizationPageStateImpl,
    ]),

    // Authority Portal
    SharedModule,
  ],
})
export class AuthorityOrganizationListPageModule {}
