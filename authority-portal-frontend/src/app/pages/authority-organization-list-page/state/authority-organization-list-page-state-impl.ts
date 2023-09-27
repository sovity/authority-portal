import {Injectable, NgZone} from '@angular/core';
import {Observable} from 'rxjs';
import {ignoreElements, map, tap} from 'rxjs/operators';
import {Action, State, StateContext} from '@ngxs/store';
import {OrganizationOverviewEntryDto} from '@sovity.de/authority-portal-client';
import {ApiService} from '../../../core/api/api.service';
import {Fetched} from '../../../core/utils/fetched';
import {RefreshOrganizations} from './authority-organization-list-page-actions';
import {
  AuthorityOrganizationListPageState,
  DEFAULT_AUTHORITY_ORGANIZATION_LIST_PAGE_STATE,
} from './authority-organization-list-page-state';

@State<AuthorityOrganizationListPageState>({
  name: 'AuthorityOrganizationListPageState',
  defaults: DEFAULT_AUTHORITY_ORGANIZATION_LIST_PAGE_STATE,
})
@Injectable()
export class AuthorityOrganizationListPageStateImpl {
  constructor(private apiService: ApiService) {}

  @Action(RefreshOrganizations, {cancelUncompleted: true})
  onRefreshOrganizations(
    ctx: StateContext<AuthorityOrganizationListPageState>,
  ): Observable<never> {
    return this.apiService.getOrganizations().pipe(
      map((result) => result.organizations),
      Fetched.wrap({failureMessage: 'Failed loading organizations'}),
      tap((organizations) => this.onOrganizationsRefreshed(ctx, organizations)),
      ignoreElements(),
    );
  }

  private onOrganizationsRefreshed(
    ctx: StateContext<AuthorityOrganizationListPageState>,
    newOrganizations: Fetched<OrganizationOverviewEntryDto[]>,
  ) {
    ctx.patchState({organizations: newOrganizations});
  }
}
