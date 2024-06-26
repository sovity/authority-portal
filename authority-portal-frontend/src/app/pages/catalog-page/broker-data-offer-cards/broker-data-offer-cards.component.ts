import {
  Component,
  EventEmitter,
  HostBinding,
  Input,
  Output,
} from '@angular/core';
import {CatalogDataOffer} from '@sovity.de/authority-portal-client';

@Component({
  selector: 'broker-data-offer-cards',
  templateUrl: './broker-data-offer-cards.component.html',
})
export class BrokerDataOfferCardsComponent {
  @HostBinding('class.flex')
  cls = true;

  @Input()
  dataOffers: CatalogDataOffer[] = [];

  @Output()
  dataOfferClick = new EventEmitter<CatalogDataOffer>();
}
