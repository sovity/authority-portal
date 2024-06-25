import {Injectable} from '@angular/core';
import {DataOfferDetailPageResult} from '@sovity.de/authority-portal-client';
import {AssetDetailDialogData} from './asset-detail-dialog-data';
import {AssetPropertyGridGroupBuilder} from './asset-property-grid-group-builder';

@Injectable()
export class AssetDetailDialogDataService {
  constructor(
    private assetPropertyGridGroupBuilder: AssetPropertyGridGroupBuilder,
  ) {}

  dataOfferDetailPage(
    dataOffer: DataOfferDetailPageResult,
  ): AssetDetailDialogData {
    const propertyGridGroups = [
      this.assetPropertyGridGroupBuilder.buildDataOfferGroup(dataOffer),
      this.assetPropertyGridGroupBuilder.buildAssetPropertiesGroup(
        dataOffer,
        'Asset',
      ),
      ...this.assetPropertyGridGroupBuilder.buildAdditionalPropertiesGroups(
        dataOffer,
      ),
      ...dataOffer.contractOffers.map((contractOffer, i) =>
        this.assetPropertyGridGroupBuilder.buildContractOfferGroup(
          dataOffer,
          contractOffer,
          i,
          dataOffer.contractOffers.length,
        ),
      ),
    ].filter((it) => it.properties.length);

    return {
      dataOffer,
      propertyGridGroups,
    };
  }
}
