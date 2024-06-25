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
        contractPolicy: TestPolicies.warnings,
      },
    ],
  },
  {
    assetId: TestAssets.withSuffix(TestAssets.boring, '2').assetId,
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
    assetId: TestAssets.boring.assetId,
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
          values: [
            {id: 'example-value', title: 'Example Value'},
            {id: 'other-value', title: 'Other Value'},
            {id: '', title: ''},
          ],
        },
        {
          id: 'other-filter',
          title: 'Other Filter',
          values: [
            {id: 'example-value', title: 'Example Value'},
            {id: 'other-value', title: 'Other Value'},
            {id: '', title: ''},
          ],
        },
        {
          id: 'connectorEndpoint',
          title: 'Connector',
          values: [
            {
              id: 'https://example-connector/api/dsp',
              title: 'https://example-connector/api/dsp',
            },
            {
              id: 'https://example-connector2/api/dsp',
              title: 'https://example-connector2/api/dsp',
            },
          ],
        },
        {
          id: 'curatorMdsId',
          title: 'MDS ID',
          values: [
            {
              id: 'MDSL1111AA',
              title: 'MDSL1111AA',
            },
            {
              id: 'MDSL2222BB',
              title: 'MDSL2222BB',
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
  descriptionShortText: it.asset.descriptionShortText,
  keywords: it.asset.keywords ?? [],
  version: it.asset.version,
  connectorId: it.connectorId,
  organizationId: it.organizationId,
  organizationName: it.organizationName,
  connectorOfflineSinceOrLastUpdatedAt: it.connectorOfflineSinceOrLastUpdatedAt,
  connectorOnlineStatus: it.connectorOnlineStatus,
});
