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
import {Subject} from 'rxjs';
import {Store} from '@ngxs/store';
import {GlobalState} from 'src/app/core/global-state/global-state';
import {GlobalStateImpl} from 'src/app/core/global-state/global-state-impl';

@Component({
  selector: 'app-loading-page',
  templateUrl: './loading-page.component.html',
})
export class LoadingPageComponent implements OnInit, OnDestroy {
  state!: GlobalState;

  private ngOnDestroy$ = new Subject();

  constructor(private store: Store) {}

  ngOnInit() {
    this.startListeningToGlobalState();
  }

  private startListeningToGlobalState() {
    this.store
      .select<GlobalState>(GlobalStateImpl)
      .subscribe((state) => (this.state = state));
  }

  ngOnDestroy(): void {
    this.ngOnDestroy$.next(null);
    this.ngOnDestroy$.complete();
  }
}
