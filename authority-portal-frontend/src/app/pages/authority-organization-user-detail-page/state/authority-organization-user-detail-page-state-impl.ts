import {Injectable} from '@angular/core';
import {EMPTY, Observable} from 'rxjs';
import {ignoreElements, tap} from 'rxjs/operators';
import {Action, State, StateContext} from '@ngxs/store';
import {ApiService} from '../../../core/api/api.service';
import {Fetched} from '../../../core/utils/fetched';
import {
  RefreshOrganizationUser,
  SetOrganizationUserId,
} from './authority-organization-user-detail-page-actions';
import {
  AuthorityOrganizationUserDetailPageState,
  DEFAULT_AUTHORITY_ORGANIZATION_USER_DETAIL_PAGE_STATE,
} from './authority-organization-user-detail-page-state';

@State<AuthorityOrganizationUserDetailPageState>({
  name: 'AuthorityOrganizationUserDetailPageState',
  defaults: DEFAULT_AUTHORITY_ORGANIZATION_USER_DETAIL_PAGE_STATE,
})
@Injectable()
export class AuthorityOrganizationUserDetailPageStateImpl {
  constructor(private apiService: ApiService) {}

  @Action(SetOrganizationUserId)
  onSetOrganizationMdsId(
    ctx: StateContext<AuthorityOrganizationUserDetailPageState>,
    action: SetOrganizationUserId,
  ): Observable<never> {
    ctx.patchState({
      organizationMdsId: action.organizationMdsId,
      userId: action.userId,
    });
    return EMPTY;
  }

  @Action(RefreshOrganizationUser, {cancelUncompleted: true})
  onRefreshOrganization(
    ctx: StateContext<AuthorityOrganizationUserDetailPageState>,
  ): Observable<never> {
    return this.apiService.getOrganizationUser(ctx.getState().userId).pipe(
      Fetched.wrap({failureMessage: 'Failed loading user'}),
      tap((user) => this.organizationUserRefreshed(ctx, user)),
      ignoreElements(),
    );
  }

  private organizationUserRefreshed(
    ctx: StateContext<AuthorityOrganizationUserDetailPageState>,
    user: Fetched<any>,
  ) {
    ctx.patchState({user});
  }
}
