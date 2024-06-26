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
import { LocalStorageUtils } from './local-storage-utils';


export class LocalStoredValue<T> {
  localStorageUtils = new LocalStorageUtils();
  cachedValue: T;

  constructor(
    defaultValue: T,
    private key: string,
    isValidValue: (value: unknown) => value is T,
  ) {
    this.cachedValue = this.localStorageUtils.getData(
      this.key,
      defaultValue,
      isValidValue,
    );
  }

  get value(): T {
    return this.cachedValue;
  }

  set value(value: T) {
    if (this.cachedValue != value) {
      this.cachedValue = value;
      this.localStorageUtils.saveData(this.key, value);
    }
  }
}
