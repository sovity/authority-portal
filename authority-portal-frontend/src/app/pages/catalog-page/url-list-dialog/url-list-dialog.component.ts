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
import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {UrlListDialogData} from './url-list-dialog.data';

@Component({
  selector: 'app-json-dialog',
  templateUrl: './url-list-dialog.component.html',
})
export class UrlListDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<UrlListDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: UrlListDialogData,
  ) {}
}
