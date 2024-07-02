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
 * Remove item once from list.
 *
 * Use this over .filter(...) to remove items on user interactions
 * to prevent one click from removing many items.
 *
 * Returns copy.
 */
export function removeOnce<T>(list: T[], item: T): T[] {
  const index = list.indexOf(item);
  if (index >= 0) {
    const copy = [...list];
    copy.splice(index, 1);
    return copy;
  }
  return list;
}
