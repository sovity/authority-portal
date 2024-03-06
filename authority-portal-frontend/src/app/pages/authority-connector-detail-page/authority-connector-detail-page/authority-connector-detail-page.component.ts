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
import {Component, HostBinding, Inject, OnDestroy, OnInit} from '@angular/core';
import {Subject, takeUntil} from 'rxjs';
import {Store} from '@ngxs/store';
import {
  ConnectorDetailDto,
  UserInfo,
  UserRoleDto,
} from '@sovity.de/authority-portal-client';
import {GlobalStateUtils} from 'src/app/core/global-state/global-state-utils';
import {
  getConnectorStatusText,
  getConnectorsTypeClasses,
} from 'src/app/core/utils/ui-utils';
import {ChildComponentInput} from 'src/app/shared/components/common/slide-over/slide-over.model';
import {
  ActionMenu,
  TitleBarConfig,
} from 'src/app/shared/components/common/title-bar/title-bar.model';
import {DeleteConnector} from '../../authority-connector-list-page/state/authority-connector-list-page-actions';
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
  userInfo?: UserInfo;

  state = DEFAULT_AUTHORITY_CONNECTOR_DETAIL_PAGE_STATE;
  getConnectorsTypeClasses = getConnectorsTypeClasses;
  getConnectorStatusText = getConnectorStatusText;

  constructor(
    private store: Store,
    @Inject('childComponentInput') childComponentInput: ChildComponentInput,
    private clipboard: Clipboard,
    private globalStateUtils: GlobalStateUtils,
  ) {
    this.connectorId = childComponentInput.id;
  }

  ngOnInit() {
    this.store.dispatch(new SetConnectorId(this.connectorId));
    this.store.dispatch(RefreshConnector);

    this.startListeningToUserInfo();
    this.startListeningToState();
  }

  private startListeningToUserInfo() {
    this.globalStateUtils.userInfo$
      .pipe(takeUntil(this.ngOnDestroy$))
      .subscribe((userInfo) => {
        this.userInfo = userInfo;
      });
  }

  private startListeningToState() {
    this.store
      .select<AuthorityConnectorDetailPageState>(
        AuthorityConnectorDetailPageStateImpl,
      )
      .pipe(takeUntil(this.ngOnDestroy$))
      .subscribe((state) => {
        this.state = state;
        let actionMenu: ActionMenu = {
          id: 'actionMenu',
          menuOptions: [
            {
              label: 'Delete Connector',
              icon: 'delete',
              event: () => this.deleteConnectorMenuItemClick(),
              isDisabled:
                !this.userInfo?.roles.includes(UserRoleDto.OperatorAdmin) ??
                true,
            },
          ],
        };
        this.state.connector.ifReady((data) =>
          this.setupConnectorTitleBar(data, actionMenu),
        );
      });
  }

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

  copyToClipboard(s: string | undefined) {
    if (s) {
      this.clipboard.copy(s);
    }
  }

  cancelDeleteConnector() {
    this.showModal = false;
  }

  confirmDeleteConnector() {
    this.showModal = false;
    this.store.dispatch(new DeleteConnector(this.connectorId));
  }

  deleteConnectorMenuItemClick() {
    this.showModal = true;
  }

  ngOnDestroy$ = new Subject();

  ngOnDestroy(): void {
    this.ngOnDestroy$.next(null);
    this.ngOnDestroy$.complete();
  }
}
