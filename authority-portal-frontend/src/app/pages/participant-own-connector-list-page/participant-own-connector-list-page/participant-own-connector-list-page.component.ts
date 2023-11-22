import {Component, OnDestroy, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {Store} from '@ngxs/store';
import {
  ConnectorOverviewEntryDto,
  UserRoleDto,
} from '@sovity.de/authority-portal-client';
import {GlobalStateUtils} from 'src/app/core/global-state/global-state-utils';
import {sliderOverNavigation} from 'src/app/core/utils/helper';
import {FilterBarConfig} from 'src/app/shared/components/common/filter-bar/filter-bar.model';
import {HeaderBarConfig} from 'src/app/shared/components/common/header-bar/header-bar.model';
import {
  SlideOverAction,
  SlideOverConfig,
} from 'src/app/shared/components/common/slide-over/slide-over.model';
import {ParticipantOwnConnectorDetailPageComponent} from '../../participant-own-connector-detail-page/participant-own-connector-detail-page/participant-own-connector-detail-page.component';
import {
  DeleteOwnConnector,
  GetOwnOrganizationConnectors,
} from '../state/participant-own-connector-list-page-actions';
import {
  DEFAULT_PARTICIPANT_OWN_CONNECTOR_LIST_PAGE_STATE,
  ParticipantOwnConnectorListPageState,
} from '../state/participant-own-connector-list-page-state';
import {ParticipantOwnConnectorListPageStateImpl} from '../state/participant-own-connector-list-page-state-impl';
import {ParticipantOwnConnectorListHeaderActions} from './participant-own-connector-list-page.model';

@Component({
  selector: 'app-participant-own-connector-list-page',
  templateUrl: './participant-own-connector-list-page.component.html',
})
export class ParticipantOwnConnectorListPageComponent
  implements OnInit, OnDestroy
{
  state = DEFAULT_PARTICIPANT_OWN_CONNECTOR_LIST_PAGE_STATE;
  connectorToDelete = '';
  showDetail: boolean = false;
  slideOverConfig!: SlideOverConfig;
  componentToRender = ParticipantOwnConnectorDetailPageComponent;
  headerConfig!: HeaderBarConfig;
  filterBarConfig!: FilterBarConfig;

  showModal = false;

  constructor(
    private store: Store,
    private globalStateUtils: GlobalStateUtils,
    private router: Router,
  ) {}

  ngOnInit() {
    this.initializeHeaderBar();
    this.initializeFilterBar();
    this.refresh();
    this.startListeningToState();
    this.startRefreshingOnEnvChange();
  }

  initializeFilterBar() {
    this.filterBarConfig = {
      filters: [
        {
          id: 'type',
          label: 'Type',
          icon: 'tag',
          type: 'MULTISELECT',
          options: [],
        },
        {
          id: 'status',
          label: 'Status',
          type: 'SELECT',
          icon: 'status',
          options: [],
        },
      ],
    };
  }

  initializeHeaderBar() {
    this.headerConfig = {
      title: 'Connectors',
      subtitle: 'List of all connectors of your organization',
      headerActions: [
        {
          label: 'Provide Connector',
          action: ParticipantOwnConnectorListHeaderActions.PROVIDE_CONNECTOR,
          permissions: [
            UserRoleDto.AuthorityAdmin,
            UserRoleDto.ServicePartnerAdmin,
          ],
        },
        {
          label: 'Add Connector',
          action: ParticipantOwnConnectorListHeaderActions.ADD_CONNECTOR,
          permissions: [UserRoleDto.ParticipantCurator],
        },
      ],
    };
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

  headerActionHandler(action: string) {
    switch (action) {
      case ParticipantOwnConnectorListHeaderActions.ADD_CONNECTOR: {
        this.router.navigate(['/my-organization/connectors/registration']);
        break;
      }
      case ParticipantOwnConnectorListHeaderActions.PROVIDE_CONNECTOR: {
        this.router.navigate(['my-organization/connectors/provide-connector']);
        break;
      }
    }
  }

  handleFilter(filterQuery: any) {
    //TODO:implement filter handler
  }

  handleNavigation(direction: SlideOverAction, currentConnectorId: string) {
    let totalConnectors = this.state.connectors.data.length;
    let currentIndex = this.state.connectors.data.findIndex(
      (connector) => connector.id === currentConnectorId,
    );
    let nextIndex = sliderOverNavigation(
      direction,
      currentIndex,
      totalConnectors,
    );

    this.slideOverConfig = {
      ...this.slideOverConfig,
      childComponentInput: {
        id: this.state.connectors.data[nextIndex].id,
      },
      label: this.state.connectors.data[nextIndex].name,
    };
  }

  closeDetailPage() {
    this.showDetail = false;
  }

  openDetailPage(connector: ConnectorOverviewEntryDto) {
    this.slideOverConfig = {
      childComponentInput: {
        id: connector.id,
      },
      label: connector.name,
      icon: 'connector',
      showNavigation: this.state.connectors.data.length > 1,
    };
    this.showDetail = true;
  }

  ngOnDestroy$ = new Subject();

  ngOnDestroy(): void {
    this.ngOnDestroy$.next(null);
    this.ngOnDestroy$.complete();
  }
}
