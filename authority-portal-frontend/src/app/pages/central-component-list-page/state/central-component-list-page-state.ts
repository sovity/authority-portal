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

import {CentralComponentDto} from '@sovity.de/authority-portal-client';
import {Fetched} from 'src/app/core/utils/fetched';

export interface CentralComponentListPageState {
  centralComponents: Fetched<CentralComponentDto[]>;

  busy: boolean;
  busyDeletingComponentId: string | null;
}

export const DEFAULT_CENTRAL_COMPONENT_LIST_PAGE_STATE: CentralComponentListPageState =
  {
    centralComponents: Fetched.empty(),
    busy: false,
    busyDeletingComponentId: null,
  };
