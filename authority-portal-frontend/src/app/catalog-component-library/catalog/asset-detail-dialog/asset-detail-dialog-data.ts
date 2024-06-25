import {PropertyGridGroup} from '../../property-grid/property-grid-group/property-grid-group';
import {UiAssetMapped} from "../../../core/api/ui-asset-mapped";
import {CatalogDataOfferMapped} from "../../../pages/catalog-page/catalog-page/mapping/catalog-page-result-mapped";

export interface AssetDetailDialogData {
  propertyGridGroups: PropertyGridGroup[];
  asset: UiAssetMapped;
  dataOffer: CatalogDataOfferMapped;
}
