import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {Store} from '@ngxs/store';
import {ApiService} from '../../../core/api/api.service';
import {GetOwnOrganizationConnectors} from '../state/participant-own-connector-list-page-actions';
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

  constructor(private store: Store, private apiService: ApiService) {}

  ngOnInit() {
    this.refresh();
    this.startListeningToState();
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

  ngOnDestroy$ = new Subject();

  ngOnDestroy(): void {
    this.ngOnDestroy$.next(null);
    this.ngOnDestroy$.complete();
  }
}
