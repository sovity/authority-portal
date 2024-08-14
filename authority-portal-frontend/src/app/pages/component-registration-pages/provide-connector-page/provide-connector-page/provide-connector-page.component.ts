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
} from '../state/provide-connector-page-actions';
import {
  DEFAULT_PROVIDE_CONNECTOR_PAGE_STATE,
  ProvideConnectorPageState,
} from '../state/provide-connector-page-state';
import {ProvideConnectorPageStateImpl} from '../state/provide-connector-page-state-impl';
import {ProvideConnectorPageForm} from './provide-connector-page-form';

@Component({
  selector: 'app-provide-connector-page',
  templateUrl: './provide-connector-page.component.html',
  providers: [ProvideConnectorPageForm],
})
export class ProvideConnectorPageComponent implements OnInit, OnDestroy {
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
    public form: ProvideConnectorPageForm,
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
      .select<ProvideConnectorPageState>(ProvideConnectorPageStateImpl)
      .pipe(takeUntil(this.ngOnDestroy$))
      .subscribe((state) => {
        this.state = state;
      });
  }

  registerConnector(useJwks: boolean): void {
    if (useJwks) {
      this.form.certificateTab.disable();
    }

    const formValue = this.form.value;
    const organizationId = formValue.connectorTab.organization!.id;

    if (useJwks) {
      this.form.certificateTab.disable();

      this.store.dispatch(
        new Submit(
          {
            requestType: 'jwks',
            name: formValue.connectorTab.name,
            endpointUrl: formValue.connectorTab.endpointUrl,
            location: formValue.connectorTab.location,
            frontendUrl: formValue.connectorTab.frontendUrl,
            managementUrl: formValue.connectorTab.managementUrl,
            jwksUrl: formValue.connectorTab.jwksUrl,
          },
          organizationId,
          () => this.form.group.enable(),
          () => this.form.group.disable(),
          () => {
            setTimeout(() => {
              this.stepper.selectedIndex = 2;
              console.log('AsDASSDA');
            }, 50);
          },
        ),
      );
    } else {
      this.store.dispatch(
        new Submit(
          {
            requestType: 'certificate',
            name: formValue.connectorTab.name,
            endpointUrl: formValue.connectorTab.endpointUrl,
            location: formValue.connectorTab.location,
            frontendUrl: formValue.connectorTab.frontendUrl,
            managementUrl: formValue.connectorTab.managementUrl,
            certificate: formValue.connectorTab.useJwks
              ? formValue.certificateTab.ownCertificate
              : formValue.certificateTab.generatedCertificate,
          },
          organizationId,
          () => this.form.group.enable(),
          () => this.form.group.disable(),
          () => {
            setTimeout(() => {
              this.stepper.next();
              console.log('AABVBVBVNJNJVN');
            }, 50);
          },
        ),
      );
    }
  }

  ngOnDestroy() {
    this.ngOnDestroy$.next(null);
    this.ngOnDestroy$.complete();
  }
}
