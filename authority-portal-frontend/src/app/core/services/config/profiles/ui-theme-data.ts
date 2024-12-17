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
  brandFaviconSrc: 'assets/images/sovity_caas_logo.svg',
  brandLogo: {src: 'assets/images/sovity_logo.svg', class: 'scale-[1.1]'},
  brandLogoSmall: {
    src: '/assets/images/sovity_logo_no_text.svg',
    class: 'scale-[0.6]',
  },
  brandLogoUnauthenticatedPage: {
    src: 'assets/images/sovity_logo.svg',
    class: 'w-[15%] h-[15%]',
  },
  brandLogoOnboardingPage: {
    src: 'assets/images/sovity_logo.svg',
    class: 'w-[10%] h-[10%]',
  },
  connectorSelfOwnedIconSrc:
    'assets/images/sovity_self-hosted-connector_logo.svg',
  connectorCaasIconSrc: 'assets/images/sovity_request-caas_logo.svg',
  caasResellerBrandLogoSrc: 'assets/images/sovity_caas_logo.svg',
  copyrightCompanyName: 'sovity GmbH',
};
