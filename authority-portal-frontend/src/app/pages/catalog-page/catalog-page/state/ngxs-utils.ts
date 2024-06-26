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
import { Injectable } from '@angular/core';
import { MonoTypeOperatorFunction } from 'rxjs';
import { sampleTime, takeUntil } from 'rxjs/operators';
import { Actions, Store, ofActionDispatched } from '@ngxs/store';


@Injectable({providedIn: 'root'})
export class NgxsUtils {
  constructor(private actions$: Actions, private store: Store) {}

  sampleTime(
    debounceActionType: any,
    executeActionType: any,
    sampleTimeMs: number,
  ) {
    this.actions$
      .pipe(ofActionDispatched(debounceActionType), sampleTime(sampleTimeMs))
      .subscribe(() => {
        this.store.dispatch(executeActionType);
      });
  }

  takeUntil<T>(actionType: any): MonoTypeOperatorFunction<T> {
    return (obs) =>
      obs.pipe(takeUntil(this.actions$.pipe(ofActionDispatched(actionType))));
  }
}
