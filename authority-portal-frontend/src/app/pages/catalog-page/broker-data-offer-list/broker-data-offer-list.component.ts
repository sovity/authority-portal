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
import {Component, EventEmitter, Input, Output} from '@angular/core';
import {CatalogDataOffer} from '@sovity.de/authority-portal-client';
import {getOrganizationRegistrationStatusClasses} from '../../../core/utils/ui-utils';
import {DEFAULT_AUTHORITY_ORGANIZATION_LIST_PAGE_STATE} from '../../authority-organization-list-page/authority-organization-list-page/state/authority-organization-list-page-state';

@Component({
  selector: 'broker-data-offer-list',
  templateUrl: './broker-data-offer-list.component.html',
})
export class BrokerDataOfferList {
  @Input()
  dataOffers: CatalogDataOffer[] = [];

  @Output()
  dataOfferClick = new EventEmitter<CatalogDataOffer>();
}
