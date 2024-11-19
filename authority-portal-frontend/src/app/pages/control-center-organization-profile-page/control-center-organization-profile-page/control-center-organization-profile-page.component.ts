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
import {Component, OnDestroy, OnInit} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {Subject, takeUntil} from 'rxjs';
import {Store} from '@ngxs/store';
import {GlobalStateUtils} from 'src/app/core/global-state/global-state-utils';
import {ActiveFeatureSet} from 'src/app/core/services/config/active-feature-set';
import {Reset} from '../state/control-center-organization-profile-page-action';
import {
  ControlCenterOrganizationProfilePageState,
  DEFAULT_CONTROL_CENTER_ORGANIZATION_PROFILE_PAGE_STATE,
} from '../state/control-center-organization-profile-page-state';
import {ControlCenterOrganizationProfilePageStateImpl} from '../state/control-center-organization-profile-page-state-impl';

@Component({
  selector: 'app-control-center-organization-profile-page',
  templateUrl: './control-center-organization-profile-page.component.html',
})
export class ControlCenterOrganizationProfilePageComponent
  implements OnInit, OnDestroy
{
  state: ControlCenterOrganizationProfilePageState =
    DEFAULT_CONTROL_CENTER_ORGANIZATION_PROFILE_PAGE_STATE;

  constructor(
    private store: Store,
    private globalStateUtils: GlobalStateUtils,
    private titleService: Title,
    private activeFeatureSet: ActiveFeatureSet,
  ) {
    this.activeFeatureSet.usesMdsId()
      ? this.titleService.setTitle('MDS My Organization')
      : this.titleService.setTitle('My Organization');
  }

  ngOnInit(): void {
    this.refresh();
    this.startListeningToState();
    this.startRefreshingOnEnvChange();
  }

  refresh(): void {
    this.store.dispatch(Reset);
  }

  startListeningToState(): void {
    this.store
      .select<ControlCenterOrganizationProfilePageState>(
        ControlCenterOrganizationProfilePageStateImpl,
      )
      .pipe(takeUntil(this.ngOnDestroy$))
      .subscribe((state) => {
        this.state = state;
      });
  }

  startRefreshingOnEnvChange() {
    this.globalStateUtils.onDeploymentEnvironmentChangeSkipFirst({
      ngOnDestroy$: this.ngOnDestroy$,
      onChanged: () => {
        this.refresh();
      },
    });
  }

  ngOnDestroy$ = new Subject();
  ngOnDestroy(): void {
    this.ngOnDestroy$.next(null);
    this.ngOnDestroy$.complete();
  }
}
