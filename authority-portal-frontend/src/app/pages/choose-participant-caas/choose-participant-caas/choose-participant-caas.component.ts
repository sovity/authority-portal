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
import {Observable, Subject, switchMap, takeUntil} from 'rxjs';
import {CaasAvailabilityResponse} from '@sovity.de/authority-portal-client';
import {SelectionBoxModel} from 'src/app/shared/components/common/selection-box/selection-box.model';
import {ApiService} from '../../../core/api/api.service';
import {GlobalStateUtils} from '../../../core/global-state/global-state-utils';

@Component({
  selector: 'app-choose-participant-caas',
  templateUrl: './choose-participant-caas.component.html',
})
export class ChooseParticipantCaasComponent implements OnInit, OnDestroy {
  selectionBox: SelectionBoxModel = {
    title: 'Start Sponsored CaaS',
    subTitle: 'Managed EDC Connector to begin your journey in Data Spaces',
    icon: 'caas_logo.svg',
    bulletPoints: [
      '1st CaaS free for MDS participants',
      'Easiest access to Mobility Data Space',
      'Easiest access via web browser',
      'Hosted & maintained solution',
      '2 actively consumed data contracts included',
      'User & Access Management with 1 user',
    ],
    action: {
      label: 'Loading...',
      url: 'my-organization/connectors/new/provided',
      isLoading: true,
      isDisabled: true,
    },
  };
  private ngOnDestroy$ = new Subject();

  constructor(
    private apiService: ApiService,
    private globalStateUtils: GlobalStateUtils,
  ) {}

  ngOnInit() {
    this.fetchCaasLimits();
  }

  ngOnDestroy() {
    this.ngOnDestroy$.next(null);
    this.ngOnDestroy$.complete();
  }

  fetchCaasLimits() {
    this.globalStateUtils
      .getDeploymentEnvironmentId()
      .pipe(
        switchMap(
          (deploymentEnvironmentId): Observable<CaasAvailabilityResponse> =>
            this.apiService.checkFreeCaasUsage(deploymentEnvironmentId),
        ),
        takeUntil(this.ngOnDestroy$),
      )
      .subscribe((x) => {
        if (x.current === undefined || x.limit === undefined) {
          this.selectionBox.action = {
            label: 'Error loading CaaS limit',
            url: 'my-organization/connectors/new/provided',
            isDisabled: true,
          };
          return;
        }

        const isLimitReached = x.current >= x.limit;

        this.selectionBox.action = {
          label: `Request CaaS (${x.current}/${x.limit})`,
          url: 'my-organization/connectors/new/provided',
          isDisabled: isLimitReached,
          hint: isLimitReached
            ? 'The existing CaaS connector needs to be removed before requesting a new one'
            : '',
        };
      });
  }
}
