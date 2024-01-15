import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {EMPTY, Observable} from 'rxjs';
import {filter, finalize, ignoreElements, takeUntil, tap} from 'rxjs/operators';
import {Action, Actions, State, StateContext} from '@ngxs/store';
import {
  ChangeApplicationRoleRequest,
  ChangeParticipantRoleRequest,
  ClearApplicationRoleRequest,
} from '@sovity.de/authority-portal-client';
import {ErrorService} from 'src/app/core/error.service';
import {ToastService} from 'src/app/core/toast-notifications/toast.service';
import {ApiService} from '../../../core/api/api.service';
import {Fetched} from '../../../core/utils/fetched';
import {
  ClearUserApplicationRoleAsAuthority,
  DeactivateUser,
  ReactivateUser,
  RefreshOrganizationUser,
  SetOrganizationUserId,
  UpdateUserApplicationRoleAsAuthority,
  UpdateUserParticipantRoleAsAuthority,
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

  @Action(UpdateUserParticipantRoleAsAuthority)
  onUpdateUserParticipantRoleAsAuthority(
    ctx: StateContext<AuthorityOrganizationUserDetailPageState>,
    action: UpdateUserParticipantRoleAsAuthority,
  ): Observable<never> {
    ctx.patchState({
      userParticipantRolesForm: {
        ...ctx.getState().userParticipantRolesForm,
        state: 'submitting',
      },
    });
    let request: ChangeParticipantRoleRequest = {
      userId: action.userId,
      body: action.role,
    };
    return this.apiService.updateUserRoles(request).pipe(
      this.errorService.toastFailureRxjs(
        `Failed updating user's participant roles`,
        () => {
          ctx.patchState({
            userParticipantRolesForm: {
              ...ctx.getState().userParticipantRolesForm,
              state: 'error',
            },
          });
        },
      ),
      tap(() => {
        this.toast.showSuccess(`User's Participant Roles updated successfully`);
        ctx.dispatch(new RefreshOrganizationUser());
        ctx.patchState({
          userParticipantRolesForm: {
            ...ctx.getState().userParticipantRolesForm,
            state: 'success',
          },
        });
      }),

      ignoreElements(),
    );
  }

  @Action(UpdateUserApplicationRoleAsAuthority)
  onUpdateUserApplicationRoleAsAuthority(
    ctx: StateContext<AuthorityOrganizationUserDetailPageState>,
    action: UpdateUserApplicationRoleAsAuthority,
  ): Observable<never> {
    ctx.patchState({
      userApplicationRolesForm: {
        ...ctx.getState().userApplicationRolesForm,
        state: 'submitting',
      },
    });
    let request: ChangeApplicationRoleRequest = {
      userId: action.userId,
      body: action.role,
    };
    return this.apiService.updateApplicationUserRoles(request).pipe(
      tap(() => {
        this.toast.showSuccess(`User's Application Roles updated successfully`);
        ctx.dispatch(new RefreshOrganizationUser());

        ctx.patchState({
          userApplicationRolesForm: {
            ...ctx.getState().userApplicationRolesForm,
            state: 'success',
          },
        });
      }),
      this.errorService.toastFailureRxjs(
        `Failed updating user's application roles`,
        () => {
          ctx.patchState({
            userApplicationRolesForm: {
              ...ctx.getState().userApplicationRolesForm,
              state: 'error',
            },
          });
        },
      ),
      ignoreElements(),
    );
  }

  @Action(ClearUserApplicationRoleAsAuthority)
  onClearUserApplicationRoleAsAuthority(
    ctx: StateContext<AuthorityOrganizationUserDetailPageState>,
    action: UpdateUserApplicationRoleAsAuthority,
  ): Observable<never> {
    ctx.patchState({
      userApplicationRolesForm: {
        ...ctx.getState().userApplicationRolesForm,
        state: 'submitting',
      },
    });
    let request: ClearApplicationRoleRequest = {
      userId: action.userId,
    };

    return this.apiService.clearApplicationRole(request).pipe(
      tap(() => {
        this.toast.showSuccess(`User's Application Roles cleared successfully`);
        ctx.dispatch(new RefreshOrganizationUser());

        ctx.patchState({
          userApplicationRolesForm: {
            ...ctx.getState().userApplicationRolesForm,
            state: 'success',
          },
        });
      }),
      this.errorService.toastFailureRxjs(
        `Failed clearing of user's application roles`,
        () => {
          ctx.patchState({
            userApplicationRolesForm: {
              ...ctx.getState().userApplicationRolesForm,
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
    action: ReactivateUser,
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
