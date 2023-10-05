import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Subject, takeUntil} from 'rxjs';
import {Store} from '@ngxs/store';
import {
  RefreshConnector,
  SetConnectorId,
} from '../state/participant-own-connector-detail-page-actions';
import {
  DEFAULT_PARTICIPANT_OWN_CONNECTOR_DETAIL_PAGE_STATE,
  ParticipantOwnConnectorDetailPageState,
} from '../state/participant-own-connector-detail-page-state';
import {ParticipantOwnConnectorDetailPageStateImpl} from '../state/participant-own-connector-detail-page-state-impl';

@Component({
  selector: 'app-participant-own-connector-detail-page',
  templateUrl: './participant-own-connector-detail-page.component.html',
})
export class ParticipantOwnConnectorDetailPageComponent
  implements OnInit, OnDestroy
{
  state = DEFAULT_PARTICIPANT_OWN_CONNECTOR_DETAIL_PAGE_STATE;

  constructor(private store: Store, private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      let connectorId = params.get('connectorId')!!;
      this.store.dispatch(new SetConnectorId(connectorId));
      this.store.dispatch(RefreshConnector);
    });

    this.startListeningToState();
  }

  private startListeningToState() {
    this.store
      .select<ParticipantOwnConnectorDetailPageState>(
        ParticipantOwnConnectorDetailPageStateImpl,
      )
      .pipe(takeUntil(this.ngOnDestroy$))
      .subscribe((state) => {
        this.state = state;
      });
  }

  refresh() {
    this.store.dispatch(RefreshConnector);
  }

  ngOnDestroy$ = new Subject();

  ngOnDestroy(): void {
    this.ngOnDestroy$.next(null);
    this.ngOnDestroy$.complete();
  }
}
