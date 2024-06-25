import {Injectable} from '@angular/core';
import {AdditionalAssetProperty, UiAssetMapped} from '../api/ui-asset-mapped';
import {UiAsset} from "@sovity.de/authority-portal-client";
import {LanguageSelectItemService} from "../../catalog-component-library/language-select/language-select-item.service";
import {
  TransportModeSelectItemService
} from "../../catalog-component-library/transport-mode-select/transport-mode-select-item.service";
import {
  DataCategorySelectItemService
} from "../../catalog-component-library/data-category-select/data-category-select-item.service";
import {
  DataSubcategorySelectItemService
} from "../../catalog-component-library/data-subcategory-select/data-subcategory-select-item.service";
import {
  TransportModeSelectItem
} from "../../catalog-component-library/transport-mode-select/transport-mode-select-item";
import {
  DataSubcategorySelectItem
} from "../../catalog-component-library/data-subcategory-select/data-subcategory-select-item";
import {DataCategorySelectItem} from "../../catalog-component-library/data-category-select/data-category-select-item";
import {LanguageSelectItem} from "../../catalog-component-library/language-select/language-select-item";

/**
 * Maps between EDC Asset and our type safe asset
 */
@Injectable({
  providedIn: 'root',
})
export class AssetBuilder {
  constructor(
    private languageSelectItemService: LanguageSelectItemService,
    private transportModeSelectItemService: TransportModeSelectItemService,
    private dataCategorySelectItemService: DataCategorySelectItemService,
    private dataSubcategorySelectItemService: DataSubcategorySelectItemService,
  ) {}

  buildAsset(asset: UiAsset): UiAssetMapped {
    const {
      customJsonAsString,
      customJsonLdAsString,
      privateCustomJsonAsString,
      privateCustomJsonLdAsString,
      language,
      dataCategory,
      dataSubcategory,
      transportMode,
      ...assetProperties
    } = asset;
    return {
      ...assetProperties,
      language: this.getLanguageItem(language),
      dataCategory: this.getDataCategoryItem(dataCategory),
      dataSubcategory: this.getDataSubcategoryItem(dataSubcategory),
      transportMode: this.getTransportModeItem(transportMode),
      customJsonProperties: this.buildAdditionalProperties(customJsonAsString),
      customJsonLdProperties:
        this.buildAdditionalProperties(customJsonLdAsString),
      privateCustomJsonProperties: this.buildAdditionalProperties(
        privateCustomJsonAsString,
      ),
      privateCustomJsonLdProperties: this.buildAdditionalProperties(
        privateCustomJsonLdAsString,
      ),
    };
  }

  private getTransportModeItem(
    transportMode: string | undefined,
  ): TransportModeSelectItem | null {
    return transportMode == null
      ? null
      : this.transportModeSelectItemService.findById(transportMode);
  }

  private getDataSubcategoryItem(
    dataSubcategory: string | undefined,
  ): DataSubcategorySelectItem | null {
    return dataSubcategory == null
      ? null
      : this.dataSubcategorySelectItemService.findById(dataSubcategory);
  }

  private getDataCategoryItem(
    dataCategory: string | undefined,
  ): DataCategorySelectItem | null {
    return dataCategory == null
      ? null
      : this.dataCategorySelectItemService.findById(dataCategory);
  }

  private getLanguageItem(
    language: string | undefined,
  ): LanguageSelectItem | null {
    return language == null
      ? null
      : this.languageSelectItemService.findById(language);
  }

  private buildAdditionalProperties(
    json: string | undefined,
  ): AdditionalAssetProperty[] {
    const obj = this.tryParseJsonObj(json || '{}');
    return Object.entries(obj).map(
      ([key, value]): AdditionalAssetProperty => ({
        key: `${key}`,
        value:
          typeof value === 'object'
            ? JSON.stringify(value, null, 2)
            : `${value}`,
      }),
    );
  }

  private tryParseJsonObj(json: string): any {
    const bad = {'Conversion Failure': `Bad JSON: ${json}`};

    try {
      const parsed = JSON.parse(json);
      if (parsed == null) {
        return {};
      } else if (typeof parsed === 'object') {
        return parsed;
      }
    } catch (e) {}

    return bad;
  }
}
