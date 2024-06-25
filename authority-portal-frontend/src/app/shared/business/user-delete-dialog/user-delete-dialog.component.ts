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
import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Subject, takeUntil} from 'rxjs';
import {finalize} from 'rxjs/operators';
import {UserDeletionCheck} from '@sovity.de/authority-portal-client';
import {ApiService} from 'src/app/core/api/api.service';
import {ErrorService} from 'src/app/core/services/error.service';
import {Fetched} from 'src/app/core/utils/fetched';
import {UserDeleteDialog} from './user-delete-dialog.model';

@Component({
  selector: 'app-user-delete-dialog',
  templateUrl: './user-delete-dialog.component.html',
})
export class UserDeleteDialogComponent implements OnInit, OnDestroy {
  modalData: Fetched<UserDeletionCheck> = Fetched.empty();
  deleteOrganizationCreatorForm = this.formBuilder.nonNullable.group({
    successor: ['', Validators.required],
  });
  isBusy = false;

  constructor(
    private apiService: ApiService,
    private errorService: ErrorService,
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<UserDeleteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: UserDeleteDialog,
  ) {}

  ngOnInit() {
    this.apiService
      .checkUserDeletion(this.data.userId)
      .pipe(
        takeUntil(this.ngOnDestroy$),
        Fetched.wrap({failureMessage: 'Failed fetching user deletion check.'}),
      )
      .subscribe((modalData) => {
        this.modalData = modalData;
      });
  }

  onDismiss() {
    this.dialogRef.close(null);
  }

  get isLastParticipantAdmin() {
    return this.modalData?.dataOrUndefined?.isLastParticipantAdmin ?? false;
  }

  get isOrganizationCreator() {
    return this.modalData?.dataOrUndefined?.isOrganizationCreator ?? false;
  }

  onConfirmDeleteUserClick() {
    const successorId = this.deleteOrganizationCreatorForm.value.successor;
    this.isBusy = true;
    this.apiService
      .deleteUser(this.data.userId, successorId)
      .pipe(
        finalize(() => (this.isBusy = false)),
        this.errorService.toastFailureRxjs('Failed deleting user'),
      )
      .subscribe(() => {
        this.dialogRef.close(true);
        this.data.onDeleteSuccess(this.modalData!.data);
      });
  }

  ngOnDestroy$ = new Subject();

  ngOnDestroy() {
    this.ngOnDestroy$.next(null);
    this.ngOnDestroy$.complete();
  }
}
