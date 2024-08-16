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
import {
  Component,
  HostBinding,
  Inject,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import {MatStepper} from '@angular/material/stepper';
import {Router} from '@angular/router';
import {Subject, takeUntil} from 'rxjs';
import {Store} from '@ngxs/store';
import {UserInfo} from '@sovity.de/authority-portal-client';
import {GlobalStateUtils} from 'src/app/core/global-state/global-state-utils';
import {APP_CONFIG, AppConfig} from 'src/app/core/services/config/app-config';
import {
  GetOrganizations,
  Reset,
  Submit,
} from '../state/reserve-provided-connector-page-actions';
import {
  DEFAULT_RESERVE_PROVIDED_CONNECTOR_PAGE_STATE,
  ReserveProvidedConnectorPageState,
} from '../state/reserve-provided-connector-page-state';
import {ReserveProvidedConnectorPageStateImpl} from '../state/reserve-provided-connector-page-state-impl';
import {ReserveProvidedConnectorPageForm} from './reserve-provided-connector-page-form';

@Component({
  selector: 'app-reserve-provided-connector-page',
  templateUrl: './reserve-provided-connector-page.component.html',
  providers: [ReserveProvidedConnectorPageForm],
})
export class ReserveProvidedConnectorPageComponent
  implements OnInit, OnDestroy
{
  @HostBinding('class.overflow-y-auto')
  cls = true;
  state = DEFAULT_RESERVE_PROVIDED_CONNECTOR_PAGE_STATE;
  userInfo!: UserInfo;

  exitLink = '/service-partner/provided-connectors';

  @ViewChild('stepper') stepper!: MatStepper;

  private ngOnDestroy$ = new Subject();

  constructor(
    @Inject(APP_CONFIG) public appConfig: AppConfig,
    private store: Store,
    public form: ReserveProvidedConnectorPageForm,
    private globalStateUtils: GlobalStateUtils,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.store.dispatch(GetOrganizations);
    this.store.dispatch(Reset);
    this.startListeningToState();
    this.getUserInfo();
  }

  getUserInfo() {
    this.globalStateUtils.userInfo$
      .pipe(takeUntil(this.ngOnDestroy$))
      .subscribe((userInfo: UserInfo) => {
        this.userInfo = userInfo;
      });
  }

  private startListeningToState() {
    this.store
      .select<ReserveProvidedConnectorPageState>(
        ReserveProvidedConnectorPageStateImpl,
      )
      .pipe(takeUntil(this.ngOnDestroy$))
      .subscribe((state) => {
        this.state = state;
      });
  }

  reserveConnector(): void {
    const formValue = this.form.value;
    const organizationId = formValue.connectorInfo.organization!.id;

    this.store.dispatch(
      new Submit(
        formValue,
        organizationId,
        () => this.form.group.enable(),
        () => this.form.group.disable(),
        () => {
          setTimeout(() => {
            this.router.navigate(['/service-partner/provided-connectors']);
          }, 200);
        },
      ),
    );
  }

  ngOnDestroy() {
    this.ngOnDestroy$.next(null);
    this.ngOnDestroy$.complete();
  }
}
