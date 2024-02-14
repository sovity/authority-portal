import {Component, Input} from '@angular/core';
import {Subject, takeUntil} from 'rxjs';
import {Store} from '@ngxs/store';
import {UserRoleDto} from '@sovity.de/authority-portal-client';
import {GlobalStateUtils} from 'src/app/core/global-state/global-state-utils';
import {getAvailableApplicationRoles} from 'src/app/core/utils/user-role-utils';
import {
  UserDetailConfig,
  UserRoleUpdate,
} from 'src/app/shared/components/business/shared-user-detail/shared-user-detail.model';
import {
  ClearUserApplicationRole,
  DeactivateUser,
  ReactivateUser,
  RefreshMyOrganizationUser,
  SetMyOrganizationUserId,
  UpdateUserApplicationRole,
  UpdateUserParticipantRole,
} from '../../state/control-center-page-action';
import {
  DEFAULT_ORGANIZATION_USER_DETAIL_STATE,
  OrganizationUserDetailState,
} from '../../state/control-center-page-state';
import {ControlCenterPageStateImpl} from '../../state/control-center-page-state-impl';

@Component({
  selector: 'app-organization-user',
  templateUrl: './organization-user.component.html',
})
export class OrganizationUserComponent {
  @Input() config!: {userId: string; mdsId: string};
  state = DEFAULT_ORGANIZATION_USER_DETAIL_STATE;
  ngOnDestroy$ = new Subject();
  userDetailConfig!: UserDetailConfig;
  roleFormLoading: boolean = false;
  availableApplicationRoles: string[] = [];
  availableParticipantRoles: string[] = Object.values(UserRoleDto).filter(
    (role: UserRoleDto) => role.startsWith('PARTICIPANT'),
  ) as string[];

  constructor(
    private store: Store,
    private globalStateUtils: GlobalStateUtils,
  ) {}

  ngOnInit() {
    this.setMyOrganizationUserId(this.config.mdsId, this.config.userId);
    this.refresh();
    this.startListeningToState();
    this.setApplicationRoles();
  }

  startListeningToState() {
    this.store
      .select<OrganizationUserDetailState>(
        ControlCenterPageStateImpl.organizationUsersState,
      )
      .pipe(takeUntil(this.ngOnDestroy$))
      .subscribe((state) => {
        this.state = state;
        if (state.user.isReady) {
          this.userDetailConfig = {
            userId: state.userId,
            user: state.user.data,
            pageFor: 'INTERNAL_VIEW',
          };
        }

        this.roleFormLoading =
          this.state.userParticipantRolesForm.state === 'submitting' ||
          this.state.userApplicationRolesForm.state === 'submitting';
      });
  }

  refresh() {
    this.store.dispatch(RefreshMyOrganizationUser);
  }

  setApplicationRoles() {
    this.globalStateUtils.userInfo$.subscribe((userInfo) => {
      this.availableApplicationRoles = getAvailableApplicationRoles(
        Array.from(userInfo.roles),
      );
    });
  }

  userActionHandler($event: any) {
    switch ($event.type) {
      case 'REACTIVATE':
        this.store.dispatch(new ReactivateUser(this.state.userId));
        break;
      case 'DEACTIVATE':
        this.store.dispatch(new DeactivateUser(this.state.userId));
        break;
    }
  }

  userRoleUpdateHandler($event: UserRoleUpdate) {
    if ($event.role) {
      switch ($event.type) {
        case 'APPLICATION':
          this.store.dispatch(
            new UpdateUserApplicationRole(
              this.userDetailConfig.userId,
              $event.role,
            ),
          );
          break;
        case 'PARTICIPANT':
          this.store.dispatch(
            new UpdateUserParticipantRole(
              this.userDetailConfig.userId,
              $event.role,
            ),
          );
          break;
      }
    } else {
      this.store.dispatch(
        new ClearUserApplicationRole(this.userDetailConfig.userId),
      );
    }
  }
  setMyOrganizationUserId(mdsId: string, userId: string) {
    this.store.dispatch(new SetMyOrganizationUserId(mdsId, userId));
  }

  ngOnDestroy(): void {
    this.ngOnDestroy$.next(null);
    this.ngOnDestroy$.complete();
  }
}
