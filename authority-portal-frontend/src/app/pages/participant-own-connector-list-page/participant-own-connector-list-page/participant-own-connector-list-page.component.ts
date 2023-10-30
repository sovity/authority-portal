import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {Store} from '@ngxs/store';
import {DeploymentEnvironmentDto} from '@sovity.de/authority-portal-client';
import {GlobalStateUtils} from 'src/app/core/global-state/global-state-utils';
import {ApiService} from '../../../core/api/api.service';
import {
  DeleteOwnConnector,
  GetOwnOrganizationConnectors,
} from '../state/participant-own-connector-list-page-actions';
import {
  DEFAULT_PARTICIPANT_OWN_CONNECTOR_LIST_PAGE_STATE,
  ParticipantOwnConnectorListPageState,
} from '../state/participant-own-connector-list-page-state';
import {ParticipantOwnConnectorListPageStateImpl} from '../state/participant-own-connector-list-page-state-impl';

@Component({
  selector: 'app-participant-own-connector-list-page',
  templateUrl: './participant-own-connector-list-page.component.html',
})
export class ParticipantOwnConnectorListPageComponent
  implements OnInit, OnDestroy
{
  state = DEFAULT_PARTICIPANT_OWN_CONNECTOR_LIST_PAGE_STATE;
  connectorToDelete = '';
  showModal = false;

  constructor(
    private store: Store,
    private apiService: ApiService,
    private globalStateUtils: GlobalStateUtils,
  ) {}

  ngOnInit() {
    this.refresh();
    this.startListeningToState();
    this.startRefreshingOnEnvChange();
  }

  refresh() {
    this.store.dispatch(GetOwnOrganizationConnectors);
  }

  private startListeningToState() {
    this.store
      .select<ParticipantOwnConnectorListPageState>(
        ParticipantOwnConnectorListPageStateImpl,
      )
      .pipe(takeUntil(this.ngOnDestroy$))
      .subscribe((state) => {
        this.state = state;
      });
  }

  deleteConnector(connectorId: string) {
    this.showModal = true;
    this.connectorToDelete = connectorId;
  }

  confirmDeleteConnector() {
    this.store.dispatch(new DeleteOwnConnector(this.connectorToDelete));
    this.showModal = false;
  }

  cancelDeleteConnector() {
    this.connectorToDelete = '';
    this.showModal = false;
  }
  startRefreshingOnEnvChange() {
    this.globalStateUtils.onDeploymentEnvironmentChangeSkipFirst({
      ngOnDestroy$: this.ngOnDestroy$,
      onChanged: () => {
        this.refresh();
      },
    });
  }

  ngOnDestroy$ = new Subject();

  ngOnDestroy(): void {
    this.ngOnDestroy$.next(null);
    this.ngOnDestroy$.complete();
  }
}
