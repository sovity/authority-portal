import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {EMPTY, Observable} from 'rxjs';
import {filter, finalize, ignoreElements, takeUntil, tap} from 'rxjs/operators';
import {Action, Actions, State, StateContext} from '@ngxs/store';
import {
  ChangeAuthorityRoleRequest,
  ChangeParticipantRoleRequest,
} from '@sovity.de/authority-portal-client';
import {ErrorService} from 'src/app/core/error.service';
import {ToastService} from 'src/app/core/toast-notifications/toast.service';
import {ApiService} from '../../../core/api/api.service';
import {Fetched} from '../../../core/utils/fetched';
import {
  DeactivateUser,
  ReactivateUser,
  RefreshOrganizationUser,
  SetOrganizationUserId,
  UpdateAuthorityUserRoles,
  UpdateUserRoles,
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
  constructor(
    private apiService: ApiService,
    private toast: ToastService,
    private errorService: ErrorService,
    private actions$: Actions,
    private router: Router,
  ) {}

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

  @Action(UpdateUserRoles)
  onUpdateUserRoles(
    ctx: StateContext<AuthorityOrganizationUserDetailPageState>,
    action: UpdateUserRoles,
  ): Observable<never> {
    ctx.patchState({
      userRolesForm: {...ctx.getState().userRolesForm, state: 'submitting'},
    });
    let request: ChangeParticipantRoleRequest = {
      userId: action.userId,
      body: action.roles[0],
    };
    return this.apiService.updateUserRoles(request).pipe(
      tap(() => {
        this.toast.showSuccess(`User's Roles updated successfully`);
        ctx.patchState({
          userRolesForm: {...ctx.getState().userRolesForm, state: 'success'},
        });
      }),
      this.errorService.toastFailureRxjs('Failed updating user roles', () => {
        ctx.patchState({
          userRolesForm: {...ctx.getState().userRolesForm, state: 'error'},
        });
      }),
      ignoreElements(),
    );
  }

  @Action(UpdateAuthorityUserRoles)
  onUpdateAuthorityUserRoles(
    ctx: StateContext<AuthorityOrganizationUserDetailPageState>,
    action: UpdateUserRoles,
  ): Observable<never> {
    let request: ChangeAuthorityRoleRequest = {
      userId: action.userId,
      body: action.roles[0],
    };
    return this.apiService.updateUserRoles(request).pipe(
      tap(() => {
        this.toast.showSuccess(`User's Authority Roles updated successfully`);
        ctx.patchState({
          userAuthorityRoles: {
            ...ctx.getState().userAuthorityRoles,
            state: 'success',
          },
        });
      }),
      this.errorService.toastFailureRxjs(
        'Failed updating user Authority roles',
        () => {
          ctx.patchState({
            userAuthorityRoles: {
              ...ctx.getState().userAuthorityRoles,
              state: 'error',
            },
          });
        },
      ),
      ignoreElements(),
    );
  }

  @Action(DeactivateUser)
  onDeactivateUser(
    ctx: StateContext<AuthorityOrganizationUserDetailPageState>,
    action: DeactivateUser,
  ) {
    if (ctx.getState().busy) {
      return EMPTY;
    }
    ctx.patchState({busy: true});
    return this.apiService.deactivateAnyUser(action.userId).pipe(
      takeUntil(
        this.actions$.pipe(
          filter((action) => action instanceof RefreshOrganizationUser),
        ),
      ),
      this.errorService.toastFailureRxjs('Failed deactivating user'),
      tap((data) => {
        let organizationMdsId = ctx.getState().organizationMdsId;
        this.toast.showSuccess(`User deactivated successfully`);
        this.organizationUserRefreshed(ctx, Fetched.ready(data));
        this.router.navigate(['/authority/organizations', organizationMdsId]);
      }),
      finalize(() => ctx.patchState({busy: false})),
      ignoreElements(),
    );
  }

  @Action(ReactivateUser)
  onReactivateUser(
    ctx: StateContext<AuthorityOrganizationUserDetailPageState>,
    action: DeactivateUser,
  ) {
    if (ctx.getState().busy) {
      return EMPTY;
    }
    ctx.patchState({busy: true});
    return this.apiService.reactivateAnyUser(action.userId).pipe(
      takeUntil(
        this.actions$.pipe(
          filter((action) => action instanceof RefreshOrganizationUser),
        ),
      ),
      this.errorService.toastFailureRxjs('Failed re-activating user'),
      tap((data) => {
        let organizationMdsId = ctx.getState().organizationMdsId;
        this.toast.showSuccess(`User re-activated successfully`);
        this.organizationUserRefreshed(ctx, Fetched.ready(data));
        this.router.navigate(['/authority/organizations', organizationMdsId]);
      }),
      finalize(() => ctx.patchState({busy: false})),
      ignoreElements(),
    );
  }
}
