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
