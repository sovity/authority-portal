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
import {Subject, interval} from 'rxjs';
import {Store} from '@ngxs/store';
import {APP_CONFIG, AppConfig} from 'src/app/core/services/config/app-config';
import {GlobalState} from './core/global-state/global-state';
import {RefreshUserInfo} from './core/global-state/global-state-actions';
import {GlobalStateImpl} from './core/global-state/global-state-impl';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit, OnDestroy {
  state!: GlobalState;
  favicon: HTMLLinkElement | null = document.querySelector("link[rel*='icon']");

  private ngOnDestroy$ = new Subject();

  constructor(
    @Inject(APP_CONFIG) public appConfig: AppConfig,
    private store: Store,
  ) {}

  ngOnInit() {
    this.startListeningToGlobalState();
    this.startPollingUserInfo();
    this.setFavicon();
  }

  private setFavicon() {
    if (!this.favicon) {
      this.favicon = document.createElement('link');
      this.favicon.rel = 'icon';
      document.head.appendChild(this.favicon);
    }
    this.favicon.href = this.appConfig.brandFaviconSrc;
  }

  private startListeningToGlobalState() {
    this.store.select<GlobalState>(GlobalStateImpl).subscribe((state) => {
      this.state = state;
    });
  }

  ngOnDestroy(): void {
    this.ngOnDestroy$.next(null);
    this.ngOnDestroy$.complete();
  }

  private startPollingUserInfo() {
    this.store.dispatch(RefreshUserInfo);
    interval(3000).subscribe(() => this.store.dispatch(RefreshUserInfo));
  }
}
