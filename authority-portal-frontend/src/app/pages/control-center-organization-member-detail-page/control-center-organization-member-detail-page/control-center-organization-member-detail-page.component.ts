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
import {ActivatedRoute} from '@angular/router';
import {Subject, takeUntil} from 'rxjs';
import {Store} from '@ngxs/store';
import {Reset} from '../state/control-center-organization-member-detail-page-action';
import {
  ControlCenterOrganizationMemberDetailPageState,
  DEFAULT_CONTROL_CENTER_ORGANIZATION_MEMBER_DETAIL_PAGE_STATE,
} from '../state/control-center-organization-member-detail-page-state';
import {ControlCenterOrganizationMemberDetailPageStateImpl} from '../state/control-center-organization-member-detail-page-state-impl';

@Component({
  selector: 'app-control-center-organization-member-detail-page',
  templateUrl:
    './control-center-organization-member-detail-page.component.html',
})
export class ControlCenterOrganizationMemberDetailPageComponent
  implements OnInit, OnDestroy
{
  state: ControlCenterOrganizationMemberDetailPageState =
    DEFAULT_CONTROL_CENTER_ORGANIZATION_MEMBER_DETAIL_PAGE_STATE;

  constructor(private store: Store, private activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.startRefreshingOnRouteChanges();
    this.startListeningToState();
  }

  startRefreshingOnRouteChanges(): void {
    this.activatedRoute.params.subscribe((params) => {
      this.store.dispatch(new Reset(params.userId, this.ngOnDestroy$));
    });
  }

  startListeningToState(): void {
    this.store
      .select<ControlCenterOrganizationMemberDetailPageState>(
        ControlCenterOrganizationMemberDetailPageStateImpl,
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
