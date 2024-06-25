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
import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {Observable} from 'rxjs';
import {ignoreElements, tap} from 'rxjs/operators';
import {Action, State, StateContext} from '@ngxs/store';
import {
  OwnOrganizationDetailsDto,
  UserRoleDto,
} from '@sovity.de/authority-portal-client';
import {ApiService} from 'src/app/core/api/api.service';
import {Fetched} from 'src/app/core/utils/fetched';
import {HeaderBarConfig} from '../../../shared/common/header-bar/header-bar.model';
import {Reset} from './control-center-organization-profile-page-action';
import {
  ControlCenterOrganizationProfilePageState,
  DEFAULT_CONTROL_CENTER_ORGANIZATION_PROFILE_PAGE_STATE,
} from './control-center-organization-profile-page-state';

type Ctx = StateContext<ControlCenterOrganizationProfilePageState>;

@State<ControlCenterOrganizationProfilePageState>({
  name: 'ControlCenterOrganizationProfilePageState',
  defaults: DEFAULT_CONTROL_CENTER_ORGANIZATION_PROFILE_PAGE_STATE,
})
@Injectable()
export class ControlCenterOrganizationProfilePageStateImpl {
  constructor(private apiService: ApiService, private router: Router) {}

  @Action(Reset)
  onReset(ctx: Ctx): Observable<never> {
    return this.apiService.getOwnOrganizationDetails().pipe(
      Fetched.wrap({failureMessage: 'Failed to fetch user details'}),
      tap((organization) => {
        ctx.patchState({
          organization,
          headerBarConfig: organization
            .map((data) => this.buildHeaderBarConfig(data))
            .orElse(null),
        });
      }),
      ignoreElements(),
    );
  }

  private buildHeaderBarConfig(
    organization: OwnOrganizationDetailsDto,
  ): HeaderBarConfig {
    return {
      title: organization.name,
      subtitle: 'Your Organization Profile',
      headerActions: [
        {
          label: 'Edit',
          action: () =>
            this.router.navigate(['/control-center/my-organization/edit']),
          permissions: [UserRoleDto.Admin],
        },
      ],
    };
  }
}
