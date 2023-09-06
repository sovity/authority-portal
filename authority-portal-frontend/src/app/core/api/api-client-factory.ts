import {Inject, Injectable} from '@angular/core';
import {
  AuthorityPortalClient,
  buildAuthorityPortalClient,
} from '@sovity.de/authority-portal-client';
import {APP_CONFIG, AppConfig} from '../config/app-config';
import {AUTHORITY_PORTAL_FAKE_BACKEND} from './fake-backend/fake-backend';

@Injectable()
export class ApiClientFactory {
  constructor(@Inject(APP_CONFIG) private appConfig: AppConfig) {}

  newAuthorityPortalClient(): AuthorityPortalClient {
    return buildAuthorityPortalClient({
      backendUrl: this.appConfig.backendUrl,
      configOverrides: {
        // Required for Local Dev with Fake Backend
        fetchApi: this.appConfig.useFakeBackend
          ? AUTHORITY_PORTAL_FAKE_BACKEND
          : undefined,

        // Required for Local E2E Dev with Quarkus Backend
        headers: this.buildHeaders(),
      },
    });
  }

  private buildHeaders(): Record<string, string> {
    if (!this.appConfig.localDevBasicAuth) {
      return {};
    }

    // Local Dev Only: Add Basic Auth Header
    const credentials = [
      this.appConfig.localDevBasicAuth.user,
      this.appConfig.localDevBasicAuth.password,
    ].join(':');

    return {
      Authorization: `Basic ${btoa(credentials)}`,
    };
  }
}
