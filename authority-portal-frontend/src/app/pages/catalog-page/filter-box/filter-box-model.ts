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
import {CnfFilterAttribute} from '@sovity.de/authority-portal-client';
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
    selectedItems: old?.selectedItems ?? [],
  };
}
