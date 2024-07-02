/*
 * Copyright (c) 2024 sovity GmbH
 *
 * This program and the accompanying materials are made available under the
 * terms of the Apache License, Version 2.0 which is available at
 * https://www.apache.org/licenses/LICENSE-2.0
 *
 * SPDX-License-Identifier: Apache-2.0
 *
 * Contributors:
 *      sovity GmbH - initial implementation
 */

export class LocalStorageUtils {
  saveData<T>(key: string, value: T) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  getData<T>(
    key: string,
    defaultValue: T,
    isValidValue: (value?: unknown) => value is T,
  ): T {
    const data = this.getDataUnsafe(key, defaultValue);
    if (isValidValue(data)) {
      return data;
    }
    return defaultValue;
  }

  private getDataUnsafe(key: string, defaultValue: any): unknown {
    const storedItem = localStorage.getItem(key);

    try {
      return storedItem == null ? defaultValue : JSON.parse(storedItem);
    } catch (e) {
      console.warn('Error parsing local storage value', key, storedItem);
      return defaultValue;
    }
  }

  removeData(key: string) {
    localStorage.removeItem(key);
  }

  clearData() {
    localStorage.clear();
  }
}
