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
import {NEVER, Observable, takeUntil} from 'rxjs';
import {map, switchMap} from 'rxjs/operators';
import {DataOfferDetailPageQuery} from '@sovity.de/authority-portal-client';
import {CatalogApiService} from 'src/app/core/api/catalog-api.service';
import {GlobalStateUtils} from 'src/app/core/global-state/global-state-utils';
import {showDialogUntil} from 'src/app/core/utils/mat-dialog-utils';
import {CustomRxjsOperators} from '../../../core/services/custom-rxjs-operators';
import {ErrorService} from '../../../core/services/error.service';
import {AssetDetailDialogData} from './asset-detail-dialog-data';
import {AssetDetailDialogDataService} from './asset-detail-dialog-data.service';
import {AssetDetailDialogComponent} from './asset-detail-dialog.component';

@Injectable()
export class AssetDetailDialogService {
  constructor(
    private dialog: MatDialog,
    private globalStateUtils: GlobalStateUtils,
    private catalogApiService: CatalogApiService,
    private assetDetailDialogDataService: AssetDetailDialogDataService,
    private errorService: ErrorService,
  ) {}

  /**
   * Shows an Asset Detail Dialog until until$ emits / completes
   * @param connectorId Connector ID
   * @param assetId Asset ID
   * @param until$ observable that controls the lifetime of the dialog
   */
  open(
    assetId: string,
    connectorId: string,
    until$: Observable<any> = NEVER,
  ): Observable<undefined> {
    return this.globalStateUtils.getDeploymentEnvironmentId().pipe(
      switchMap((envId) => {
        const query: DataOfferDetailPageQuery = {connectorId, assetId};
        return this.catalogApiService.dataOfferDetailPage(envId, query);
      }),
      takeUntil(until$),
      map((result) =>
        this.assetDetailDialogDataService.dataOfferDetailPage(result),
      ),
      this.errorService.toastFailureRxjs('Failed to load Data Offer Details'),
      switchMap((data) => this.openDialogWithData(data, until$)),
    );
  }

  /**
   * Shows an Asset Detail Dialog until until$ emits / completes
   * @param data Asset Detail Dialog data, or a stream if there's a need to refresh the data
   * @param until$ observable that controls the lifetime of the dialog
   */
  private openDialogWithData(
    data: AssetDetailDialogData | Observable<AssetDetailDialogData>,
    until$: Observable<any> = NEVER,
  ): Observable<undefined> {
    return showDialogUntil(
      this.dialog,
      AssetDetailDialogComponent,
      {data, maxWidth: '1000px', maxHeight: '90vh', autoFocus: false},
      until$,
    );
  }
}
