import {Component, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {Observable, Subject, distinctUntilChanged, takeUntil} from 'rxjs';
import {Store} from '@ngxs/store';
import {
  MemberInfo,
  UserInfo,
  UserRoleDto,
} from '@sovity.de/authority-portal-client';
import {GlobalState} from 'src/app/core/global-state/global-state';
import {GlobalStateImpl} from 'src/app/core/global-state/global-state-impl';
import {GlobalStateUtils} from 'src/app/core/global-state/global-state-utils';
import {ParticipantInviteNewUserComponent} from 'src/app/popups/participant-invite-new-user/participant-invite-new-user/participant-invite-new-user.component';
import {ConfirmationDialogComponent} from 'src/app/shared/components/common/confirmation-dialog/confirmation-dialog.component';
import {ConfirmationDialog} from 'src/app/shared/components/common/confirmation-dialog/confirmation-dialog.model';
import {HeaderBarConfig} from 'src/app/shared/components/common/header-bar/header-bar.model';
import {
  CheckDeleteUser,
  ClearMyOrganizationUserId,
  DeactivateUser,
  ReactivateUser,
  RefreshOrganization,
  SetMyOrganizationUserId,
  SetOrganizationMdsId,
} from '../../state/control-center-page-action';
import {
  DEFAULT_ORGANIZATION_PROFILE_STATE,
  OrganizationProfileState,
} from '../../state/control-center-page-state';
import {ControlCenterPageStateImpl} from '../../state/control-center-page-state-impl';

@Component({
  selector: 'app-organization-users',
  templateUrl: './organization-users.component.html',
})
export class OrganizationUsersComponent implements OnInit {
  state = DEFAULT_ORGANIZATION_PROFILE_STATE;
  openedUser!: {userName: string; userId: string; mdsId: string};
  ngOnDestroy$ = new Subject();
  headerConfig!: HeaderBarConfig;
  showDetail: boolean = false;
  loggedInUserId: string = '';

  constructor(
    private store: Store,
    private globalStateUtils: GlobalStateUtils,
    public dialog: MatDialog,
  ) {}

  ngOnInit() {
    this.headerConfig = this.setOrganizationHeaderConfig();
    this.store
      .select<GlobalState>(GlobalStateImpl)
      .pipe(takeUntil(this.ngOnDestroy$))
      .subscribe((globalState) =>
        this.setOrganizationMdsId(globalState.userInfo.data.organizationMdsId),
      );

    this.startListeningToState();
    this.startRefreshingOnEnvChange();
    this.startListeningToLoggedInUser();
    this.refresh();
  }

  startListeningToState() {
    return this.store
      .select<OrganizationProfileState>(
        ControlCenterPageStateImpl.organizationProfileState,
      )
      .pipe(takeUntil(this.ngOnDestroy$))
      .subscribe((state) => {
        this.state = state;
        this.showDetail = state.showMemberDetail;
        if (!this.showDetail)
          this.headerConfig = this.setOrganizationHeaderConfig();
      });
  }

  startRefreshingOnEnvChange() {
    this.globalStateUtils.onDeploymentEnvironmentChangeSkipFirst({
      ngOnDestroy$: this.ngOnDestroy$,
      onChanged: (selectedEnvironment) => {
        this.refresh();
      },
    });
  }

  startListeningToLoggedInUser() {
    this.globalStateUtils.userInfo$
      .pipe(takeUntil(this.ngOnDestroy$), distinctUntilChanged())
      .subscribe((userInfo: UserInfo) => {
        this.loggedInUserId = userInfo.userId;
      });
  }

  setOrganizationMdsId(mdsId: string) {
    this.store.dispatch(new SetOrganizationMdsId(mdsId));
  }

  setOrganizationHeaderConfig(): HeaderBarConfig {
    return {
      title: 'Organization users',
      subtitle:
        'Manage all users in your organization and their roles and rights',
      headerActions: [
        {
          label: 'Invite user',
          action: () => this.showInviteUserDialog(),
          permissions: [UserRoleDto.Admin],
        },
      ],
    };
  }

  setUserHeaderConfig(user: MemberInfo): HeaderBarConfig {
    let headerActions: any[] = [];

    if (this.loggedInUserId !== user.userId) {
      headerActions.push({
        label: 'Delete user',
        action: () => this.deleteUser(),
        permissions: [UserRoleDto.Admin],
      });
      if (user.registrationStatus === 'ACTIVE') {
        headerActions.push({
          label: 'Deactivate user',
          action: () => this.deactivateUser(),
          permissions: [UserRoleDto.Admin],
        });
      }
      if (user.registrationStatus === 'DEACTIVATED') {
        headerActions.push({
          label: 'Reactivate user',
          action: () => this.reactivateUser(),
          permissions: [UserRoleDto.Admin],
        });
      }
    }

    return {
      title: `${user.firstName} ${user.lastName}`,
      subtitle: 'Details about your organization user',
      headerActions: headerActions,
    };
  }

  refresh() {
    this.store.dispatch(new ClearMyOrganizationUserId());
    this.store.dispatch(RefreshOrganization);
  }

  openUserDetail(user: MemberInfo, organizationMdsId: string) {
    this.store.dispatch(
      new SetMyOrganizationUserId(organizationMdsId, user.userId),
    );
    this.openedUser = {
      userName: `${user.firstName}  ${user.lastName}`,
      userId: user.userId,
      mdsId: organizationMdsId,
    };
    this.headerConfig = this.setUserHeaderConfig(user);
  }

  private deactivateUser() {
    const data: ConfirmationDialog = {
      title: `Are you sure you want to deactivate ${this.openedUser.userName} ?`,
      messageBody:
        'Please note that deactivating a user will prohibit the user from logging into the portal. You have the option to reactivate a user at any time.',
      actionButtons: [
        {
          action: 'DEACTIVATE',
          label: 'Deactivate',
          style: 'btn-accent-danger',
        },
      ],
    };
    this.confirmationDialog(data).subscribe((result: string) => {
      if (result === 'DEACTIVATE') {
        this.store.dispatch(new DeactivateUser(this.openedUser.userId));
        this.store.dispatch(new ClearMyOrganizationUserId());
        this.refresh();
      }
    });
  }

  private deleteUser() {
    this.store.dispatch(new CheckDeleteUser(this.openedUser.userId));
  }

  private reactivateUser() {
    const data: ConfirmationDialog = {
      title: `Are you sure you want to reactivate ${this.openedUser.userName}?`,
      messageBody:
        'Reactivating a user will send them an email invite with a link to login to the portal. This user will be reactivated as a curator. ',
      actionButtons: [
        {
          action: 'REACTIVATE',
          label: 'Reactivate',
          style: 'btn-accent-success',
        },
      ],
    };
    this.confirmationDialog(data).subscribe((result: string) => {
      if (result === 'REACTIVATE') {
        this.store.dispatch(new ReactivateUser(this.openedUser.userId));
        this.store.dispatch(new ClearMyOrganizationUserId());
        this.refresh();
      }
    });
  }

  confirmationDialog(data: ConfirmationDialog): Observable<string> {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: window.innerWidth > 640 ? '40%' : '60%',
      data: data,
    });
    return dialogRef.afterClosed();
  }

  private showInviteUserDialog() {
    this.dialog.open(ParticipantInviteNewUserComponent, {
      width: window.innerWidth > 640 ? '60%' : '100%',
    });
  }

  ngOnDestroy(): void {
    this.ngOnDestroy$.next(null);
    this.ngOnDestroy$.complete();
  }
}
