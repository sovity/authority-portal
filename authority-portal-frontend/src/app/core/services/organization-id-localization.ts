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
import {Inject, Injectable} from '@angular/core';
import {APP_CONFIG, AppConfig} from './config/app-config';

@Injectable({providedIn: 'root'})
export class OrganizationIdLocalization {
  private mds = this.config.features.has('mds-id');
  organizationId = this.mds ? 'MDS ID' : 'Organization ID';
  organizationIdPlural = this.organizationId + 's';
  organizationIdPlaceholder = this.mds ? 'MDSL1234XX' : 'BPNL1234XX';

  constructor(@Inject(APP_CONFIG) private config: AppConfig) {}
}
