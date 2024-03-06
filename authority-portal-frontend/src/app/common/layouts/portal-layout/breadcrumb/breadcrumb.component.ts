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

import {Component, OnDestroy} from '@angular/core';
import {Subject, takeUntil} from 'rxjs';
import {BreadcrumbItem} from './breadcrumb.model';
import {BreadcrumbService} from './breadcrumb.service';

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
})
export class BreadcrumbComponent implements OnDestroy {
  breadcrumb: BreadcrumbItem[] = [];

  constructor(private breadcrumbService: BreadcrumbService) {
    this.breadcrumbService.breadcrumb$
      .pipe(takeUntil(this.ngOnDestroy$))
      .subscribe((breadcrumb) => {
        this.breadcrumb = breadcrumb;
      });
  }

  ngOnDestroy$ = new Subject();

  ngOnDestroy(): void {
    this.ngOnDestroy$.next(null);
    this.ngOnDestroy$.complete();
  }

  getLink(idx: number) {
    return this.breadcrumb
      .slice(1, idx + 1)
      .map((s) => s.link)
      .join('/');
  }
}
