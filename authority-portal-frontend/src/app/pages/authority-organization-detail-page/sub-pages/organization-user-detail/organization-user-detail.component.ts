import {Component, Input} from '@angular/core';
import {Subject, takeUntil} from 'rxjs';
import {Store} from '@ngxs/store';
import {UserRoleDto} from '@sovity.de/authority-portal-client';
import {GlobalStateUtils} from 'src/app/core/global-state/global-state-utils';
import {
  getAvailableApplicationRoles,
  isApplicationRole,
} from 'src/app/core/utils/user-role-utils';
import {
  UserDetailConfig,
  UserRoleUpdate,
} from 'src/app/shared/components/business/shared-user-detail/shared-user-detail.model';
import {UserDetailPageConfig} from '../../authority-organization-detail-page/authority-organization-detail-page.model';
import {
  ClearUserApplicationRoleAsAuthority,
  DeactivateUser,
  ReactivateUser,
  RefreshOrganizationUser,
  SetOrganizationUserId,
  UpdateUserApplicationRoleAsAuthority,
  UpdateUserParticipantRole,
} from '../../state/authority-organization-detail-page-actions';
import {
  AuthorityOrganizationUserDetailState,
  DEFAULT_AUTHORITY_ORGANIZATION_USER_DETAIL_STATE,
} from '../../state/authority-organization-detail-page-state';
import {AuthorityOrganizationDetailPageStateImpl} from '../../state/authority-organization-detail-page-state-impl';

@Component({
  selector: 'app-organization-user-detail',
  templateUrl: './organization-user-detail.component.html',
})
export class OrganizationUserDetailComponent {
  @Input() userDetailPageConfig!: UserDetailPageConfig;

  userDetailConfig!: UserDetailConfig;
  availableApplicationRoles: string[] = [];
  availableParticipantRoles: string[] = Object.values(UserRoleDto).filter(
    (role: UserRoleDto) => !isApplicationRole(role),
  ) as string[];
  state = DEFAULT_AUTHORITY_ORGANIZATION_USER_DETAIL_STATE;
  roleFormLoading: boolean = false;
  ngOnDestroy$ = new Subject();

  constructor(
    private store: Store,
    private globalStateUtils: GlobalStateUtils,
  ) {}

  ngOnInit(): void {
    this.setOrganizationUserId(
      this.userDetailPageConfig.mdsId,
      this.userDetailPageConfig.userId,
    );
    this.refresh();
    this.startListeningToState();
    this.setApplicationRoles();
  }

  startListeningToState() {
    this.store
      .select<AuthorityOrganizationUserDetailState>(
        AuthorityOrganizationDetailPageStateImpl.openedUserDetailState,
      )
      .pipe(takeUntil(this.ngOnDestroy$))
      .subscribe((state) => {
        this.state = state;
        if (state.user.isReady)
          this.userDetailConfig = {
            userId: state.userId,
            user: state.user.data,
            pageFor: 'AUTHORITY_VIEW',
          };
        this.roleFormLoading =
          this.state.userParticipantRolesForm.state === 'submitting' ||
          this.state.userApplicationRolesForm.state === 'submitting';
      });
  }

  setOrganizationUserId(mdsId: string, userId: string) {
    this.store.dispatch(new SetOrganizationUserId(mdsId, userId));
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
            new UpdateUserApplicationRoleAsAuthority(
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
        new ClearUserApplicationRoleAsAuthority(this.userDetailConfig.userId),
      );
    }
  }

  refresh() {
    this.store.dispatch(RefreshOrganizationUser);
  }

  ngOnDestroy(): void {
    this.ngOnDestroy$.next(null);
    this.ngOnDestroy$.complete();
  }
}
