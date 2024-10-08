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
  CatalogDataOffer,
  CatalogPageQuery,
  CatalogPageResult,
  DataOfferDetailPageQuery,
  DataOfferDetailPageResult,
} from '@sovity.de/authority-portal-client';
import {subDays, subMinutes} from 'date-fns';
import {TestAssets} from './data/test-assets';
import {TestPolicies} from './data/test-policies';

const myConnector: Pick<
  DataOfferDetailPageResult,
  'connectorId' | 'connectorEndpoint' | 'organizationId' | 'organizationName'
> = {
  organizationId: 'MDSL1234XX',
  organizationName: 'My Organization',
  connectorId: 'MDSL1234XX.C1234XX',
  connectorEndpoint: 'https://my-connector.my-organization.com/api/dsp',
};

const DATA_OFFERS: DataOfferDetailPageResult[] = [
  {
    assetId: TestAssets.full.assetId,
    assetTitle: TestAssets.full.title,
    asset: TestAssets.full,
    ...myConnector,
    viewCount: 103,
    connectorOfflineSinceOrLastUpdatedAt: subMinutes(new Date(), 5),
    updatedAt: subMinutes(new Date(), 5),
    createdAt: subDays(new Date(), 7),
    connectorOnlineStatus: 'ONLINE',
    contractOffers: [
      {
        contractOfferId: 'contract-offer-1',
        updatedAt: subMinutes(new Date(), 5),
        createdAt: subDays(new Date(), 7),
        contractPolicy: TestPolicies.connectorRestricted,
      },
    ],
  },
  {
    assetId: TestAssets.withSuffix(TestAssets.boring, '2').assetId,
    assetTitle: TestAssets.withSuffix(TestAssets.boring, '2').title,
    asset: TestAssets.withSuffix(TestAssets.boring, '2'),
    ...myConnector,
    viewCount: 103,
    connectorOfflineSinceOrLastUpdatedAt: subMinutes(new Date(), 5),
    updatedAt: subMinutes(new Date(), 5),
    createdAt: subDays(new Date(), 7),
    connectorOnlineStatus: 'OFFLINE',
    contractOffers: [
      {
        contractOfferId: 'contract-offer-1',
        updatedAt: subMinutes(new Date(), 5),
        createdAt: subDays(new Date(), 7),
        contractPolicy: TestPolicies.warnings,
      },
    ],
  },
  {
    assetId: TestAssets.onRequestAsset.assetId,
    assetTitle: TestAssets.onRequestAsset.title,
    asset: TestAssets.onRequestAsset,
    ...myConnector,
    viewCount: 55,
    connectorOfflineSinceOrLastUpdatedAt: subMinutes(new Date(), 30),
    updatedAt: subMinutes(new Date(), 5),
    createdAt: subDays(new Date(), 30),
    connectorOnlineStatus: 'ONLINE',
    contractOffers: [
      {
        contractOfferId: 'on-request-contract-offer-1',
        updatedAt: subMinutes(new Date(), 20),
        createdAt: subDays(new Date(), 20),
        contractPolicy: TestPolicies.unrestricted,
      },
    ],
  },
  {
    assetId: TestAssets.boring.assetId,
    assetTitle: TestAssets.boring.title,
    asset: TestAssets.boring,
    ...myConnector,
    viewCount: 103,
    connectorOfflineSinceOrLastUpdatedAt: subDays(new Date(), 3),
    updatedAt: subMinutes(new Date(), 5),
    createdAt: subDays(new Date(), 7),
    connectorOnlineStatus: 'DEAD',
    contractOffers: [
      {
        contractOfferId: 'contract-offer-1',
        updatedAt: subMinutes(new Date(), 5),
        createdAt: subDays(new Date(), 7),
        contractPolicy: TestPolicies.warnings,
      },
    ],
  },
  {
    assetId: TestAssets.short.assetId,
    assetTitle: TestAssets.short.title,
    asset: TestAssets.short,
    ...myConnector,
    viewCount: 33,
    connectorOfflineSinceOrLastUpdatedAt: subDays(new Date(), 3),
    updatedAt: subMinutes(new Date(), 5),
    createdAt: subDays(new Date(), 7),
    connectorOnlineStatus: 'DEAD',
    contractOffers: [
      {
        contractOfferId: 'contract-offer-1',
        updatedAt: subMinutes(new Date(), 5),
        createdAt: subDays(new Date(), 7),
        contractPolicy: TestPolicies.warnings,
      },
    ],
  },
];

export const getCatalogPage = (
  query: CatalogPageQuery,
  environmentId: string,
): CatalogPageResult => {
  const dataOffers: CatalogDataOffer[] =
    environmentId === 'development'
      ? DATA_OFFERS.map(buildCatalogDataOffer)
      : [];

  return {
    dataOffers,
    availableFilters: {
      fields: [
        {
          id: 'example-filter',
          title: 'Example Filter',
          displayType: 'TITLE_ONLY',
          values: [
            {id: 'example-value', title: 'Example Value'},
            {id: 'other-value', title: 'Other Value'},
            {id: '', title: ''},
          ],
        },
        {
          id: 'other-filter',
          title: 'Other Filter',
          displayType: 'TITLE_ONLY',
          values: [
            {id: 'example-value', title: 'Example Value'},
            {id: 'other-value', title: 'Other Value'},
            {id: '', title: ''},
          ],
        },
        {
          id: 'organization',
          title: 'Organization',
          displayType: 'ID_AND_TITLE',
          values: [
            {
              id: 'MDSL1111AA',
              title: 'Example Organization',
            },
            {
              id: 'MDSL2222BB',
              title: 'Other Organization',
            },
            {
              id: '',
              title: '',
            },
          ],
        },
      ],
    },
    paginationMetadata: {
      pageSize: 20,
      numVisible: dataOffers.length,
      pageOneBased: 0,
      numTotal: dataOffers.length,
    },
    availableSortings: [
      {sorting: 'TITLE', title: 'Test Sorting'},
      {sorting: 'MOST_RECENT', title: 'Other Sorting'},
    ],
  };
};

export const getDataOfferDetailPage = (
  query: DataOfferDetailPageQuery,
  environmentId: string,
): DataOfferDetailPageResult | null => {
  if (environmentId !== 'development') {
    return null;
  }
  return DATA_OFFERS.find(
    (it) =>
      it.connectorId === query.connectorId && it.assetId === query.assetId,
  )!;
};

const buildCatalogDataOffer = (
  it: DataOfferDetailPageResult,
): CatalogDataOffer => ({
  assetId: it.assetId,
  assetTitle: it.asset.title,
  assetDataSourceAvailability: it.asset.dataSourceAvailability,
  descriptionShortText: it.asset.descriptionShortText,
  keywords: it.asset.keywords ?? [],
  version: it.asset.version,
  connectorId: it.connectorId,
  organizationId: it.organizationId,
  organizationName: it.organizationName,
  connectorOfflineSinceOrLastUpdatedAt: it.connectorOfflineSinceOrLastUpdatedAt,
  connectorOnlineStatus: it.connectorOnlineStatus,
});
