import {Injectable} from '@angular/core';
import {AssetDetailDialogData,} from './asset-detail-dialog-data';
import {AssetPropertyGridGroupBuilder} from './asset-property-grid-group-builder';
import {CatalogDataOfferMapped} from "../../../pages/catalog-page/catalog-page/mapping/catalog-page-result-mapped";

@Injectable()
export class AssetDetailDialogDataService {
  constructor(
    private assetPropertyGridGroupBuilder: AssetPropertyGridGroupBuilder,
  ) {}

  brokerDataOfferDetails(
    dataOffer: CatalogDataOfferMapped,
  ): AssetDetailDialogData {
    const asset = dataOffer.asset;

    const propertyGridGroups = [
      this.assetPropertyGridGroupBuilder.buildBrokerDataOfferGroup(dataOffer),
      this.assetPropertyGridGroupBuilder.buildAssetPropertiesGroup(
        asset,
        'Asset',
      ),
      ...this.assetPropertyGridGroupBuilder.buildAdditionalPropertiesGroups(
        asset,
      ),
      ...dataOffer.contractOffers.map((contractOffer, i) =>
        this.assetPropertyGridGroupBuilder.buildBrokerContractOfferGroup(
          asset,
          contractOffer,
          i,
          dataOffer.contractOffers.length,
        ),
      ),
    ].filter((it) => it.properties.length);

    return {
      asset: dataOffer.asset,
      dataOffer: dataOffer,
      propertyGridGroups,
    };
  }
}
