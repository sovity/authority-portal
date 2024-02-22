import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {EMPTY, Observable} from 'rxjs';
import {
  filter,
  finalize,
  ignoreElements,
  take,
  takeUntil,
  tap,
} from 'rxjs/operators';
import {Action, Selector, State, StateContext, Store} from '@ngxs/store';
import {
  ChangeApplicationRoleRequest,
  ChangeParticipantRoleRequest,
  ClearApplicationRoleRequest,
  OwnOrganizationDetailsDto,
  UserDeletionCheck,
} from '@sovity.de/authority-portal-client';
import {ErrorService} from 'src/app/core/error.service';
import {GlobalStateUtils} from 'src/app/core/global-state/global-state-utils';
import {ToastService} from 'src/app/core/toast-notifications/toast.service';
import {ApiService} from '../../../core/api/api.service';
import {Fetched} from '../../../core/utils/fetched';
import {
  CheckDeleteUser,
  ClearMyOrganizationUserId,
  ClearUserApplicationRole,
  DeleteUser,
  RefreshMyOrganizationUser,
  RefreshOrganization,
  RefreshUserProfile,
  SetMyOrganizationUserId,
  SetOrganizationMdsId,
  SetShowOrganizationUserDetailValue,
  UpdateUserApplicationRole,
  UpdateUserDeletionModalVisibility,
  UpdateUserParticipantRole,
} from './control-center-page-action';
import {
  ControlCenterPageState,
  DEFAULT_CONTROL_CENTER_PAGE_STATE,
  OrganizationProfileState,
  OrganizationUserDetailState,
  UserProfileState,
} from './control-center-page-state';

@State<ControlCenterPageState>({
  name: 'ControlCenterPageState',
  defaults: DEFAULT_CONTROL_CENTER_PAGE_STATE,
})
@Injectable()
export class ControlCenterPageStateImpl {
  constructor(
    private apiService: ApiService,
    private errorService: ErrorService,
    private toast: ToastService,
    private globalStateUtils: GlobalStateUtils,
    private store: Store,
    private router: Router,
  ) {}

  @Action(RefreshUserProfile, {cancelUncompleted: true})
  onRefreshUserProfile(
    ctx: StateContext<ControlCenterPageState>,
    action: RefreshUserProfile,
  ): Observable<never> {
    return this.apiService.getUserDetailDto(action.userId).pipe(
      Fetched.wrap({failureMessage: 'Failed loading user'}),
      tap((user) => this.UserProfileRefreshed(ctx, user, action.userId)),
      ignoreElements(),
    );
  }

  private UserProfileRefreshed(
    ctx: StateContext<ControlCenterPageState>,
    user: Fetched<any>,
    userId: string,
  ) {
    ctx.patchState({
      ...ctx.getState(),
      userProfileState: {...ctx.getState().userProfileState, userId, user},
    });
  }
  @Action(SetOrganizationMdsId)
  onSetOrganizationMdsId(
    ctx: StateContext<ControlCenterPageState>,
    action: SetOrganizationMdsId,
  ): Observable<never> {
    ctx.patchState({
      ...ctx.getState(),
      organizationProfileState: {
        ...ctx.getState().organizationProfileState,
        organizationMdsId: action.organizationMdsId,
      },
    });
    return EMPTY;
  }

  @Action(RefreshOrganization, {cancelUncompleted: true})
  onRefreshOrganization(
    ctx: StateContext<ControlCenterPageState>,
    action: RefreshOrganization,
  ): Observable<never> {
    return this.apiService.getMyOrganizationDetails().pipe(
      Fetched.wrap({failureMessage: 'Failed loading organizations'}),
      tap((organization) => this.organizationRefreshed(ctx, organization)),
      ignoreElements(),
    );
  }

  private organizationRefreshed(
    ctx: StateContext<ControlCenterPageState>,
    organization: Fetched<OwnOrganizationDetailsDto>,
  ) {
    ctx.patchState({
      ...ctx.getState(),
      organizationProfileState: {
        ...ctx.getState().organizationProfileState,
        organization: organization,
      },
    });
  }

  @Action(SetMyOrganizationUserId)
  onSetOrganizationUserId(
    ctx: StateContext<ControlCenterPageState>,
    action: SetMyOrganizationUserId,
  ): Observable<never> {
    ctx.patchState({
      organizationUserDetailState: {
        ...DEFAULT_CONTROL_CENTER_PAGE_STATE.organizationUserDetailState,
        organizationMdsId: action.organizationMdsId,
        userId: action.userId,
      },
    });
    this.store.dispatch(new SetShowOrganizationUserDetailValue(true));
    return EMPTY;
  }

