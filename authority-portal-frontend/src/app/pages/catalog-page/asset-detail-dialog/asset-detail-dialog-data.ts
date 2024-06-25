import {DataOfferDetailPageResult} from '@sovity.de/authority-portal-client';
import {PropertyGridGroup} from '../property-grid-group/property-grid-group';

export interface AssetDetailDialogData {
  propertyGridGroups: PropertyGridGroup[];
  dataOffer: DataOfferDetailPageResult;
}
