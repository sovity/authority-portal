import {Injectable} from '@angular/core';
import {EMPTY, Observable} from 'rxjs';
import {ignoreElements, tap} from 'rxjs/operators';
import {Action, State, StateContext} from '@ngxs/store';
import {
  ChangeAuthorityRoleRequest,
  ChangeParticipantRoleRequest,
} from '@sovity.de/authority-portal-client';
import {ErrorService} from 'src/app/core/error.service';
import {ToastService} from 'src/app/core/toast-notifications/toast.service';
import {ApiService} from '../../../core/api/api.service';
import {Fetched} from '../../../core/utils/fetched';
import {
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
}
