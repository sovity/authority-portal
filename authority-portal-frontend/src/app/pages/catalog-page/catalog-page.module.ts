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
import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {NgxsModule} from '@ngxs/store';
import {NgxJsonViewerModule} from 'ngx-json-viewer';
import {AgoComponent} from '../../shared/common/ago/ago.component';
import {SharedModule} from '../../shared/shared.module';
import {AssetCardTagListComponent} from './asset-card-tag-list/asset-card-tag-list.component';
import {AssetDetailDialogDataService} from './asset-detail-dialog/asset-detail-dialog-data.service';
import {AssetDetailDialogComponent} from './asset-detail-dialog/asset-detail-dialog.component';
import {AssetDetailDialogService} from './asset-detail-dialog/asset-detail-dialog.service';
import {AssetPropertyGridGroupBuilder} from './asset-detail-dialog/asset-property-grid-group-builder';
import {BrokerDataOfferCardsComponent} from './broker-data-offer-cards/broker-data-offer-cards.component';
import {BrokerDataOfferList} from './broker-data-offer-list/broker-data-offer-list.component';
import {CatalogPageComponent} from './catalog-page/catalog-page.component';
import {CatalogPageState} from './catalog-page/state/catalog-page-state';
import {FilterBoxComponent} from './filter-box/filter-box.component';
import {IconWithOnlineStatusComponent} from './icon-with-online-status/icon-with-online-status.component';
import {JsonDialogComponent} from './json-dialog/json-dialog.component';
import {JsonDialogService} from './json-dialog/json-dialog.service';
import {MarkdownDescriptionComponent} from './markdown-description/markdown-description.component';
import {PropertyGridGroupComponent} from './property-grid-group/property-grid-group.component';
import {PropertyGridComponent} from './property-grid/property-grid.component';
import {SmallIconWithOnlineStatusText} from './small-icon-with-online-status-text/small-icon-with-online-status-text.component';
import {TruncatedShortDescription} from './truncated-short-description/truncated-short-description.component';
import {UrlListDialogComponent} from './url-list-dialog/url-list-dialog.component';
import {UrlListDialogService} from './url-list-dialog/url-list-dialog.service';
import {ViewSelectionComponent} from './view-selection/view-selection.component';

@NgModule({
  imports: [
    // Angular
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,

    // NGXS
    NgxsModule.forFeature([CatalogPageState]),

    // Feature Modules
    SharedModule,

    // Thirdparty
    NgxJsonViewerModule,
  ],
  declarations: [
    AssetCardTagListComponent,
    AssetDetailDialogComponent,
    BrokerDataOfferCardsComponent,
    BrokerDataOfferList,
    CatalogPageComponent,
    FilterBoxComponent,
    IconWithOnlineStatusComponent,
    JsonDialogComponent,
    MarkdownDescriptionComponent,
    PropertyGridComponent,
    PropertyGridGroupComponent,
    SmallIconWithOnlineStatusText,
    TruncatedShortDescription,
    UrlListDialogComponent,
    ViewSelectionComponent,
  ],
  providers: [
    AssetDetailDialogDataService,
    AssetDetailDialogService,
    AssetPropertyGridGroupBuilder,
    JsonDialogService,
    UrlListDialogService,
  ],
  exports: [CatalogPageComponent],
})
export class CatalogPageModule {}
