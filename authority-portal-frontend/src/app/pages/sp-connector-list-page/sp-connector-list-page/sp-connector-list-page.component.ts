import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {Store} from '@ngxs/store';
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
      .select<SpConnectorListPageState>(SpConnectorListPageStateImpl)
      .pipe(takeUntil(this.ngOnDestroy$))
      .subscribe((state) => {
        this.state = state;
      });
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
