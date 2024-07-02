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

/**
 * Group items by key extractor
 * @param array items
 * @param keyExtractor key extractor
 */
export function groupedBy<T, K>(
  array: T[],
  keyExtractor: (it: T) => K,
): Map<K, T[]> {
  const map = new Map<K, T[]>();
  array.forEach((it) => {
    const key = keyExtractor(it);
    if (!map.has(key)) {
      map.set(key, []);
    }
    map.get(key)!.push(it);
  });
  return map;
}

/**
 * Create Map with entries [keyExtractor(it), it]
 * @param array items
 * @param keyExtractor key extractor
 */
export function associateBy<T, K>(
  array: T[],
  keyExtractor: (it: T) => K,
): Map<K, T> {
  return new Map(array.map((it) => [keyExtractor(it), it]));
}
