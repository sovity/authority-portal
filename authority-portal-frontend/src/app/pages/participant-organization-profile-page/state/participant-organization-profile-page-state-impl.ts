import {Injectable} from '@angular/core';
import {EMPTY, Observable} from 'rxjs';
import {ignoreElements, switchMap, tap} from 'rxjs/operators';
import {Action, State, StateContext} from '@ngxs/store';
import {OwnOrganizationDetailsDto} from '@sovity.de/authority-portal-client';
import {GlobalStateUtils} from 'src/app/core/global-state/global-state-utils';
import {ApiService} from '../../../core/api/api.service';
import {Fetched} from '../../../core/utils/fetched';
import {
  RefreshOrganization,
  SetOrganizationMdsId,
} from './participant-organization-profile-page-actions';
import {
  DEFAULT_PARTICIPANT_ORGANIZATION_PROFILE_PAGE_STATE,
  ParticipantOrganizationProfilePageState,
} from './participant-organization-profile-page-state';

@State<ParticipantOrganizationProfilePageState>({
  name: 'ParticipantOrganizationProfilePageState',
  defaults: DEFAULT_PARTICIPANT_ORGANIZATION_PROFILE_PAGE_STATE,
})
@Injectable()
export class ParticipantOrganizationProfilePageStateImpl {
  constructor(
    private apiService: ApiService,
    private globalStateUtils: GlobalStateUtils,
  ) {}

  @Action(SetOrganizationMdsId)
  onSetOrganizationMdsId(
    ctx: StateContext<ParticipantOrganizationProfilePageState>,
    action: SetOrganizationMdsId,
  ): Observable<never> {
    ctx.patchState({organizationMdsId: action.organizationMdsId});
    return EMPTY;
  }

  @Action(RefreshOrganization, {cancelUncompleted: true})
  onRefreshOrganization(
    ctx: StateContext<ParticipantOrganizationProfilePageState>,

    action: RefreshOrganization,
  ): Observable<never> {
    return this.globalStateUtils.getDeploymentEnvironmentId().pipe(
      switchMap((deploymentEnvironmentId) =>
        this.apiService.getMyOrganizationDetails(),
      ),
      Fetched.wrap({failureMessage: 'Failed loading organizations'}),
      tap((organization) => this.organizationRefreshed(ctx, organization)),
      ignoreElements(),
    );
  }

  private organizationRefreshed(
    ctx: StateContext<ParticipantOrganizationProfilePageState>,
    organization: Fetched<OwnOrganizationDetailsDto>,
  ) {
    ctx.patchState({organization});
  }
}
