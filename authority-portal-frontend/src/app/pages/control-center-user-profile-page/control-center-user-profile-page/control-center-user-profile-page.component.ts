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
import {Reset} from '../state/control-center-user-profile-page-action';
import {
  ControlCenterUserProfilePageState,
  DEFAULT_CONTROL_CENTER_USER_PROFILE_PAGE_STATE,
} from '../state/control-center-user-profile-page-state';
import {ControlCenterUserProfilePageStateImpl} from '../state/control-center-user-profile-page-state-impl';

@Component({
  selector: 'app-control-center-user-profile-page',
  templateUrl: './control-center-user-profile-page.component.html',
})
export class ControlCenterUserProfilePageComponent
  implements OnInit, OnDestroy
{
  state: ControlCenterUserProfilePageState =
    DEFAULT_CONTROL_CENTER_USER_PROFILE_PAGE_STATE;

  constructor(
    private store: Store,
    private globalStateUtils: GlobalStateUtils,
    private titleService: Title,
  ) {
    this.titleService.setTitle('My Profile');
  }

  ngOnInit(): void {
    this.refresh();
    this.startListeningToState();
    this.startRefreshingOnEnvChange();
  }

  refresh(): void {
    this.store.dispatch(new Reset(this.ngOnDestroy$));
  }

  startListeningToState(): void {
    this.store
      .select<ControlCenterUserProfilePageState>(
        ControlCenterUserProfilePageStateImpl,
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
