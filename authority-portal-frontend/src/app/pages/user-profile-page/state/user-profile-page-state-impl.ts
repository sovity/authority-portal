import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {ignoreElements, tap} from 'rxjs/operators';
import {Action, State, StateContext} from '@ngxs/store';
import {ApiService} from '../../../core/api/api.service';
import {Fetched} from '../../../core/utils/fetched';
import {RefreshUserProfile} from './user-profile-page-actions';
import {
  DEFAULT_USER_PROFILE_PAGE_STATE,
  UserProfilePageState,
} from './user-profile-page-state';

@State<UserProfilePageState>({
  name: 'UserProfilePageState',
  defaults: DEFAULT_USER_PROFILE_PAGE_STATE,
})
@Injectable()
export class UserProfilePageStateImpl {
  constructor(private apiService: ApiService) {}

  @Action(RefreshUserProfile, {cancelUncompleted: true})
  onRefreshUserProfile(
    ctx: StateContext<UserProfilePageState>,
    action: RefreshUserProfile,
  ): Observable<never> {
    return this.apiService.getUserDetailDto(action.userId).pipe(
      Fetched.wrap({failureMessage: 'Failed loading user'}),
      tap((user) =>
        this.UserProfileRefreshed(ctx, user, ctx.getState().userId),
      ),
      ignoreElements(),
    );
  }

  private UserProfileRefreshed(
    ctx: StateContext<UserProfilePageState>,
    user: Fetched<any>,
    userId: string,
  ) {
    ctx.patchState({userId, user});
  }
}
