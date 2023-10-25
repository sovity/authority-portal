import {Injectable} from '@angular/core';
import {EMPTY, Observable} from 'rxjs';
import {ignoreElements, tap} from 'rxjs/operators';
import {Action, State, StateContext} from '@ngxs/store';
import {ApiService} from '../../../core/api/api.service';
import {Fetched} from '../../../core/utils/fetched';
import {
  DEFAULT_PARTICIPANT_USER_DETAIL_PAGE_STATE,
  ParticipantUserDetailPageState,
} from './participant-user-detail-page-state';
import {
  RefreshOrganizationUser,
  SetOrganizationUserId,
} from './particpant-user-detail-page-actions';

@State<ParticipantUserDetailPageState>({
  name: 'ParticipantUserDetailPageState',
  defaults: DEFAULT_PARTICIPANT_USER_DETAIL_PAGE_STATE,
})
@Injectable()
export class ParticipantUserDetailPageStateImpl {
  constructor(private apiService: ApiService) {}

  @Action(SetOrganizationUserId)
  onSetOrganizationMdsId(
    ctx: StateContext<ParticipantUserDetailPageState>,
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
    ctx: StateContext<ParticipantUserDetailPageState>,
  ): Observable<never> {
    return this.apiService.getOrganizationUser(ctx.getState().userId).pipe(
      Fetched.wrap({failureMessage: 'Failed loading user'}),
      tap((user) =>
        this.organizationUserRefreshed(
          ctx,
          user,
          ctx.getState().organizationMdsId,
          ctx.getState().userId,
        ),
      ),
      ignoreElements(),
    );
  }

  private organizationUserRefreshed(
    ctx: StateContext<ParticipantUserDetailPageState>,
    user: Fetched<any>,
    organizationMdsId: string,
    userId: string,
  ) {
    ctx.patchState({organizationMdsId, userId, user});
  }
}
