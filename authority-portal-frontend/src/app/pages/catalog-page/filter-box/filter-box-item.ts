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
import {CnfFilterItem} from '@sovity.de/authority-portal-client';

export interface FilterBoxItem {
  type: 'ITEM' | 'NO_VALUE';
  id: string;
  label: string;
}

export function buildFilterBoxItems(items: CnfFilterItem[]): FilterBoxItem[] {
  return items.map(buildFilterBoxItem);
}

function buildFilterBoxItem(item: CnfFilterItem): FilterBoxItem {
  return {
    type: item.id === '' ? 'NO_VALUE' : 'ITEM',
    id: item.id,
    label: item.id === '' ? 'None' : item.title,
  };
}
