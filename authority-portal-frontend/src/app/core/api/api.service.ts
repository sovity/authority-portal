import {Injectable} from '@angular/core';
import {Observable, delay, from, of} from 'rxjs';
import {
  CreateOrganizationRequest,
  UiApi,
  UserApprovalPageResult,
  UserInfo,
} from '@sovity.de/authority-portal-client';
import {OrganizationListEntry} from '../../pages/organization-list-page/state/organization-list-page-state';
import {ApiClientFactory} from './api-client-factory';

@Injectable()
export class ApiService {
  constructor(private apiClientFactory: ApiClientFactory) {}

  userProfile(): Observable<UserInfo> {
    return from(this.api().userInfo());
  }

  createOrganization(
    createOrganizationRequest: CreateOrganizationRequest,
  ): Observable<string> {
    return from(this.api().createOrganization({createOrganizationRequest}));
  }

  getOrganizations(): Observable<OrganizationListEntry[]> {
    // TODO: Add this endpoint to UIResource so we can start working with the fake backend
    return of([{id: 'example-data'}]).pipe(delay(1000));
  }

  userApprovalPage(): Observable<UserApprovalPageResult> {
    return from(this.api().userApprovalPage());
  }

  private api(): UiApi {
    return this.apiClientFactory.newAuthorityPortalClient().uiApi;
  }
}
