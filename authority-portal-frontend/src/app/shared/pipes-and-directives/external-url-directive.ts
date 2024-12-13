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
import {ElementRef, HostListener} from '@angular/core';
import {Router} from '@angular/router';

export class ExternalUrlDirective {
  constructor(private el: ElementRef, private router: Router) {}

  @HostListener('click', ['$event'])
  clicked(event: Event) {
    const url = this.el.nativeElement.href;

    if (!url) {
      return;
    }

    this.router.navigate(['/externalRedirect', {externalUrl: url}], {
      skipLocationChange: true,
    });

    event.preventDefault();
  }
}
