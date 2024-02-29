import {Injectable} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {Observable} from 'rxjs';
import {filter, ignoreElements, tap} from 'rxjs/operators';
import {Action, State, StateContext} from '@ngxs/store';
import {
  OwnOrganizationDetailsDto,
  UserRoleDto,
} from '@sovity.de/authority-portal-client';
import {ApiService} from '../../../core/api/api.service';
import {Fetched} from '../../../core/utils/fetched';
import {ParticipantInviteNewUserComponent} from '../../../popups/participant-invite-new-user/participant-invite-new-user/participant-invite-new-user.component';
import {HeaderBarConfig} from '../../../shared/components/common/header-bar/header-bar.model';
import {Reset} from './control-center-organization-members-page-action';
import {
  ControlCenterOrganizationMembersPageState,
  DEFAULT_CONTROL_CENTER_ORGANIZATION_MEMBERS_PAGE_STATE,
} from './control-center-organization-members-page-state';

type Ctx = StateContext<ControlCenterOrganizationMembersPageState>;

@State<ControlCenterOrganizationMembersPageState>({
  name: 'ControlCenterOrganizationMembersPageState',
  defaults: DEFAULT_CONTROL_CENTER_ORGANIZATION_MEMBERS_PAGE_STATE,
})
@Injectable()
export class ControlCenterOrganizationMembersPageStateImpl {
  constructor(private apiService: ApiService, private dialog: MatDialog) {}

  @Action(Reset)
  onReset(ctx: Ctx): Observable<never> {
    return this.apiService.getOwnOrganizationDetails().pipe(
      Fetched.wrap({failureMessage: 'Failed to fetch user details'}),
      tap((organization) => {
        ctx.patchState({
          organization,
          headerBarConfig: organization
            .map((data) => this.buildHeaderBarConfig(ctx, data))
            .orElse(null),
        });
      }),
      ignoreElements(),
    );
  }

  private buildHeaderBarConfig(
    ctx: Ctx,
    organization: OwnOrganizationDetailsDto,
  ): HeaderBarConfig {
    return {
      title: organization.name,
      subtitle: 'Your Organization Members',
      headerActions: [
        {
          label: 'Invite user',
          action: () => this.onShowInviteUserDialog(ctx),
          permissions: [UserRoleDto.Admin],
        },
      ],
    };
  }

  private onShowInviteUserDialog(ctx: Ctx): void {
    this.dialog
      .open(ParticipantInviteNewUserComponent, {
        width: window.innerWidth > 640 ? '60%' : '100%',
      })
      .afterClosed()
      .pipe(filter((it) => !!it))
      .subscribe(() => {
        ctx.dispatch(Reset);
      });
  }
}
