import {Component, Inject, Input, OnDestroy, OnInit} from '@angular/core';
import {Subject, takeUntil} from 'rxjs';
import {Store} from '@ngxs/store';
import {ChildComponentInput} from 'src/app/shared/components/common/slide-over/slide-over.model';
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
  connectorId!: string;
  path = `M4.26 10.147a60.436 60.436 0 0 0-.491 6.347A48.627 48.627 0 0 1 12 20.904a48.627 48.627 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.57 50.57 0 0 0-2.658-.813A59.905 59.905 0 0 1 12 3.493a59.902 59.902 0 0 1 10.399 5.84 51.39 51.39 0 0 0-2.658.814m-15.482 0A50.697 50.697 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5`;

  state = DEFAULT_PARTICIPANT_OWN_CONNECTOR_DETAIL_PAGE_STATE;

  constructor(
    private store: Store,
    @Inject('childComponentInput') childComponentInput: ChildComponentInput,
  ) {
    this.connectorId = childComponentInput.id;
  }

  ngOnInit() {
    this.store.dispatch(new SetConnectorId(this.connectorId));
    this.store.dispatch(RefreshConnector);

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
