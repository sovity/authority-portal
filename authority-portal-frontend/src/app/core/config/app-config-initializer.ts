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
