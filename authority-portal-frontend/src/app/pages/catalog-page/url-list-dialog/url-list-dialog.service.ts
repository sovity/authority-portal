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
import {MatDialog} from '@angular/material/dialog';
import {NEVER, Observable} from 'rxjs';
import {showDialogUntil} from 'src/app/core/utils/mat-dialog-utils';
import {UrlListDialogComponent} from './url-list-dialog.component';
import {UrlListDialogData} from './url-list-dialog.data';

@Injectable()
export class UrlListDialogService {
  constructor(private dialog: MatDialog) {}

  /**
   * Shows JSON Detail Dialog until until$ emits / completes
   * @param data json detail dialog data
   * @param until$ observable that controls the lifetime of the dialog
   */
  showUrlListDialog(
    data: UrlListDialogData,
    until$: Observable<any> = NEVER,
  ): Observable<unknown> {
    return showDialogUntil(
      this.dialog,
      UrlListDialogComponent,
      {data, autoFocus: false},
      until$,
    );
  }
}
