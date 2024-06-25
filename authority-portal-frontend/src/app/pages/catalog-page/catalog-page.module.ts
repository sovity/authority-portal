import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {NgxsModule} from '@ngxs/store';
import {NgxJsonViewerModule} from 'ngx-json-viewer';
import {SharedModule} from '../../shared/shared.module';
import {AgoComponent} from './ago/ago.component';
import {AssetCardTagListComponent} from './asset-card-tag-list/asset-card-tag-list.component';
import {AssetDetailDialogDataService} from './asset-detail-dialog/asset-detail-dialog-data.service';
import {AssetDetailDialogComponent} from './asset-detail-dialog/asset-detail-dialog.component';
import {AssetDetailDialogService} from './asset-detail-dialog/asset-detail-dialog.service';
import {BrokerDataOfferCardsComponent} from './broker-data-offer-cards/broker-data-offer-cards.component';
import {BrokerDataOfferList} from './broker-data-offer-list/broker-data-offer-list.component';
import {CatalogPageComponent} from './catalog-page/catalog-page.component';
import {FilterBoxComponent} from './filter-box/filter-box.component';
import {IconWithOnlineStatusComponent} from './icon-with-online-status/icon-with-online-status.component';
import {JsonDialogComponent} from './json-dialog/json-dialog.component';
import {JsonDialogService} from './json-dialog/json-dialog.service';
import {MarkdownDescriptionComponent} from './markdown-description/markdown-description.component';
import {PropertyGridGroupComponent} from './property-grid-group/property-grid-group.component';
import {PropertyGridComponent} from './property-grid/property-grid.component';
import {SmallIconWithOnlineStatusText} from './small-icon-with-online-status-text/small-icon-with-online-status-text.component';
import {CatalogPageState} from './state/catalog-page-state';
import {TruncatedShortDescription} from './truncated-short-description/truncated-short-description.component';
import {UrlListDialogComponent} from './url-list-dialog/url-list-dialog.component';
import {UrlListDialogService} from './url-list-dialog/url-list-dialog.service';

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
    AgoComponent,
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
  ],
  providers: [
    AssetDetailDialogDataService,
    AssetDetailDialogService,
    JsonDialogService,
    UrlListDialogService,
  ],
  exports: [CatalogPageComponent],
})
export class CatalogPageModule {}
