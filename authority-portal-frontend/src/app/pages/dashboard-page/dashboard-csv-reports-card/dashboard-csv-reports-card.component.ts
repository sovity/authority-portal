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
import {Component, HostBinding, OnDestroy, OnInit} from '@angular/core';
import {Subject, takeUntil} from 'rxjs';
import {
  DeploymentEnvironmentDto,
  UserRoleDto,
} from '@sovity.de/authority-portal-client';
import {GlobalStateUtils} from '../../../core/global-state/global-state-utils';

export interface ReportLink {
  title: string;
  subTitle: string;
  url: string;
  roles: UserRoleDto[];
}

@Component({
  selector: 'app-dashboard-csv-reports-card',
  templateUrl: './dashboard-csv-reports-card.component.html',
})
export class DashboardCsvReportsCardComponent implements OnInit, OnDestroy {
  @HostBinding('class.border')
  @HostBinding('class.border-gray-100')
  @HostBinding('class.shadow')
  @HostBinding('class.rounded-xl')
  @HostBinding('class.p-6')
  cls = true;

  reportLinks: ReportLink[] = [];

  constructor(private globalStateUtils: GlobalStateUtils) {}

  ngOnInit(): void {
    this.startListeningToState();
  }

  startListeningToState(): void {
    this.globalStateUtils.deploymentEnvironment$
      .pipe(takeUntil(this.ngOnDestroy$))
      .subscribe((env) => {
        this.reportLinks = this.buildReportLinks(env);
      });
  }

  buildReportLinks(env: DeploymentEnvironmentDto): ReportLink[] {
    return [
      {
        title: `Connectors`,
        subTitle: '.csv',
        url: `/api/reporting/connectors?environmentId=${env.environmentId}`,
        roles: ['USER'],
      },
      {
        title: `Data Offers Report`,
        subTitle: '.csv',
        url: `/api/reporting/data-offers?environmentId=${env.environmentId}`,
        roles: ['USER'],
      },
      {
        title: `System Stability Report`,
        subTitle: '.csv',
        url: `/api/reporting/system-stability?environmentId=${env.environmentId}`,
        roles: ['USER'],
      },
      {
        title: 'Users and Roles Report',
        subTitle: '.csv',
        url: '/api/reporting/users',
        roles: ['AUTHORITY_ADMIN', 'AUTHORITY_USER'],
      },
    ];
  }

  ngOnDestroy$ = new Subject();

  ngOnDestroy(): void {
    this.ngOnDestroy$.next(null);
    this.ngOnDestroy$.complete();
  }
}
