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
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {Store} from '@ngxs/store';
import {ConnectorOverviewEntryDto} from '@sovity.de/authority-portal-client';
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
import {AuthorityConnectorDetailPageComponent} from '../../authority-connector-detail-page/authority-connector-detail-page/authority-connector-detail-page.component';
import {
  CloseConnectorDetail,
  GetConnectors,
  ShowConnectorDetail,
} from '../state/authority-connector-list-page-actions';
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
  state = DEFAULT_AUTHORITY_CONNECTOR_LIST_PAGE_STATE;
  showDetail: boolean = false;
  slideOverConfig!: SlideOverConfig;
  componentToRender = AuthorityConnectorDetailPageComponent;
  headerConfig!: HeaderBarConfig;
  filterBarConfig!: FilterBarConfig;
  frontendLinkClicked: boolean = false;

  getConnectorsTypeClasses = getConnectorsTypeClasses;

  constructor(
    private store: Store,
    private globalStateUtils: GlobalStateUtils,
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
      title: 'All Connectors',
      subtitle: 'All Connectors of all organizations',
      headerActions: [],
    };
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
    if (this.frontendLinkClicked) {
      this.frontendLinkClicked = false;
      return;
    }

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

  ngOnDestroy$ = new Subject();

  ngOnDestroy(): void {
    this.ngOnDestroy$.next(null);
    this.ngOnDestroy$.complete();
  }

  protected readonly getConnectorsTypeText = getConnectorsTypeText;
}
