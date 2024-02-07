import {Component, HostBinding, OnDestroy, OnInit} from '@angular/core';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {Store} from '@ngxs/store';
import {CentralComponentDto} from '@sovity.de/authority-portal-client';
import {GlobalStateUtils} from 'src/app/core/global-state/global-state-utils';
import {
  ConfirmDeleteCentralComponent,
  DismissDeleteCentralComponentModal,
  RefreshCentralComponents,
  ShowDeleteCentralComponentModal,
} from '../state/central-component-list-page-actions';
import {
  CentralComponentListPageState,
  DEFAULT_CENTRAL_COMPONENT_LIST_PAGE_STATE,
} from '../state/central-component-list-page-state';
import {CentralComponentListPageStateImpl} from '../state/central-component-list-page-state-impl';

@Component({
  selector: 'app-central-component-list-page',
  templateUrl: './central-component-list-page.component.html',
})
export class CentralComponentListPageComponent implements OnInit, OnDestroy {
  @HostBinding('class.overflow-y-auto')
  @HostBinding('class.overflow-x-hidden')
  cls = true;

  state = DEFAULT_CENTRAL_COMPONENT_LIST_PAGE_STATE;

  private ngOnDestroy$ = new Subject();

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
    this.store.dispatch(RefreshCentralComponents);
  }

  showDeleteModal(centralComponent: CentralComponentDto) {
    this.store.dispatch(new ShowDeleteCentralComponentModal(centralComponent));
  }

  confirmDeleteModal() {
    this.store.dispatch(new ConfirmDeleteCentralComponent());
  }

  dismissDeleteModal() {
    this.store.dispatch(new DismissDeleteCentralComponentModal());
  }

  private startListeningToState() {
    this.store
      .select<CentralComponentListPageState>(CentralComponentListPageStateImpl)
      .pipe(takeUntil(this.ngOnDestroy$))
      .subscribe((state) => {
        this.state = state;
      });
  }

  private startRefreshingOnEnvChange() {
    this.globalStateUtils.onDeploymentEnvironmentChangeSkipFirst({
      ngOnDestroy$: this.ngOnDestroy$,
      onChanged: () => {
        this.refresh();
      },
    });
  }

  ngOnDestroy(): void {
    this.ngOnDestroy$.next(null);
    this.ngOnDestroy$.complete();
  }
}
