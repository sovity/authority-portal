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
import {EMPTY, MonoTypeOperatorFunction} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {ToastService} from 'src/app/shared/common/toast-notifications/toast.service';

@Injectable({providedIn: 'root'})
export class ErrorService {
  constructor(private toastService: ToastService) {}

  toastFailure(failureMessage: string, error?: any) {
    this.toastService.showDanger(failureMessage);
    console.error(...[failureMessage, error].filter((it) => it !== undefined));
  }

  toastFailureRxjs<T>(
    failureMessage: string,
    onError?: () => void,
  ): MonoTypeOperatorFunction<T> {
    return catchError((error) => {
      this.toastFailure(failureMessage, error);
      if (onError) {
        onError();
      }
      return EMPTY;
    });
  }

  toastRegistrationErrorRxjs<T>(
    genericFailureMessage: string,
    onError?: () => void,
  ): MonoTypeOperatorFunction<T> {
    return catchError((err) => {
      let errorMessage = genericFailureMessage;
      if (err?.response?.status === 409) {
        errorMessage = 'A user with this email address already exists.';
      }
      this.toastFailure(errorMessage);
      if (onError) {
        onError();
      }
      return EMPTY;
    });
  }
}
