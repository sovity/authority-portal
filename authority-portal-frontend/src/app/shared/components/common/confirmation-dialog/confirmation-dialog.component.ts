import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {ConfirmationDialog} from './confirmation-dialog.model';

@Component({
  selector: 'app-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
})
export class ConfirmationDialogComponent {
  constructor(
    private dialogRef: MatDialogRef<ConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public confirmationDialog: ConfirmationDialog,
  ) {
    this.confirmationDialog.actionButtons.push({
      label: 'Cancel',
      action: 'CANCEL',
    });
  }

  actionHandler(action: string) {
    this.dialogRef.close(action);
  }
}
