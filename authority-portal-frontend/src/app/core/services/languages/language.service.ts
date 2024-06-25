import {Injectable} from '@angular/core';
import {LANGUAGE_DATA, LanguageInfo} from './language-data';

/**
 * Access list of available LanguageSelectItems
 */
@Injectable({providedIn: 'root'})
export class LanguageService {
  itemsByKeyword: Map<string, LanguageInfo>;
  keywords = (it: LanguageInfo) => [it.id, it.idShort, it.sameAs];

  constructor() {
    this.itemsByKeyword = this.buildItemLookupMap();
  }

  /**
   * Find LanguageSelectItem by id
   * @param id idShort or sameAs
   */
  findLabel(id: string): string {
    let item = this.itemsByKeyword.get(id);
    if (item) {
      return item.label;
    }

    return id;
  }

  private buildItemLookupMap(): Map<string, LanguageInfo> {
    const map = new Map<string, LanguageInfo>();
    LANGUAGE_DATA.forEach((info) => {
      this.keywords(info)
        .filter((key) => !!key)
        .forEach((key) => map.set(key!!, info));
    });
    return map;
  }
}
