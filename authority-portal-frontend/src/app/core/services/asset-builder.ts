import {Injectable} from '@angular/core';
import {UiAsset} from '@sovity.de/authority-portal-client';
import {AdditionalAssetProperty, UiAssetMapped} from './models/ui-asset-mapped';
import {
  LanguageSelectItemService
} from "../../pages/catalog-ui/asset-page/language-select/language-select-item.service";
import {LanguageSelectItem} from "../../pages/catalog-ui/asset-page/language-select/language-select-item";

/**
 * Maps between EDC Asset and our type safe asset
 */
@Injectable({
  providedIn: 'root',
})
export class AssetBuilder {
  constructor(
    private languageSelectItemService: LanguageSelectItemService,
  ) {}

  buildAsset(asset: UiAsset): UiAssetMapped {
    const {
      customJsonAsString,
      customJsonLdAsString,
      privateCustomJsonAsString,
      privateCustomJsonLdAsString,
      language,
      ...assetProperties
    } = asset;
    return {
      ...assetProperties,
      language: this.getLanguageItem(language),
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
