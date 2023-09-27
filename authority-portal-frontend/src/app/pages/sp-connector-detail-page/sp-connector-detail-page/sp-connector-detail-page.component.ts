import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Subject, takeUntil} from 'rxjs';
import {Store} from '@ngxs/store';
import {RefreshConnector} from '../state/sp-connector-detail-page-actions';
import {
  DEFAULT_SP_CONNECTOR_DETAIL_PAGE_STATE,
  SpConnectorDetailPageState,
} from '../state/sp-connector-detail-page-state';
import {SpConnectorDetailPageStateImpl} from '../state/sp-connector-detail-page-state-impl';

@Component({
  selector: 'app-sp-connector-detail-page',
  templateUrl: './sp-connector-detail-page.component.html',
})
export class SpConnectorDetailPageComponent
  implements OnInit, OnDestroy
{
  state = DEFAULT_SP_CONNECTOR_DETAIL_PAGE_STATE;

  constructor(private store: Store, private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      let connectorId = params.get('connectorId')!!;
      this.store.dispatch(new RefreshConnector(connectorId));
    });

    this.startListeningToState();
  }

  private startListeningToState() {
    this.store
      .select<SpConnectorDetailPageState>(
        SpConnectorDetailPageStateImpl,
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
