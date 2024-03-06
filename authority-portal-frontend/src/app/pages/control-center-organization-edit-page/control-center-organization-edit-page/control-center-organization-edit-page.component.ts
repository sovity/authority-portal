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
import {
  Reset,
  Submit,
} from '../state/control-center-organization-edit-page-action';
import {
  ControlCenterOrganizationEditPageState,
  DEFAULT_CONTROL_CENTER_ORGANIZATION_EDIT_PAGE_STATE,
} from '../state/control-center-organization-edit-page-state';
import {ControlCenterOrganizationEditPageStateImpl} from '../state/control-center-organization-edit-page-state-impl';
import {ControlCenterOrganizationEditPageForm} from './control-center-organization-edit-page.form';

@Component({
  selector: 'app-control-center-organization-edit-page',
  templateUrl: './control-center-organization-edit-page.component.html',
})
export class ControlCenterOrganizationEditPageComponent
  implements OnInit, OnDestroy
{
  form: ControlCenterOrganizationEditPageForm | null = null;
  state: ControlCenterOrganizationEditPageState =
    DEFAULT_CONTROL_CENTER_ORGANIZATION_EDIT_PAGE_STATE;

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.reset();
    this.startListeningToState();
  }

  reset(): void {
    this.store.dispatch(new Reset((form) => (this.form = form)));
  }

  startListeningToState(): void {
    this.store
      .select<ControlCenterOrganizationEditPageState>(
        ControlCenterOrganizationEditPageStateImpl,
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

  onSubmitClick(): void {
    this.store.dispatch(new Submit(this.form!.value));
  }
}
