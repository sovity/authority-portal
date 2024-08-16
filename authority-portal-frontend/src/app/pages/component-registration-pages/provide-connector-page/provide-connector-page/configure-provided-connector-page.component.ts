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
import {GlobalStateUtils} from 'src/app/core/global-state/global-state-utils';
import {APP_CONFIG, AppConfig} from 'src/app/core/services/config/app-config';
import {
  GetOrganizations,
  Reset,
  Submit,
} from '../state/configure-provided-connector-page-actions';
import {
  ConfigureProvidedConnectorPageState,
  DEFAULT_PROVIDE_CONNECTOR_PAGE_STATE,
} from '../state/configure-provided-connector-page-state';
import {ConfigureProvidedConnectorPageStateImpl} from '../state/configure-provided-connector-page-state-impl';
import {ConfigureProvidedConnectorPageForm} from './configure-provided-connector-page-form.service';

@Component({
  selector: 'app-provide-connector-page',
  templateUrl: './configure-provided-connector-page.component.html',
  providers: [ConfigureProvidedConnectorPageForm],
})
export class ConfigureProvidedConnectorPageComponent
  implements OnInit, OnDestroy
{
  @HostBinding('class.overflow-y-auto')
  cls = true;
  state = DEFAULT_PROVIDE_CONNECTOR_PAGE_STATE;
  userInfo!: UserInfo;

  createActionName = 'Provide Connector';
  exitLink = '/service-partner/provided-connectors';

  @ViewChild('stepper') stepper!: MatStepper;

  private ngOnDestroy$ = new Subject();

  constructor(
    @Inject(APP_CONFIG) public appConfig: AppConfig,
    private store: Store,
    public form: ConfigureProvidedConnectorPageForm,
    private globalStateUtils: GlobalStateUtils,
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
      .select<ConfigureProvidedConnectorPageState>(
        ConfigureProvidedConnectorPageStateImpl,
      )
      .pipe(takeUntil(this.ngOnDestroy$))
      .subscribe((state) => {
        this.state = state;
      });
  }

  registerConnector(registrationType: 'certificate' | 'jwks'): void {
    if (registrationType === 'jwks') {
      this.form.certificateTab.disable();
    }

    const formValue = this.form.value;
    const organizationId = formValue.connectorTab.organization!.id;

    this.store.dispatch(
      new Submit(
        formValue,
        organizationId,
        () => this.form.group.enable(),
        () => this.form.group.disable(),
        () => {
          setTimeout(() => {
            formValue.connectorTab.useJwks
              ? (this.stepper.selectedIndex = 2)
              : this.stepper.next();
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
