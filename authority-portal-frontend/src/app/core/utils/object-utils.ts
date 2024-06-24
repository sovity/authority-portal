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

export type Patcher<T> = (value: T) => Partial<T>;

export function patchObj<T>(obj: T, patcher: Patcher<T>): T {
  return {...obj, ...patcher(obj)};
}

/**
 * Create Object with entries [keyExtractor(it), valueExtractor(it)]
 * @param array items
 * @param keyExtractor key extractor
 * @param valueExtractor value extractor
 */
export function associateAsObj<T, K extends string | number, R>(
  array: T[],
  keyExtractor: (it: T) => K,
  valueExtractor: (it: T) => R,
): Record<K, R> {
  return Object.fromEntries(
    array.map((it) => [keyExtractor(it), valueExtractor(it)]),
  ) as Record<K, R>;
}
