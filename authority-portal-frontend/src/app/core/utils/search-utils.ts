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
 * Simple search that tries to find all search query words in target strings of given items
 * @param items item list
 * @param query search query
 * @param targetsFn search targets
 */
export function search<T>(
  items: T[],
  query: string | null,
  targetsFn: (item: T) => (string | null)[],
): T[] {
  const words = (query ?? '')
    .toLowerCase()
    .split(' ')
    .map((it) => it.trim())
    .filter((it) => it);

  return items.filter((item) => {
    const targets = targetsFn(item)
      .map((it) => it?.toLowerCase())
      .filter((it) => it) as string[];
    return words.every((word) => targets.some((value) => value.includes(word)));
  });
}
