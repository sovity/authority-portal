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
import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {Subject, takeUntil} from 'rxjs';
import {Store} from '@ngxs/store';
import {ConnectorDetailDto} from '@sovity.de/authority-portal-client';
import {getConnectorsTypeClasses} from 'src/app/core/utils/ui-utils';
import {ChildComponentInput} from 'src/app/shared/components/common/slide-over/slide-over.model';
import {TitleBarConfig} from 'src/app/shared/components/common/title-bar/title-bar.model';
import {DEFAULT_PARTICIPANT_OWN_CONNECTOR_DETAIL_PAGE_STATE} from '../../participant-own-connector-detail-page/state/participant-own-connector-detail-page-state';
import {DeleteProvidedConnector} from '../../sp-connector-list-page/state/sp-connector-list-page-actions';
import {
  RefreshConnector,
  SetConnectorId,
} from '../state/sp-connector-detail-page-actions';
import {
  DEFAULT_SP_CONNECTOR_DETAIL_PAGE_STATE,
  SpConnectorDetailPageState,
} from '../state/sp-connector-detail-page-state';
import {SpConnectorDetailPageStateImpl} from '../state/sp-connector-detail-page-state-impl';

@Component({
  selector: 'app-sp-connector-detail-page',
  templateUrl: './sp-connector-detail-page.component.html',
})
export class SpConnectorDetailPageComponent implements OnInit, OnDestroy {
  connectorId!: string;
  titleBarConfig!: TitleBarConfig;
  showModal = false;

  state = DEFAULT_SP_CONNECTOR_DETAIL_PAGE_STATE;

  private ngOnDestroy$ = new Subject();

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
    this.store
      .select<SpConnectorDetailPageState>(SpConnectorDetailPageStateImpl)
      .pipe(takeUntil(this.ngOnDestroy$))
      .subscribe((state) => {
        this.state = state;
        this.state.connector.ifReady((data) =>
          this.setupConnectorTitleBar(data),
        );
      });
  }

  setupConnectorTitleBar(connector: ConnectorDetailDto) {
    this.titleBarConfig = {
      title: connector.connectorName,
      icon: 'connector-2',
      status: connector.type,
      statusStyle: getConnectorsTypeClasses(connector.type),
      tabs: [],
      actionMenu: {
        id: 'actionMenu',
        menuOptions: [
          {
            label: 'Delete Connector',
            icon: 'delete',
            event: () => this.deleteConnector(),
            isDisabled: false,
          },
        ],
      },
    };
  }

  deleteConnector() {
    this.showModal = true;
  }

  confirmDeleteConnector() {
    this.store.dispatch(new DeleteProvidedConnector(this.connectorId));
    this.showModal = false;
  }

  cancelDeleteConnector() {
    this.showModal = false;
  }

  ngOnDestroy(): void {
    this.ngOnDestroy$.next(null);
    this.ngOnDestroy$.complete();
  }
}
