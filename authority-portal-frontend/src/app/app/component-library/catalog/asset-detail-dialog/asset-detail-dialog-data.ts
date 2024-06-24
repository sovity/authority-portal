import {PropertyGridGroup} from '../../property-grid/property-grid-group/property-grid-group';
import {UiAssetMapped} from "../../../core/services/models/ui-asset-mapped";
import {
  CatalogDataOfferMapped
} from "../../../routes/broker-ui/catalog-page/catalog-page/mapping/catalog-page-result-mapped";

export interface AssetDetailDialogData {
  propertyGridGroups: PropertyGridGroup[];
  asset: UiAssetMapped;
  dataOffer: CatalogDataOfferMapped;
}
