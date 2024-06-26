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
import { AfterViewInit, Component, ElementRef, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';
import { NgxJsonViewerComponent } from 'ngx-json-viewer';
import { cleanJson } from './clean-json';
import { DialogToolbarButton, JsonDialogData } from './json-dialog.data';


@Component({
  selector: 'app-json-dialog',
  templateUrl: './json-dialog.component.html',
})
export class JsonDialogComponent implements OnInit, AfterViewInit, OnDestroy {
  busy = false;

  removeNulls = true;

  visibleJson: unknown = {};

  @ViewChild(NgxJsonViewerComponent, {read: ElementRef})
  jsonViewer!: ElementRef;

  constructor(
    public dialogRef: MatDialogRef<JsonDialogComponent>,
    private matDialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: JsonDialogData,
  ) {}

  ngOnInit() {
    this.updateVisibleJson();
  }

  ngAfterViewInit() {
    this.jsonViewer.nativeElement.scrollIntoView();
  }

  updateVisibleJson() {
    this.visibleJson = this.removeNulls
      ? cleanJson(this.data.objectForJson)
      : this.data.objectForJson;
  }
  doAction(button: DialogToolbarButton) {
    if (this.busy) {
      return;
    }
    this.busy = true;
    button
      .action()
      .pipe(
        finalize(() => (this.busy = false)),
        takeUntil(this.ngOnDestroy$),
      )
      .subscribe();
  }

  ngOnDestroy$ = new Subject();

  ngOnDestroy(): void {
    this.ngOnDestroy$.next(null);
    this.ngOnDestroy$.complete();
  }
}
