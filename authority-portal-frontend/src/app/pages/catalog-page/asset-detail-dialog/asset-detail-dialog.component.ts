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
import {Component, Inject, OnDestroy} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {Observable, Subject, isObservable} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {
  DataOfferDetailPageResult,
  UiAsset,
} from '@sovity.de/authority-portal-client';
import {MailtoLinkBuilder} from 'src/app/core/services/mailto-link-builder';
import {PropertyGridGroup} from '../property-grid-group/property-grid-group';
import {AssetDetailDialogData} from './asset-detail-dialog-data';

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
  asset!: UiAsset;
  propGroups!: PropertyGridGroup[];
  dataOffer!: DataOfferDetailPageResult;

  loading = false;

  get isOnRequestDataOffer(): boolean {
    return this.data.dataOffer.asset.dataSourceAvailability === 'ON_REQUEST';
  }

  get onRequestContactLink(): string {
    if (!this.asset.onRequestContactEmail) {
      throw new Error('On request asset must have contact email');
    }
    return this.mailtoLinkBuilder.buildMailtoUrl(
      this.asset.onRequestContactEmail,
      this.asset.onRequestContactEmailSubject ??
        "I'm interested in your data offer",
    );
  }

  constructor(
    @Inject(MAT_DIALOG_DATA)
    private _data: AssetDetailDialogData | Observable<AssetDetailDialogData>,
    private mailtoLinkBuilder: MailtoLinkBuilder,
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
    this.asset = this.data.dataOffer.asset;
    this.dataOffer = this.data.dataOffer;
    this.propGroups = this.data.propertyGridGroups;
  }

  ngOnDestroy$ = new Subject();

  ngOnDestroy(): void {
    this.ngOnDestroy$.next(null);
    this.ngOnDestroy$.complete();
  }
}
