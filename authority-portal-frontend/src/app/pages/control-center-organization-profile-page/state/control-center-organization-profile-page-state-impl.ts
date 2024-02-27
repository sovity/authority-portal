import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {ignoreElements, tap} from 'rxjs/operators';
import {Action, State, StateContext} from '@ngxs/store';
import {OwnOrganizationDetailsDto} from '@sovity.de/authority-portal-client';
import {ApiService} from '../../../core/api/api.service';
import {Fetched} from '../../../core/utils/fetched';
import {HeaderBarConfig} from '../../../shared/components/common/header-bar/header-bar.model';
import {Reset} from './control-center-organization-profile-page-action';
import {
  ControlCenterOrganizationProfilePageState,
  DEFAULT_CONTROL_CENTER_ORGANIZATION_PROFILE_PAGE_STATE,
} from './control-center-organization-profile-page-state';

type Ctx = StateContext<ControlCenterOrganizationProfilePageState>;

@State<ControlCenterOrganizationProfilePageState>({
  name: 'ControlCenterOrganizationProfilePageState',
  defaults: DEFAULT_CONTROL_CENTER_ORGANIZATION_PROFILE_PAGE_STATE,
})
@Injectable()
export class ControlCenterOrganizationProfilePageStateImpl {
  constructor(private apiService: ApiService) {}

  @Action(Reset)
  onReset(ctx: Ctx): Observable<never> {
    return this.apiService.getOwnOrganizationDetails().pipe(
      Fetched.wrap({failureMessage: 'Failed to fetch user details'}),
      tap((organization) => {
        ctx.patchState({
          organization,
          headerBarConfig: organization
            .map((data) => this.buildHeaderBarConfig(data))
            .orElse(null),
        });
      }),
      ignoreElements(),
    );
  }

  private buildHeaderBarConfig(
    organization: OwnOrganizationDetailsDto,
  ): HeaderBarConfig {
    return {
      title: organization.name,
      subtitle: 'Details about your organization',
      headerActions: [],
    };
  }
}
