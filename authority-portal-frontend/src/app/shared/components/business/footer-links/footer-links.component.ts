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
import {APP_CONFIG, AppConfig} from 'src/app/core/config/app-config';
import {FooterLink} from './footer-link.model';

@Component({
  selector: 'app-footer-links',
  templateUrl: './footer-links.component.html',
})
export class FooterLinksComponent {
  @HostBinding('class.flex')
  @HostBinding('class.justify-center')
  @HostBinding('class.gap-1.5')
  @HostBinding('class.whitespace-normal')
  cls = true;

  footerLinks: FooterLink[] = [
    {
      name: 'Privacy Policy',
      href: this.config.privacyPolicyUrl,
    },
    {
      name: 'Legal Notice',
      href: this.config.legalNoticeUrl,
    },
  ];

  constructor(@Inject(APP_CONFIG) public config: AppConfig) {}
}
