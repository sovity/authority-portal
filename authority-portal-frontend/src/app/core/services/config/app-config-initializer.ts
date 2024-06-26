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
import {Provider} from '@angular/core';
import {APP_CONFIG, AppConfig, buildAppConfig} from './app-config';

/**
 * The config is fetched before the angular project starts.
 */
let appConfig: AppConfig | null;

export const provideAppConfig = (): Provider => ({
  provide: APP_CONFIG,
  useFactory: () => appConfig,
});

export async function loadConfig() {
  return fetch('/assets/config/app-config.json')
    .then((response) => response.json())
    .then(buildAppConfig)
    .then((config) => {
      appConfig = config;
    });
}
