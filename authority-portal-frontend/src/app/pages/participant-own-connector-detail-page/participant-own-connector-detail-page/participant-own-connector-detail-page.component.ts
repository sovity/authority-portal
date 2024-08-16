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
import {Clipboard} from '@angular/cdk/clipboard';
import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {
  Subject,
  distinctUntilChanged,
  map,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs';
import {Store} from '@ngxs/store';
import {GlobalStateUtils} from 'src/app/core/global-state/global-state-utils';
import {
  getConnectorStatusText,
  getConnectorsTypeClasses,
  getConnectorsTypeText,
} from 'src/app/core/utils/ui-utils';
import {TitleBarConfig} from 'src/app/shared/common/portal-layout/title-bar/title-bar.model';
import {ChildComponentInput} from 'src/app/shared/common/slide-over/slide-over.model';
import {DeleteOwnConnector} from '../../participant-own-connector-list-page/state/participant-own-connector-list-page-actions';
import {
  RefreshConnector,
  SetConnectorId,
} from '../state/participant-own-connector-detail-page-actions';
import {
  DEFAULT_PARTICIPANT_OWN_CONNECTOR_DETAIL_PAGE_STATE,
  ParticipantOwnConnectorDetailPageState,
} from '../state/participant-own-connector-detail-page-state';
import {ParticipantOwnConnectorDetailPageStateImpl} from '../state/participant-own-connector-detail-page-state-impl';

@Component({
  selector: 'app-participant-own-connector-detail-page',
  templateUrl: './participant-own-connector-detail-page.component.html',
})
export class ParticipantOwnConnectorDetailPageComponent
  implements OnInit, OnDestroy
{
  connectorId!: string;
  titleBarConfig!: TitleBarConfig;
  showModal = false;

  state = DEFAULT_PARTICIPANT_OWN_CONNECTOR_DETAIL_PAGE_STATE;

  getConnectorsTypeClasses = getConnectorsTypeClasses;
  getConnectorStatusText = getConnectorStatusText;

  private ngOnDestroy$ = new Subject();

  constructor(
    private store: Store,
    @Inject('childComponentInput') childComponentInput: ChildComponentInput,
    private globalStateUtils: GlobalStateUtils,
    private clipboard: Clipboard,
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
      .select<ParticipantOwnConnectorDetailPageState>(
        ParticipantOwnConnectorDetailPageStateImpl,
      )
      .pipe(
        takeUntil(this.ngOnDestroy$),
        tap((state) => (this.state = state)),
        switchMap(() => {
          return this.globalStateUtils.userRoles$.pipe(
            map((roles) => roles.has('KEY_USER')),
            distinctUntilChanged(),
          );
        }),
      )
      .subscribe((hasRole) => {
        this.state.connector.ifReady((data) => {
          this.titleBarConfig = {
            title: data.connectorName,
            icon: 'connector-2',
            status: getConnectorsTypeText(data.type),
            statusStyle: this.getConnectorsTypeClasses(data.type),
            tabs: [],
            actionMenu: hasRole
              ? {
                  id: 'actionMenu',
                  menuOptions: [
                    {
                      label: 'Delete Connector',
                      icon: 'delete',
                      event: () => this.deleteConnector(),
                      isDisabled: false,
                    },
                  ],
                }
              : undefined,
          };
        });
      });
  }

  deleteConnector() {
    this.showModal = true;
  }

  confirmDeleteConnector() {
    this.store.dispatch(new DeleteOwnConnector(this.connectorId));
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
