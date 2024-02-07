import {Component, HostBinding, Inject, OnDestroy, OnInit} from '@angular/core';
import {Subject, takeUntil} from 'rxjs';
import {Store} from '@ngxs/store';
import {ConnectorDetailDto} from '@sovity.de/authority-portal-client';
import {getConnectorsTypeClasses} from 'src/app/core/utils/ui-utils';
import {ChildComponentInput} from 'src/app/shared/components/common/slide-over/slide-over.model';
import {
  ActionMenu,
  TitleBarConfig,
} from 'src/app/shared/components/common/title-bar/title-bar.model';
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
  connectorId!: string;
  titleBarConfig!: TitleBarConfig;
  showModal = false;

  state = DEFAULT_AUTHORITY_CONNECTOR_DETAIL_PAGE_STATE;
  getConnectorsTypeClasses = getConnectorsTypeClasses;

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
    let actionMenu: ActionMenu = {
      id: 'actionMenu',
      menuOptions: [],
    };
    this.store
      .select<AuthorityConnectorDetailPageState>(
        AuthorityConnectorDetailPageStateImpl,
      )
      .pipe(takeUntil(this.ngOnDestroy$))
      .subscribe((state) => {
        this.state = state;
        this.setupConnectorTitleBar(this.state.connector.data, actionMenu);
      });
  }

  /**
   * initialize the title bar component based on organization details
   * @param organization
   */
  setupConnectorTitleBar(
    connector: ConnectorDetailDto,
    actionMenu?: ActionMenu,
  ) {
    this.titleBarConfig = {
      title: connector.connectorName,
      icon: 'connector-2',
      status: connector.type,
      statusStyle: this.getConnectorsTypeClasses(connector.type),
      tabs: [],
    };
    if (actionMenu) this.titleBarConfig.actionMenu = actionMenu;
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
