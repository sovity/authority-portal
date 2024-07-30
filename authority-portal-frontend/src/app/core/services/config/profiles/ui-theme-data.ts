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
import {UiThemeConfig} from './ui-theme-config';

export const SOVITY_THEME: UiThemeConfig = {
  theme: 'theme-sovity',
  brandFaviconSrc: 'assets/images/sovity_logo_light_no_text.svg',
  brandLogoSrc: 'assets/images/sovity_logo_light.svg',
  brandLogoSmallSrc: '/assets/images/sovity_logo_light_no_text.svg',
  brandLogoStyle: 'scale-125',
  brandLogoSmallStyle: 'scale-[0.7]',
  copyrightCompanyName: 'sovity GmbH',
};

export const MDS_THEME: UiThemeConfig = {
  theme: 'theme-mds',
  brandFaviconSrc: 'assets/images/logo_light.svg',
  brandLogoSrc: 'assets/images/mds_logo_yellow.svg',
  brandLogoSmallSrc: '/assets/images/mds_logo_no_text.svg',
  brandLogoStyle: 'scale-100',
  brandLogoSmallStyle: 'scale-[0.7]',
  copyrightCompanyName: 'DRM Datenraum Mobilität GmbH',
};
