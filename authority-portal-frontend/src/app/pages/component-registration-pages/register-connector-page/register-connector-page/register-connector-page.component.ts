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
import {Subject, takeUntil} from 'rxjs';
import {Store} from '@ngxs/store';
import {UserInfo} from '@sovity.de/authority-portal-client';
import {APP_CONFIG, AppConfig} from 'src/app/core/config/app-config';
import {GlobalStateUtils} from 'src/app/core/global-state/global-state-utils';
import {Reset, Submit} from '../state/register-connector-page-actions';
import {
  DEFAULT_REGISTER_CONNECTOR_PAGE_STATE,
  RegisterConnectorPageState,
} from '../state/register-connector-page-state';
import {RegisterConnectorPageStateImpl} from '../state/register-connector-page-state-impl';
import {RegisterConnectorPageForm} from './register-connector-page-form';

@Component({
  selector: 'app-register-connector-page',
  templateUrl: './register-connector-page.component.html',
  providers: [RegisterConnectorPageForm],
})
export class RegisterConnectorPageComponent implements OnInit, OnDestroy {
  @HostBinding('class.overflow-y-auto')
  cls = true;
  state = DEFAULT_REGISTER_CONNECTOR_PAGE_STATE;
  userInfo!: UserInfo;

  createActionName = 'Register Connector';
  backLink = '/my-organization/connectors/new';
  exitLink = '/my-organization/connectors';

  @ViewChild('stepper') stepper!: MatStepper;

  private ngOnDestroy$ = new Subject();

  constructor(
    @Inject(APP_CONFIG) public config: AppConfig,
    private store: Store,
    public form: RegisterConnectorPageForm,
    private globalStateUtils: GlobalStateUtils,
  ) {}

  ngOnInit(): void {
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
      .select<RegisterConnectorPageState>(RegisterConnectorPageStateImpl)
      .pipe(takeUntil(this.ngOnDestroy$))
      .subscribe((state) => {
        this.state = state;
      });
  }

  registerConnector(): void {
    const formValue = this.form.value;
    this.store.dispatch(
      new Submit(
        {
          name: formValue.connectorTab.name,
          endpointUrl: formValue.connectorTab.endpointUrl,
          location: formValue.connectorTab.location,
          frontendUrl: formValue.connectorTab.frontendUrl,
          managementUrl: formValue.connectorTab.managementUrl,
          certificate: formValue.certificateTab.bringOwnCert
            ? formValue.certificateTab.ownCertificate
            : formValue.certificateTab.generatedCertificate,
        },
        () => this.form.group.enable(),
        () => this.form.group.disable(),
        () => this.stepper.next(),
      ),
    );
  }

  ngOnDestroy() {
    this.ngOnDestroy$.next(null);
    this.ngOnDestroy$.complete();
  }
}
