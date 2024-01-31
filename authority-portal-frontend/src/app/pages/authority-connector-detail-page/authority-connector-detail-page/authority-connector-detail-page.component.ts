import {Component, HostBinding, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Subject, takeUntil} from 'rxjs';
import {Store} from '@ngxs/store';
import {
  RefreshConnector,
  SetConnectorId,
} from '../state/authority-connector-detail-page-actions';
import {
  AuthorityConnectorDetailPageState,
  DEFAULT_AUTHORITY_CONNECTOR_DETAIL_PAGE_STATE,
} from '../state/authority-connector-detail-page-state';
import {AuthorityConnectorDetailPageStateImpl} from '../state/authority-connector-detail-page-state-impl';

@Component({
  selector: 'app-authority-connector-detail-page',
  templateUrl: './authority-connector-detail-page.component.html',
})
export class AuthorityConnectorDetailPageComponent
  implements OnInit, OnDestroy
{
  @HostBinding('class.overflow-y-auto') overflowYAuto = true;
  state = DEFAULT_AUTHORITY_CONNECTOR_DETAIL_PAGE_STATE;

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
      .select<AuthorityConnectorDetailPageState>(
        AuthorityConnectorDetailPageStateImpl,
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
