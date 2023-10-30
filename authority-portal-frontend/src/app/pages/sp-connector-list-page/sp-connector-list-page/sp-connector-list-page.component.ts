import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {Store} from '@ngxs/store';
import {DeploymentEnvironmentDto} from '@sovity.de/authority-portal-client';
import {GlobalStateUtils} from 'src/app/core/global-state/global-state-utils';
import {ApiService} from '../../../core/api/api.service';
import {GetOwnOrganizationConnectors} from '../state/sp-connector-list-page-actions';
import {
  DEFAULT_SP_CONNECTOR_LIST_PAGE_STATE,
  SpConnectorListPageState,
} from '../state/sp-connector-list-page-state';
import {SpConnectorListPageStateImpl} from '../state/sp-connector-list-page-state-impl';

@Component({
  selector: 'app-sp-connector-list-page',
  templateUrl: './sp-connector-list-page.component.html',
})
export class SpConnectorListPageComponent implements OnInit, OnDestroy {
  state = DEFAULT_SP_CONNECTOR_LIST_PAGE_STATE;
  filter = 'ALL';
  selectedEnvironment!: DeploymentEnvironmentDto;

  constructor(
    private store: Store,
    private apiService: ApiService,
    private globalStateUtils: GlobalStateUtils,
  ) {}

  ngOnInit() {
    this.refresh();
    this.startListeningToState();
    this.startListeningToGlobalState();
  }

  refresh() {
    this.store.dispatch(GetOwnOrganizationConnectors);
  }

  private startListeningToState() {
    this.store
      .select<SpConnectorListPageState>(SpConnectorListPageStateImpl)
      .pipe(takeUntil(this.ngOnDestroy$))
      .subscribe((state) => {
        this.state = state;
      });
  }

  startListeningToGlobalState() {
    this.globalStateUtils.deploymentEnvironment$
      .pipe(takeUntil(this.ngOnDestroy$))
      .subscribe((selectedEnvironment) => {
        this.selectedEnvironment = selectedEnvironment;
      });
  }

  setOrganizationMdsId(organizationMdsId: any): void {
    throw new Error('Method not implemented.');
  }

  filterBy(filter: string) {
    this.filter = filter;
  }

  ngOnDestroy$ = new Subject();

  ngOnDestroy(): void {
    this.ngOnDestroy$.next(null);
    this.ngOnDestroy$.complete();
  }
}
