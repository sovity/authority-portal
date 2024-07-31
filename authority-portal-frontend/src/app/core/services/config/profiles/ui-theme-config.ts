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

/**
 * Type-Safe and interpreted App Config
 */
export type UiThemeConfig = Pick<
  AppConfig,
  | 'theme'
  | 'brandLogoStyle'
  | 'brandLogoSmallStyle'
  | 'brandLogoSrc'
  | 'brandLogoSmallSrc'
  | 'brandFaviconSrc'
  | 'connectorSelfOwnedIconSrc'
  | 'connectorSelfOwnedIconStyle'
  | 'connectorCaasIconSrc'
  | 'connectorCaasIconStyle'
  | 'caasResellerBrandLogoSrc'
  | 'caasResellerBrandLogoStyle'
  | 'copyrightCompanyName'
>;
