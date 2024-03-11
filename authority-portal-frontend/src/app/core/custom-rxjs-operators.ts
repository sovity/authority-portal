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
import {MonoTypeOperatorFunction, NEVER} from 'rxjs';
import {finalize, tap} from 'rxjs/operators';
import {StateContext} from '@ngxs/store';
import {ErrorService} from './error.service';
import {ToastService} from './toast-notifications/toast.service';

@Injectable({providedIn: 'root'})
export class CustomRxjsOperators {
  constructor(
    private router: Router,
    private errorService: ErrorService,
    private toast: ToastService,
  ) {}

  onSuccessRedirect<T>(routerLink: string[]): MonoTypeOperatorFunction<T> {
    return (apiCall) => {
      return apiCall.pipe(tap(() => this.router.navigate(routerLink)));
    };
  }

  withToastResultHandling<T>(actionName: string): MonoTypeOperatorFunction<T> {
    return (apiCall) => {
      return apiCall.pipe(
        this.errorService.toastFailureRxjs(`${actionName} failed!`),
        tap(() => this.toast.showSuccess(`${actionName} was successful.`)),
      );
    };
  }

  withBusyLock<T, S extends {busy: boolean}>(
    ctx: StateContext<S>,
  ): MonoTypeOperatorFunction<T> {
    return (apiCall) => {
      if (ctx.getState().busy) {
        return NEVER;
      } else {
        ctx.patchState({busy: true} as Partial<S>);
        return apiCall.pipe(
          finalize(() => ctx.patchState({busy: false} as Partial<S>)),
        );
      }
    };
  }
}
