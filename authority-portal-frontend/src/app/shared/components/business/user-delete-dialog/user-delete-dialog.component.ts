import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Subject, takeUntil} from 'rxjs';
import {finalize} from 'rxjs/operators';
import {UserDeletionCheck} from '@sovity.de/authority-portal-client';
import {ApiService} from '../../../../core/api/api.service';
import {ErrorService} from '../../../../core/error.service';
import {Fetched} from '../../../../core/utils/fetched';
import {UserDeleteDialog} from './user-delete-dialog.model';

@Component({
  selector: 'app-user-delete-dialog',
  templateUrl: './user-delete-dialog.component.html',
})
export class UserDeleteDialogComponent implements OnInit, OnDestroy {
  modalData: Fetched<UserDeletionCheck> | null = null;
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
