import {Component} from '@angular/core';
import {Subject, takeUntil} from 'rxjs';
import {Store} from '@ngxs/store';
import {OwnOrganizationDetailsDto} from '@sovity.de/authority-portal-client';
import {GlobalState} from 'src/app/core/global-state/global-state';
import {GlobalStateImpl} from 'src/app/core/global-state/global-state-impl';
import {GlobalStateUtils} from 'src/app/core/global-state/global-state-utils';
import {HeaderBarConfig} from 'src/app/shared/components/common/header-bar/header-bar.model';
import {
  RefreshOrganization,
  SetOrganizationMdsId,
} from '../../state/control-center-page-action';
import {
  DEFAULT_ORGANIZATION_PROFILE_STATE,
  OrganizationProfileState,
} from '../../state/control-center-page-state';
import {ControlCenterPageStateImpl} from '../../state/control-center-page-state-impl';

@Component({
  selector: 'app-organization-profile',
  templateUrl: './organization-profile.component.html',
})
export class OrganizationProfileComponent {
  state = DEFAULT_ORGANIZATION_PROFILE_STATE;
  ngOnDestroy$ = new Subject();
  headerConfig!: HeaderBarConfig;

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
      .select<OrganizationProfileState>(
        ControlCenterPageStateImpl.organizationProfileState,
      )
      .pipe(takeUntil(this.ngOnDestroy$))
      .subscribe((state) => {
        this.state = state;
        this.headerConfig = this.setHeaderConfig(this.state.organization.data);
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

  setHeaderConfig(organization: OwnOrganizationDetailsDto): HeaderBarConfig {
    return {
      title: organization.name,
      subtitle: 'Details about your organization',
      headerActions: [],
    };
  }

  ngOnDestroy(): void {
    this.ngOnDestroy$.next(null);
    this.ngOnDestroy$.complete();
  }
}