  @Action(SetShowOrganizationUserDetailValue)
  onSetShowOrganizationUserDetailValue(
    ctx: StateContext<ControlCenterPageState>,
    action: SetShowOrganizationUserDetailValue,
  ): Observable<never> {
    this.globalStateUtils.updateNestedProperty(
      ctx,
      'organizationProfileState.showMemberDetail',
      action.show,
    );
    return EMPTY;
  }

  @Action(ClearMyOrganizationUserId)
  onClearOrganizationUserId(
    ctx: StateContext<ControlCenterPageState>,
  ): Observable<never> {
    this.globalStateUtils.updateNestedProperty(
      ctx,
      'organizationUserDetailState.userId',
      DEFAULT_CONTROL_CENTER_PAGE_STATE.organizationUserDetailState.userId,
    );

    this.store.dispatch(new SetShowOrganizationUserDetailValue(false));
    return EMPTY;
  }

  @Action(RefreshMyOrganizationUser, {cancelUncompleted: true})
  onRefreshOrganizationUser(
    ctx: StateContext<ControlCenterPageState>,
  ): Observable<never> {
    return this.apiService
      .getOrganizationUser(ctx.getState().organizationUserDetailState.userId)
      .pipe(
        Fetched.wrap({failureMessage: 'Failed loading user'}),
        tap((user) => this.organizationUserRefreshed(ctx, user)),
        ignoreElements(),
      );
  }

  @Action(UpdateUserParticipantRole)
  onUpdateUserParticipantRole(
    ctx: StateContext<ControlCenterPageState>,
    action: UpdateUserParticipantRole,
  ): Observable<never> {
    this.globalStateUtils.updateNestedProperty(
      ctx,
      'organizationUserDetailState.userParticipantRolesForm',
      'submitting',
    );
    let request: ChangeParticipantRoleRequest = {
      userId: action.userId,
      body: action.role,
    };
    return this.apiService.updateUserRoles(request).pipe(
      this.errorService.toastFailureRxjs(
        `Failed updating user's participant roles`,
        () => {
          this.globalStateUtils.updateNestedProperty(
            ctx,
            'organizationUserDetailState.userParticipantRolesForm',
            'error',
          );
        },
      ),
      tap(() => {
        this.toast.showSuccess(`User's Participant Roles updated successfully`);
        ctx.dispatch(new RefreshMyOrganizationUser());
        this.globalStateUtils.updateNestedProperty(
          ctx,
          'organizationUserDetailState.userParticipantRolesForm',
          'success',
        );
      }),

      ignoreElements(),
    );
  }

  @Action(UpdateUserApplicationRole)
  onUpdateUserApplicationRole(
    ctx: StateContext<ControlCenterPageState>,
    action: UpdateUserApplicationRole,
  ): Observable<never> {
    this.globalStateUtils.updateNestedProperty(
      ctx,
      'organizationUserDetailState.userApplicationRolesForm',
      'submitting',
    );
    let request: ChangeApplicationRoleRequest = {
      userId: action.userId,
      body: action.role,
    };
    return this.apiService.updateApplicationUserRoles(request).pipe(
      tap(() => {
        this.toast.showSuccess(`User's Application Roles updated successfully`);
        ctx.dispatch(new RefreshMyOrganizationUser());
        this.globalStateUtils.updateNestedProperty(
          ctx,
          'organizationUserDetailState.userApplicationRolesForm',
          'success',
        );
      }),
      this.errorService.toastFailureRxjs(
        `Failed updating user's application roles`,
        () => {
          this.globalStateUtils.updateNestedProperty(
            ctx,
            'organizationUserDetailState.userApplicationRolesForm',
            'error',
          );
        },
      ),
      ignoreElements(),
    );
  }

  @Action(ClearUserApplicationRole)
  onClearUserApplicationRole(
    ctx: StateContext<ControlCenterPageState>,
    action: ClearUserApplicationRole,
  ): Observable<never> {
    this.globalStateUtils.updateNestedProperty(
      ctx,
      'organizationUserDetailState.userApplicationRolesForm',
      'submitting',
    );
    let request: ClearApplicationRoleRequest = {
      userId: action.userId,
    };
    return this.apiService.clearApplicationRole(request).pipe(
      tap(() => {
        this.toast.showSuccess(`User's Application Roles cleared successfully`);
        ctx.dispatch(new RefreshMyOrganizationUser());
        this.globalStateUtils.updateNestedProperty(
          ctx,
          'organizationUserDetailState.userApplicationRolesForm',
          'success',
        );
      }),
      this.errorService.toastFailureRxjs(
        `Failed clearing user's application roles`,
        () => {
          this.globalStateUtils.updateNestedProperty(
            ctx,
            'organizationUserDetailState.userApplicationRolesForm',
            'error',
          );
        },
      ),
      ignoreElements(),
    );
  }

