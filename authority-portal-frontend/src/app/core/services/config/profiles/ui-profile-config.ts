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
import {AppConfig} from '../app-config';
import {UiThemeConfig} from './ui-theme-config';

export type UiProfileConfig = Pick<AppConfig, 'features'> & UiThemeConfig;
