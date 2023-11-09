import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {EMPTY, Observable} from 'rxjs';
import {filter, finalize, ignoreElements, takeUntil, tap} from 'rxjs/operators';
import {Action, Actions, State, StateContext} from '@ngxs/store';
import {ErrorService} from 'src/app/core/error.service';
import {ToastService} from 'src/app/core/toast-notifications/toast.service';
import {ApiService} from '../../../core/api/api.service';
import {Fetched} from '../../../core/utils/fetched';
import {
  DEFAULT_PARTICIPANT_USER_DETAIL_PAGE_STATE,
  ParticipantUserDetailPageState,
} from './participant-user-detail-page-state';
import {
  DeactivateUser,
  ReactivateUser,
  RefreshOrganizationUser,
  SetOrganizationUserId,
} from './particpant-user-detail-page-actions';

@State<ParticipantUserDetailPageState>({
  name: 'ParticipantUserDetailPageState',
  defaults: DEFAULT_PARTICIPANT_USER_DETAIL_PAGE_STATE,
})
@Injectable()
export class ParticipantUserDetailPageStateImpl {
  constructor(
    private apiService: ApiService,
    private actions$: Actions,
    private errorService: ErrorService,
    private toast: ToastService,
    private router: Router,
  ) {}

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
      tap((user) => this.organizationUserRefreshed(ctx, user)),
      ignoreElements(),
    );
  }

  @Action(DeactivateUser)
  onDeactivateUser(
    ctx: StateContext<ParticipantUserDetailPageState>,
    action: DeactivateUser,
  ) {
    if (ctx.getState().busy) {
      return EMPTY;
    }
    ctx.patchState({busy: true});
    return this.apiService.deactivateUser(action.userId).pipe(
      takeUntil(
        this.actions$.pipe(
          filter((action) => action instanceof RefreshOrganizationUser),
        ),
      ),
      this.errorService.toastFailureRxjs('Failed deactivating user'),
      tap((data) => {
        this.toast.showSuccess(`User deactivated successfully`);
        this.organizationUserRefreshed(ctx, Fetched.ready(data));
        this.router.navigate(['/my-organization', 'profile']);
      }),
      finalize(() => ctx.patchState({busy: false})),
      ignoreElements(),
    );
  }

  @Action(ReactivateUser)
  onReactivateUser(
    ctx: StateContext<ParticipantUserDetailPageState>,
    action: ReactivateUser,
  ) {
    if (ctx.getState().busy) {
      return EMPTY;
    }
    ctx.patchState({busy: true});
    return this.apiService.reactivateUser(action.userId).pipe(
      takeUntil(
        this.actions$.pipe(
          filter((action) => action instanceof RefreshOrganizationUser),
        ),
      ),
      this.errorService.toastFailureRxjs('Failed re-activating user'),
      tap((data) => {
        this.toast.showSuccess(`User re-activated successfully`);
        this.organizationUserRefreshed(ctx, Fetched.ready(data));
        this.router.navigate(['/my-organization', 'profile']);
      }),
      finalize(() => ctx.patchState({busy: false})),
      ignoreElements(),
    );
  }

  private organizationUserRefreshed(
    ctx: StateContext<ParticipantUserDetailPageState>,
    user: Fetched<any>,
  ) {
    ctx.patchState({user});
  }
}
