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
import {BehaviorSubject} from 'rxjs';

export type ToastNotification = {
  id: number;
  style: ToastStyle;
  message: string;
};

export enum ToastStyle {
  Success = 'SUCCESS',
  Warning = 'WARNING',
  Danger = 'DANGER',
}

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  toasts$: BehaviorSubject<ToastNotification[]> = new BehaviorSubject<
    ToastNotification[]
  >([]);

  private id = 1;

  showSuccess(message: string): void {
    this.showToast(ToastStyle.Success, message);
  }

  showDanger(message: string): void {
    this.showToast(ToastStyle.Danger, message);
  }

  showWarning(message: string): void {
    this.showToast(ToastStyle.Warning, message);
  }

  showToast(style: ToastStyle, message: string): void {
    const newToast: ToastNotification = {
      id: this.nextId(),
      style,
      message,
    };

    this.patchToasts((toasts) => [...toasts, newToast]);

    setTimeout(() => this.dismissToast(newToast.id), 5000);
  }

  dismissToast(id: number): void {
    this.patchToasts((toasts) => toasts.filter((toast) => toast.id !== id));
  }

  private nextId(): number {
    return this.id++;
  }

  private patchToasts(
    mapper: (previous: ToastNotification[]) => ToastNotification[],
  ) {
    this.toasts$.next(mapper(this.toasts$.value));
  }
}
