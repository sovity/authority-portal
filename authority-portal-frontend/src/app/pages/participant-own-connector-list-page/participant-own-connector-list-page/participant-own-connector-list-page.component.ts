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
import {Subject, interval} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {Store} from '@ngxs/store';
import {
  ConnectorOverviewEntryDto,
  UserRoleDto,
} from '@sovity.de/authority-portal-client';
import {GlobalStateUtils} from 'src/app/core/global-state/global-state-utils';
import {SlideOverService} from 'src/app/core/services/slide-over.service';
import {sliderOverNavigation} from 'src/app/core/utils/helper';
import {getConnectorsTypeClasses} from 'src/app/core/utils/ui-utils';
import {FilterBarConfig} from 'src/app/shared/common/filter-bar/filter-bar.model';
import {HeaderBarConfig} from 'src/app/shared/common/header-bar/header-bar.model';
import {
  NavigationType,
  SlideOverAction,
  SlideOverConfig,
} from 'src/app/shared/common/slide-over/slide-over.model';
import {ParticipantOwnConnectorDetailPageComponent} from '../../participant-own-connector-detail-page/participant-own-connector-detail-page/participant-own-connector-detail-page.component';
import {RefreshConnectorSilent} from '../../participant-own-connector-detail-page/state/participant-own-connector-detail-page-actions';
import {
  CloseConnectorDetail,
  GetOwnOrganizationConnectors,
  GetOwnOrganizationConnectorsSilent,
  ShowConnectorDetail,
} from '../state/participant-own-connector-list-page-actions';
import {
  DEFAULT_PARTICIPANT_OWN_CONNECTOR_LIST_PAGE_STATE,
  ParticipantOwnConnectorListPageState,
} from '../state/participant-own-connector-list-page-state';
import {ParticipantOwnConnectorListPageStateImpl} from '../state/participant-own-connector-list-page-state-impl';

@Component({
  selector: 'app-participant-own-connector-list-page',
  templateUrl: './participant-own-connector-list-page.component.html',
})
export class ParticipantOwnConnectorListPageComponent
  implements OnInit, OnDestroy
{
  state = DEFAULT_PARTICIPANT_OWN_CONNECTOR_LIST_PAGE_STATE;
  showDetail: boolean = false;
  slideOverConfig!: SlideOverConfig;
  componentToRender = ParticipantOwnConnectorDetailPageComponent;
  headerConfig!: HeaderBarConfig;
  filterBarConfig!: FilterBarConfig;
  frontendLinkClicked: boolean = false;

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
      title: 'Connectors',
      subtitle: 'List of all connectors of your organization',
      headerActions: [
        {
          label: 'Add Connector',
          action: () =>
            this.router.navigate(['/my-organization/connectors/new']),
          permissions: [UserRoleDto.KeyUser],
        },
      ],
    };
  }

  refresh() {
    this.store.dispatch(GetOwnOrganizationConnectors);

    interval(5000)
      .pipe(takeUntil(this.ngOnDestroy$))
      .subscribe(() => {
        this.store.dispatch(GetOwnOrganizationConnectorsSilent);
        if (this.state.showDetail) {
          this.store.dispatch(RefreshConnectorSilent);
        }
      });
  }

  private startListeningToState() {
    this.store
      .select<ParticipantOwnConnectorListPageState>(
        ParticipantOwnConnectorListPageStateImpl,
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

  ngOnDestroy(): void {
    this.closeDetailPage();
    this.ngOnDestroy$.next(null);
    this.ngOnDestroy$.complete();
  }
}
