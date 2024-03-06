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

import {Component, OnDestroy, OnInit, TrackByFunction} from '@angular/core';
import {Subject, takeUntil} from 'rxjs';
import {ToastNotification, ToastService} from '../toast.service';

@Component({
  selector: 'app-toast-notifications',
  templateUrl: './toast-notifications.component.html',
})
export class ToastNotificationsComponent implements OnInit, OnDestroy {
  toasts: ToastNotification[] = [];

  constructor(public toastService: ToastService) {}

  dismiss(id: number): void {
    this.toastService.dismissToast(id);
  }

  trackByFn: TrackByFunction<ToastNotification> = (_, item) => item.id;

  ngOnInit(): void {
    this.toastService.toasts$
      .pipe(takeUntil(this.ngOnDestroy$))
      .subscribe((toasts) => {
        this.toasts = toasts;
      });
  }

  ngOnDestroy$ = new Subject<void>();
  ngOnDestroy(): void {
    this.ngOnDestroy$.next();
    this.ngOnDestroy$.complete();
  }
}
