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
import {InjectionToken} from '@angular/core';
import {getProfileOrFallback} from './profiles/get-profile-or-fallback';
import {UiColorTheme} from './profiles/ui-color-theme';
import {UiFeature} from './profiles/ui-feature';
import {UiProfile} from './profiles/ui-profile';

export const APP_CONFIG = new InjectionToken<AppConfig>('APP_CONFIG');
/**
 * App Config
 *
 * Contains environment-dependant config values.
 *
 * Values can be overridden via environment variables
 */
export interface AppConfig {
  // selected profile
  profile: UiProfile;
  features: Set<UiFeature>;

  // theme by profile
  theme: UiColorTheme;
  brandFaviconSrc: string;
  brandLogoSrc: string;
  brandLogoSmallSrc: string;
  brandLogoStyle: string;
  brandLogoSmallStyle: string;
  copyrightCompanyName: string;

  // connector registration icons
  connectorSelfOwnedIconSrc: string;
  connectorSelfOwnedIconStyle: string;
  connectorCaasIconSrc: string;
  connectorCaasIconStyle: string;
  caasResellerBrandLogoSrc: string;
  caasResellerBrandLogoStyle: string;

  privacyPolicyUrl: string;
  legalNoticeUrl: string;
  supportUrl: string;
  iframeUrl: string;

  backendUrl: string;
  loginUrl: string;
  logoutUrl: string;
  invalidateSessionCookiesUrl: string;
  useFakeBackend: boolean;
  useLocalBackend: boolean;
  brandShortName: string;
}

/**
 * Available Environment Variables
 *
 * Must be prefixed AUTHORITY_PORTAL_FRONTEND
 */
export interface AppConfigEnv {
  AUTHORITY_PORTAL_FRONTEND_BACKEND_URL: string;
  AUTHORITY_PORTAL_FRONTEND_LOGIN_URL: string;
  AUTHORITY_PORTAL_FRONTEND_LOGOUT_URL: string;
  AUTHORITY_PORTAL_FRONTEND_USE_FAKE_BACKEND: string;
  AUTHORITY_PORTAL_FRONTEND_USE_LOCAL_BACKEND: string;
  AUTHORITY_PORTAL_FRONTEND_INVALIDATE_SESSION_COOKIES_URL: string;
  AUTHORITY_PORTAL_FRONTEND_IFRAME_URL: string;
  AUTHORITY_PORTAL_FRONTEND_PRIVACY_POLICY_URL: string;
  AUTHORITY_PORTAL_FRONTEND_LEGAL_NOTICE_URL: string;
  AUTHORITY_PORTAL_FRONTEND_SUPPORT_URL: string;
  AUTHORITY_PORTAL_FRONTEND_ACTIVE_PROFILE: string;
  AUTHORITY_PORTAL_FRONTEND_BRAND_SHORT_NAME: string;
}

/**
 * Build {@link AppConfig} from env vars
 * @param envVars env vars as gotten from /assets/config/config.json
 */
export function buildAppConfig(envVars: AppConfigEnv): AppConfig {
  const {profile, profileConfig} = getProfileOrFallback(
    envVars.AUTHORITY_PORTAL_FRONTEND_ACTIVE_PROFILE,
  );

  return {
    profile,
    ...profileConfig,

    backendUrl: envVars.AUTHORITY_PORTAL_FRONTEND_BACKEND_URL,
    loginUrl: envVars.AUTHORITY_PORTAL_FRONTEND_LOGIN_URL,
    logoutUrl: envVars.AUTHORITY_PORTAL_FRONTEND_LOGOUT_URL,
    invalidateSessionCookiesUrl:
      envVars.AUTHORITY_PORTAL_FRONTEND_INVALIDATE_SESSION_COOKIES_URL,
    useFakeBackend:
      envVars.AUTHORITY_PORTAL_FRONTEND_USE_FAKE_BACKEND === 'true',
    useLocalBackend:
      envVars.AUTHORITY_PORTAL_FRONTEND_USE_LOCAL_BACKEND === 'true',

    iframeUrl: envVars.AUTHORITY_PORTAL_FRONTEND_IFRAME_URL,
    privacyPolicyUrl: envVars.AUTHORITY_PORTAL_FRONTEND_PRIVACY_POLICY_URL,
    legalNoticeUrl: envVars.AUTHORITY_PORTAL_FRONTEND_LEGAL_NOTICE_URL,
    supportUrl: envVars.AUTHORITY_PORTAL_FRONTEND_SUPPORT_URL,
    brandShortName: envVars.AUTHORITY_PORTAL_FRONTEND_BRAND_SHORT_NAME,
  };
}
