import {InjectionToken} from '@angular/core';

export const APP_CONFIG = new InjectionToken<AppConfig>('APP_CONFIG');

/**
 * App Config
 *
 * Contains environment-dependant config values.
 *
 * Values can be overridden via environment variables
 */
export interface AppConfig {
  backendUrl: string;
}

/**
 * Available Environment Variables
 *
 * Must be prefixed AUTHORITY_PORTAL_FRONTEND
 */
export interface AppConfigEnv {
  AUTHORITY_PORTAL_FRONTEND_BACKEND_URL: string;
}

/**
 * Build {@link AppConfig} from env vars
 * @param envVars env vars as gotten from /assets/config/config.json
 */
export function buildAppConfig(envVars: AppConfigEnv): AppConfig {
  return {
    backendUrl: envVars.AUTHORITY_PORTAL_FRONTEND_BACKEND_URL,
  };
}
