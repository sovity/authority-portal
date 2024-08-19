/*
 * Copyright (c) 2024 sovity GmbH
 *
 * This program and the accompanying materials are made available under the
 * terms of the Apache License, Version 2.0 which is available at
 * https://www.apache.org/licenses/LICENSE-2.0
 *
 * SPDX-License-Identifier: Apache-2.0
 *
 * Contributors:
 *      sovity GmbH - initial implementation
 */
import {Component, OnDestroy, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {Store} from '@ngxs/store';
import {
  ConnectorOverviewEntryDto,
  ConnectorTypeDto,
  UserRoleDto,
} from '@sovity.de/authority-portal-client';
import {GlobalStateUtils} from 'src/app/core/global-state/global-state-utils';
import {SlideOverService} from 'src/app/core/services/slide-over.service';
import {sliderOverNavigation} from 'src/app/core/utils/helper';
import {
  getConnectorsTypeClasses,
  getConnectorsTypeText,
} from 'src/app/core/utils/ui-utils';
import {FilterBarConfig} from 'src/app/shared/common/filter-bar/filter-bar.model';
import {HeaderBarConfig} from 'src/app/shared/common/header-bar/header-bar.model';
import {
  NavigationType,
  SlideOverAction,
  SlideOverConfig,
} from 'src/app/shared/common/slide-over/slide-over.model';
import {SpConnectorDetailPageComponent} from '../../sp-connector-detail-page/sp-connector-detail-page/sp-connector-detail-page.component';
import {
  CloseConnectorDetail,
  GetProvidedConnectors,
  ShowConnectorDetail,
} from '../state/sp-connector-list-page-actions';
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
  showDetail: boolean = false;
  slideOverConfig!: SlideOverConfig;
  componentToRender = SpConnectorDetailPageComponent;
  headerConfig!: HeaderBarConfig;
  filterBarConfig!: FilterBarConfig;

  getConnectorsTypeClasses = getConnectorsTypeClasses;

  private ngOnDestroy$ = new Subject();

  constructor(
    private store: Store,
    private globalStateUtils: GlobalStateUtils,
    private router: Router,
    private slideOverService: SlideOverService,
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
      title: 'Provided Connectors',
      subtitle:
        'List of connectors provided by you in your capacity as a Service Partner.',
      headerActions: [
        {
          label: 'Provide Connector',
          action: () =>
            this.router.navigate([
              'service-partner/provided-connectors/provide-connector',
            ]),
          permissions: [UserRoleDto.ServicePartnerAdmin],
        },
      ],
    };
  }

  refresh() {
    this.store.dispatch(GetProvidedConnectors);
  }

  startListeningToState() {
    this.store
      .select<SpConnectorListPageState>(SpConnectorListPageStateImpl)
      .pipe(takeUntil(this.ngOnDestroy$))
      .subscribe((state) => {
        this.state = state;
        this.showDetail = state.showDetail;
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

  configureConnector(connectorId: string) {
    this.router.navigate([
      `service-partner/provided-connectors/${connectorId}/configure-connector`,
    ]);
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
    this.slideOverService.setSlideOverConfig(this.slideOverConfig);
  }

  closeDetailPage() {
    this.store.dispatch(CloseConnectorDetail);
    this.slideOverService.slideOverReset();
  }

  openDetailPage(connector: ConnectorOverviewEntryDto) {
    this.slideOverConfig = {
      childComponentInput: {
        id: connector.id,
      },
      label: connector.name,
      icon: 'connector',
      showNavigation: this.state.connectors.data.length > 1,
      navigationType: NavigationType.STEPPER,
    };
    this.slideOverService.setSlideOverConfig(this.slideOverConfig);
    this.store.dispatch(ShowConnectorDetail);
  }

  ngOnDestroy(): void {
    this.closeDetailPage();
    this.ngOnDestroy$.next(null);
    this.ngOnDestroy$.complete();
  }

  protected readonly getConnectorsTypeText = getConnectorsTypeText;
  protected readonly ConnectorTypeDto = ConnectorTypeDto;
}
