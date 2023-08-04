import {Injectable} from '@angular/core';
import {Observable, from} from 'rxjs';
import {
  AuthorityPortalClient,
  ExamplePageQuery,
  ExamplePageResult,
  buildAuthorityPortalClient,
} from '@sovity.de/authority-portal-client';

@Injectable({providedIn: 'root'})
export class ApiService {
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
      backendUrl: 'http://localhost:8080',
    });
  }
}
