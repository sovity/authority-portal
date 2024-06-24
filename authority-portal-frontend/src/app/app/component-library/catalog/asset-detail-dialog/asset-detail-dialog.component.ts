import {Component, Inject, OnDestroy} from '@angular/core';
import {MAT_DIALOG_DATA,} from '@angular/material/dialog';
import {isObservable, Observable, Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {PropertyGridGroup} from '../../property-grid/property-grid-group/property-grid-group';
import {AssetDetailDialogData} from './asset-detail-dialog-data';
import {UiAssetMapped} from "../../../core/services/models/ui-asset-mapped";

/**
 * Asset Detail Dialog
 * Contract Agreement Detail Dialog
 * Contract Offer Detail Dialog
 * <p>
 * All in one! If that's a good idea remains to be seen.
 */
@Component({
  selector: 'asset-detail-dialog',
  templateUrl: './asset-detail-dialog.component.html',
  styleUrls: ['./asset-detail-dialog.component.scss'],
})
export class AssetDetailDialogComponent implements OnDestroy {
  data!: AssetDetailDialogData;
  asset!: UiAssetMapped;
  propGroups!: PropertyGridGroup[];

  loading = false;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    private _data: AssetDetailDialogData | Observable<AssetDetailDialogData>,
  ) {
    if (isObservable(this._data)) {
      this._data
        .pipe(takeUntil(this.ngOnDestroy$))
        .subscribe((data) => this.setData(data));
    } else {
      this.setData(this._data);
    }
  }

  setData(data: AssetDetailDialogData) {
    this.data = data;
    this.asset = this.data.asset;
    this.propGroups = this.data.propertyGridGroups;
  }

  ngOnDestroy$ = new Subject();

  ngOnDestroy(): void {
    this.ngOnDestroy$.next(null);
    this.ngOnDestroy$.complete();
  }
}
