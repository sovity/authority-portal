import {Component, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {Observable, Subject, distinctUntilChanged, map, takeUntil} from 'rxjs';
import {Store} from '@ngxs/store';
import {
  MemberInfo,
  UserInfo,
  UserRoleDto,
} from '@sovity.de/authority-portal-client';
import {GlobalState} from 'src/app/core/global-state/global-state';
import {GlobalStateImpl} from 'src/app/core/global-state/global-state-impl';
import {GlobalStateUtils} from 'src/app/core/global-state/global-state-utils';
import {ConfirmationDialogComponent} from 'src/app/shared/components/common/confirmation-dialog/confirmation-dialog.component';
import {ConfirmationDialog} from 'src/app/shared/components/common/confirmation-dialog/confirmation-dialog.model';
import {HeaderBarConfig} from 'src/app/shared/components/common/header-bar/header-bar.model';
import {
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

    this.refresh();
    this.startListeningToState();
    this.startRefreshingOnEnvChange();
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

  setOrganizationMdsId(mdsId: string) {
    this.store.dispatch(new SetOrganizationMdsId(mdsId));
  }

  setOrganizationHeaderConfig(): HeaderBarConfig {
    return {
      title: 'Organization users',
      subtitle:
        'Manage all the users in your organization and their roles and rights',
      headerActions: [],
    };
  }

  setUserHeaderConfig(user: MemberInfo): HeaderBarConfig {
    let headerActions: any[] = [];
    // check if the user is the same as the logged in user
    this.globalStateUtils.userInfo$
      .pipe(distinctUntilChanged())
      .subscribe((userInfo: UserInfo) => {
        if (userInfo.userId !== user.userId) {
          if (user.registrationStatus === 'ACTIVE') {
            headerActions = [
              {
                label: 'Deactivate user',
                action: 'DEACTIVATE',
                permissions: [UserRoleDto.ParticipantAdmin],
              },
            ];
          }
          if (user.registrationStatus === 'DEACTIVATED') {
            headerActions = [
              {
                label: 'Reactivate user',
                action: 'REACTIVATE',
                permissions: [UserRoleDto.ParticipantAdmin],
              },
            ];
          }
        }
      });

    return {
      title: `${user.firstName} ${user.lastName}`,
      subtitle: 'Details about your organization user',
      headerActions: headerActions,
    };
  }

  refresh() {
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

  headerActionHandler(action: string) {
    let data: ConfirmationDialog;
    switch (action) {
      case 'DEACTIVATE': {
        data = {
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
        break;
      }
      case 'REACTIVATE': {
        data = {
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
        break;
      }
    }
  }

  confirmationDialog(data: ConfirmationDialog): Observable<string> {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: window.innerWidth > 640 ? '40%' : '60%',
      data: data,
    });
    return dialogRef.afterClosed();
  }

  ngOnDestroy(): void {
    this.ngOnDestroy$.next(null);
    this.ngOnDestroy$.complete();
  }
}
