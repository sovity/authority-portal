import {Component} from '@angular/core';
import {Subject, takeUntil} from 'rxjs';
import {Store} from '@ngxs/store';
import {GlobalState} from 'src/app/core/global-state/global-state';
import {GlobalStateImpl} from 'src/app/core/global-state/global-state-impl';
import {GlobalStateUtils} from 'src/app/core/global-state/global-state-utils';
import {
  RefreshOrganization,
  SetOrganizationMdsId,
} from 'src/app/pages/participant-organization-profile-page/state/participant-organization-profile-page-actions';
import {
  DEFAULT_PARTICIPANT_ORGANIZATION_PROFILE_PAGE_STATE,
  ParticipantOrganizationProfilePageState,
} from 'src/app/pages/participant-organization-profile-page/state/participant-organization-profile-page-state';
import {ParticipantOrganizationProfilePageStateImpl} from 'src/app/pages/participant-organization-profile-page/state/participant-organization-profile-page-state-impl';

@Component({
  selector: 'app-participant-organization-profile',
  templateUrl: './participant-organization-profile-page.component.html',
})
export class ParticipantOrganizationProfilePageComponent {
  state = DEFAULT_PARTICIPANT_ORGANIZATION_PROFILE_PAGE_STATE;
  ngOnDestroy$ = new Subject();

  constructor(
    private store: Store,
    private globalStateUtils: GlobalStateUtils,
  ) {}

  ngOnInit() {
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

  private startListeningToState() {
    return this.store
      .select<ParticipantOrganizationProfilePageState>(
        ParticipantOrganizationProfilePageStateImpl,
      )
      .pipe(takeUntil(this.ngOnDestroy$))
      .subscribe((state) => {
        this.state = state;
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

  refresh() {
    this.store.dispatch(RefreshOrganization);
  }

  ngOnDestroy(): void {
    this.ngOnDestroy$.next(null);
    this.ngOnDestroy$.complete();
  }
}
