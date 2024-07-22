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
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';
import {Router} from '@angular/router';
import {UrlBeforeLoginService} from 'src/app/core/global-state/routes/url-before-login.service';
import {APP_CONFIG, AppConfig} from 'src/app/core/services/config/app-config';

@Component({
  selector: 'app-mds-home',
  templateUrl: './mds-home.component.html',
})
export class MdsHomePageComponent {
  @HostBinding('class.flex-1')
  @HostBinding('class.flex')
  @HostBinding('class.items-stretch')
  cls = true;

  loaded = false;

  iframeUrl: SafeResourceUrl | null = null;

  constructor(
    @Inject(APP_CONFIG) public appConfig: AppConfig,
    private sanitizer: DomSanitizer,
    private urlBeforeLoginService: UrlBeforeLoginService,
    private router: Router,
  ) {
    console.log('originalUrl', this.urlBeforeLoginService.originalUrl);

    if (this.urlBeforeLoginService.originalUrl != '') {
      const originalUrl = this.urlBeforeLoginService.originalUrl;
      this.urlBeforeLoginService.reset();
      this.router.navigateByUrl(this.urlBeforeLoginService.originalUrl);
    }
    if (this.appConfig.iframeUrl) {
      this.iframeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
        this.appConfig.iframeUrl,
      );
    }
  }
}
