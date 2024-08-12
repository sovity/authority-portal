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
import {
  CnfFilterAttribute,
  CnfFilterAttributeDisplayType,
} from '@sovity.de/authority-portal-client';
import {FilterBoxItem, buildFilterBoxItems} from './filter-box-item';

/**
 * State of a single Filter
 */
export interface FilterBoxModel {
  id: string;
  title: string;
  selectedItems: FilterBoxItem[];
  availableItems: FilterBoxItem[];
  searchText: string;
  displayType: CnfFilterAttributeDisplayType;
}

export function buildFilterBoxModelWithNewData(
  fetched: CnfFilterAttribute,
  old: FilterBoxModel | null,
): FilterBoxModel {
  const availableItems = buildFilterBoxItems(fetched.values);
  return {
    id: fetched.id,
    title: fetched.title,
    availableItems,
    searchText: old?.searchText ?? '',
    selectedItems: withUpdatedTitles(old?.selectedItems ?? [], availableItems),
    displayType: fetched.displayType,
  };
}

function withUpdatedTitles(
  selectedItems: FilterBoxItem[],
  availableItems: FilterBoxItem[],
): FilterBoxItem[] {
  const fetchedById = new Map<string, FilterBoxItem>(
    availableItems.map((item) => [item.id, item]),
  );

  const isSame = (a: FilterBoxItem, b: FilterBoxItem) => a.label === b.label;

  return selectedItems.map((oldItem) => {
    const newItem = fetchedById.get(oldItem.id);
    if (newItem == null || isSame(newItem, oldItem)) {
      return oldItem;
    }

    return newItem;
  });
}
