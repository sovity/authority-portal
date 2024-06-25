import {
  Component,
  EventEmitter,
  HostBinding,
  Input,
  Output,
} from '@angular/core';
import {
  CatalogDataOffer,
  DataOfferDetailPageResult,
} from '@sovity.de/authority-portal-client';

@Component({
  selector: 'broker-data-offer-cards',
  templateUrl: './broker-data-offer-cards.component.html',
})
export class BrokerDataOfferCardsComponent {
  @HostBinding('class.flex')
  @HostBinding('class.flex-wrap')
  @HostBinding('class.gap-[10px]')
  cls = true;

  @Input()
  dataOffers: CatalogDataOffer[] = [];

  @Output()
  dataOfferClick = new EventEmitter<DataOfferDetailPageResult>();
}
