import {Injectable, NgZone} from '@angular/core';
import {Observable} from 'rxjs';
import {ignoreElements, tap} from 'rxjs/operators';
import {Action, State, StateContext} from '@ngxs/store';
import {ApiService} from '../../../core/api/api.service';
import {Fetched} from '../../../core/utils/fetched';
import {RefreshOrganizations} from './organization-list-page-actions';
import {
  DEFAULT_ORGANIZATION_LIST_PAGE_STATE,
  OrganizationListEntry,
  OrganizationListPageState,
} from './organization-list-page-state';

@State<OrganizationListPageState>({
  name: 'OrganizationListPageState',
  defaults: DEFAULT_ORGANIZATION_LIST_PAGE_STATE,
})
@Injectable()
export class OrganizationListPageStateImpl {
  constructor(private ngZone: NgZone, private apiService: ApiService) {}

  @Action(RefreshOrganizations, {cancelUncompleted: true})
  onRefreshOrganizations(
    ctx: StateContext<OrganizationListPageState>,
  ): Observable<never> {
    return this.apiService.getOrganizations().pipe(
      Fetched.wrap({failureMessage: 'Failed loading organizations'}),
      tap((organizations) => this.onOrganizationsRefreshed(ctx, organizations)),
      ignoreElements(),
    );
  }

  private onOrganizationsRefreshed(
    ctx: StateContext<OrganizationListPageState>,
    newOrganizations: Fetched<OrganizationListEntry[]>,
  ) {
    ctx.patchState({organizations: newOrganizations});
  }
}
