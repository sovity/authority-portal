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
import {Component, HostBinding, Inject} from '@angular/core';
import {DomSanitizer, SafeResourceUrl, Title} from '@angular/platform-browser';
import {APP_CONFIG, AppConfig} from 'src/app/core/services/config/app-config';

@Component({
  selector: 'app-mds-home',
  templateUrl: './home.component.html',
})
export class HomePageComponent {
  @HostBinding('class.flex-1')
  @HostBinding('class.flex')
  @HostBinding('class.items-stretch')
  cls = true;

  loaded = false;

  iframeUrl: SafeResourceUrl | null = null;

  constructor(
    @Inject(APP_CONFIG) public appConfig: AppConfig,
    private sanitizer: DomSanitizer,
    private titleService: Title,
  ) {
    this.titleService.setTitle('Home');
    if (this.appConfig.iframeUrl) {
      this.iframeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
        this.appConfig.iframeUrl,
      );
    }
  }
}
