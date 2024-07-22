import {Component, OnDestroy} from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';
import {Subject} from 'rxjs';

@Component({
  selector: 'app-asset-not-available-dialog',
  templateUrl: './asset-not-available-dialog.component.html',
})
export class AssetNotAvailableDialogComponent implements OnDestroy {
  constructor(
    private dialogRef: MatDialogRef<AssetNotAvailableDialogComponent>,
  ) {}

  closeDialog(): void {
    this.dialogRef.close();
  }

  ngOnDestroy$ = new Subject();

  ngOnDestroy(): void {
    this.ngOnDestroy$.next(null);
    this.ngOnDestroy$.complete();
  }
}
