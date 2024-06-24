import {UiAsset} from '@sovity.de/authority-portal-client';
import {LanguageSelectItem} from "../../../pages/catalog-ui/asset-page/language-select/language-select-item";

/**
 * UiAsset with replaced fixed vocabulary items.
 *
 * This exists, because certain metadata has labels which are added in the UI, e.g. language.
 */
export type UiAssetMapped = Omit<UiAsset, 'language'> & {
  connectorEndpoint: string;

  language: LanguageSelectItem | null;

  // Unhandled Additional Properties
  customJsonProperties: AdditionalAssetProperty[];
  customJsonLdProperties: AdditionalAssetProperty[];
  privateCustomJsonProperties: AdditionalAssetProperty[];
  privateCustomJsonLdProperties: AdditionalAssetProperty[];
};

export interface AdditionalAssetProperty {
  key: string;
  value: string;
}
