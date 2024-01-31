import {Component, HostBinding, OnDestroy, OnInit} from '@angular/core';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {Store} from '@ngxs/store';
import {GlobalStateUtils} from 'src/app/core/global-state/global-state-utils';
import {GetConnectors} from '../state/authority-connector-list-page-actions';
import {
  AuthorityConnectorListPageState,
  DEFAULT_AUTHORITY_CONNECTOR_LIST_PAGE_STATE,
} from '../state/authority-connector-list-page-state';
import {AuthorityConnectorListPageStateImpl} from '../state/authority-connector-list-page-state-impl';

@Component({
  selector: 'app-authority-connector-list-page',
  templateUrl: './authority-connector-list-page.component.html',
})
export class AuthorityConnectorListPageComponent implements OnInit, OnDestroy {
  @HostBinding('class.overflow-y-auto')
  @HostBinding('class.overflow-x-hidden')
  cls = true;

  state = DEFAULT_AUTHORITY_CONNECTOR_LIST_PAGE_STATE;
  connectorToDelete = '';

  constructor(
    private store: Store,
    private globalStateUtils: GlobalStateUtils,
  ) {}

  ngOnInit() {
    this.refresh();
    this.startListeningToState();
    this.startRefreshingOnEnvChange();
  }

  refresh() {
    this.store.dispatch(GetConnectors);
  }

  private startListeningToState() {
    this.store
      .select<AuthorityConnectorListPageState>(
        AuthorityConnectorListPageStateImpl,
      )
      .pipe(takeUntil(this.ngOnDestroy$))
      .subscribe((state) => {
        this.state = state;
      });
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
