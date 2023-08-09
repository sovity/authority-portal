import {Inject, Injectable} from '@angular/core';
import {Observable, from} from 'rxjs';
import {
  AuthorityPortalClient,
  ExamplePageQuery,
  ExamplePageResult,
  buildAuthorityPortalClient,
} from '@sovity.de/authority-portal-client';
import {APP_CONFIG, AppConfig} from './config/app-config';

@Injectable()
export class ApiService {
  constructor(@Inject(APP_CONFIG) private appConfig: AppConfig) {}

  examplePage(
    examplePageQuery: ExamplePageQuery,
  ): Observable<ExamplePageResult> {
    return from(this.getClient().uiApi.examplePage({examplePageQuery}));
  }

  exampleDbQuery(): Observable<string[]> {
    return from(this.getClient().uiApi.exampleDbQuery());
  }

  private getClient(): AuthorityPortalClient {
    return buildAuthorityPortalClient({
      backendUrl: this.appConfig.backendUrl,
    });
  }
}
