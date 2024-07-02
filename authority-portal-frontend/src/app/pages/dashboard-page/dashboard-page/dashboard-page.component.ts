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
import {Subject} from 'rxjs';
import {map, switchMap, takeUntil} from 'rxjs/operators';
import {
  ComponentStatusOverview,
  UptimeStatusDto,
} from '@sovity.de/authority-portal-client';
import {ApiService} from 'src/app/core/api/api.service';
import {GlobalStateUtils} from 'src/app/core/global-state/global-state-utils';
import {APP_CONFIG, AppConfig} from 'src/app/core/services/config/app-config';
import {Fetched} from 'src/app/core/utils/fetched';
import {HeaderBarConfig} from 'src/app/shared/common/header-bar/header-bar.model';
import {ConnectorData} from '../dashboard-connector-card/dashboard-connector-card.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard-page.component.html',
})
export class DashboardPageComponent implements OnInit, OnDestroy {
  headerConfig: HeaderBarConfig = {
    title: 'Dashboard',
    subtitle: 'Uptime statistics of components',
    headerActions: [],
  };
  dapsData: Fetched<UptimeStatusDto | undefined> = Fetched.empty();
  loggingHouseData: Fetched<UptimeStatusDto | undefined> = Fetched.empty();
  connectorData: Fetched<ConnectorData> = Fetched.empty();

  constructor(
    @Inject(APP_CONFIG) public appConfig: AppConfig,
    private globalStateUtils: GlobalStateUtils,
    private apiService: ApiService,
  ) {}

  ngOnInit(): void {
    this.fetchDashboardPageData();
  }

  fetchDashboardPageData() {
    this.globalStateUtils.deploymentEnvironment$
      .pipe(
        map((it) => it.environmentId),
        switchMap((deploymentEnvironmentId) =>
          this.apiService.getComponentStatus(deploymentEnvironmentId).pipe(
            Fetched.wrap({
              failureMessage: 'Failed fetching dashboard data',
            }),
          ),
        ),
        takeUntil(this.ngOnDestroy$),
      )
      .subscribe(
        (componentStatusOverview: Fetched<ComponentStatusOverview>) => {
          this.dapsData = componentStatusOverview.map((x) => x.dapsStatus);
          this.loggingHouseData = componentStatusOverview.map(
            (x) => x.loggingHouseStatus,
          );
          this.connectorData = componentStatusOverview.map((x) => ({
            numOnline: x.onlineConnectors,
            numDisturbed: x.disturbedConnectors,
            numOffline: x.offlineConnectors,
          }));
        },
      );
  }

  private ngOnDestroy$ = new Subject();
  ngOnDestroy(): void {
    this.ngOnDestroy$.next(null);
    this.ngOnDestroy$.complete();
  }
}
