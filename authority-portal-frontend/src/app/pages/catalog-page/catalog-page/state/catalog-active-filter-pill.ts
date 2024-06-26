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
import { FilterBoxItem } from '../../filter-box/filter-box-item';


export interface CatalogActiveFilterPill {
  type: 'SEARCH_TEXT' | 'SELECTED_FILTER_ITEM';
  label: string;
  value: string;

  selectedFilterId?: string;
  selectedFilterItem?: FilterBoxItem;
}