  @Action(CheckDeleteUser)
  onCheckDeleteUser(
    ctx: StateContext<ControlCenterPageState>,
    action: CheckDeleteUser,
  ) {
    if (ctx.getState().organizationUserDetailState.busy) {
      return EMPTY;
    }
    this.globalStateUtils.updateNestedProperty(
      ctx,
      'organizationUserDetailState.busy',
      true,
    );
    this.globalStateUtils.updateNestedProperty(
      ctx,
      'organizationUserDetailState.showUserDeletionModal',
      true,
    );
    return this.apiService.checkUserDeletion(action.userId).pipe(
      this.errorService.toastFailureRxjs('Failed loading user status'),
      tap((data) => {
        this.updateDeleteUserModal(ctx, Fetched.ready(data));
      }),
      finalize(() =>
        this.globalStateUtils.updateNestedProperty(
          ctx,
          'organizationUserDetailState.busy',
          false,
        ),
      ),
    );
  }

  private updateDeleteUserModal(
    ctx: StateContext<ControlCenterPageState>,
    userDeletionCheck: Fetched<UserDeletionCheck>,
  ) {
    this.globalStateUtils.updateNestedProperty(
      ctx,
      'organizationUserDetailState.modalData',
      userDeletionCheck,
    );
  }

  @Action(DeleteUser)
  onDeleteUser(ctx: StateContext<ControlCenterPageState>, action: DeleteUser) {
    if (ctx.getState().organizationUserDetailState.busy) {
      return EMPTY;
    }
    this.globalStateUtils.updateNestedProperty(
      ctx,
      'organizationUserDetailState.busy',
      true,
    );
    this.globalStateUtils.updateNestedProperty(
      ctx,
      'organizationUserDetailState.isRequestingUserDeletion',
      true,
    );
    return this.apiService.deleteUser(action.userId, action.successorId).pipe(
      this.errorService.toastFailureRxjs('Failed deleting user', () => {
        this.globalStateUtils.updateNestedProperty(
          ctx,
          'organizationUserDetailState.isRequestingUserDeletion',
          false,
        );
      }),
      tap((data) => {
        this.globalStateUtils.updateNestedProperty(
          ctx,
          'organizationUserDetailState.isRequestingUserDeletion',
          false,
        );
        this.globalStateUtils.updateNestedProperty(
          ctx,
          'organizationUserDetailState.showUserDeletionModal',
          false,
        );
        this.toast.showSuccess('Successfully deleted user');
        this.store.dispatch(new ClearMyOrganizationUserId());
        this.router.navigate(['/control-center'], {
          queryParams: {tab: 'my-users'},
        });
        this.store.dispatch(RefreshOrganization);
      }),
      finalize(() => {
        this.globalStateUtils.updateNestedProperty(
          ctx,
          'organizationUserDetailState.busy',
          false,
        );
      }),
    );
  }

  @Action(UpdateUserDeletionModalVisibility)
  onUpdateUserDeletionModalVisibility(
    ctx: StateContext<ControlCenterPageState>,
    action: UpdateUserDeletionModalVisibility,
  ) {
    this.globalStateUtils.updateNestedProperty(
      ctx,
      'organizationUserDetailState.showUserDeletionModal',
      action.visible,
    );
  }

  private organizationUserRefreshed(
    ctx: StateContext<ControlCenterPageState>,
    user: Fetched<any>,
  ) {
    ctx.patchState({
      ...ctx.getState(),
      organizationUserDetailState: {
        ...ctx.getState().organizationUserDetailState,
        user,
      },
    });
  }

  @Selector()
  static userProfileState(state: ControlCenterPageState): UserProfileState {
    return state.userProfileState;
  }

  @Selector()
  static organizationProfileState(
    state: ControlCenterPageState,
  ): OrganizationProfileState {
    return state.organizationProfileState;
  }

  @Selector()
  static organizationUsersState(
    state: ControlCenterPageState,
  ): OrganizationUserDetailState {
    return state.organizationUserDetailState;
  }
}
