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
import {APP_CONFIG, AppConfig} from './app-config';
import {UiFeature} from './profiles/ui-feature';

@Injectable({providedIn: 'root'})
export class ActiveFeatureSet {
  constructor(@Inject(APP_CONFIG) private config: AppConfig) {}

  usesMdsId(): boolean {
    return this.has('mds-id');
  }

  usesBritishCatalogue(): boolean {
    return this.has('catalogue');
  }

  isHomePageEnabled(): boolean {
    return this.has('enable-home');
  }

  // This is configurable via environment variable, not via theme
  isDashboardEnabled(): boolean {
    return this.config.enableDashboard;
  }

  has(feature: UiFeature): boolean {
    return this.config.features.has(feature);
  }
}
