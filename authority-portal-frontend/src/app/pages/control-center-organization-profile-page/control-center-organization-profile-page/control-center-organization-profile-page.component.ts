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
import {Subject, takeUntil} from 'rxjs';
import {Store} from '@ngxs/store';
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

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.refresh();
    this.startListeningToState();
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

  ngOnDestroy$ = new Subject();
  ngOnDestroy(): void {
    this.ngOnDestroy$.next(null);
    this.ngOnDestroy$.complete();
  }
}
