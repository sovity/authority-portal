import {Component, EventEmitter, Input, Output} from '@angular/core';
import {
  CatalogDataOffer,
  DataOfferDetailPageResult,
} from '@sovity.de/authority-portal-client';

@Component({
  selector: 'broker-data-offer-list',
  templateUrl: './broker-data-offer-list.component.html',
  styleUrls: ['./broker-data-offer-list.component.scss'],
})
export class BrokerDataOfferList {
  @Input()
  dataOffers: CatalogDataOffer[] = [];
  columnsToDisplay = ['organizationName', 'title', 'description', 'status'];

  @Output()
  dataOfferClick = new EventEmitter<DataOfferDetailPageResult>();

  onRowClick(clickedOffer: DataOfferDetailPageResult) {
    this.dataOfferClick.emit(clickedOffer);
  }
}
