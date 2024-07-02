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
import {AfterViewInit, Directive, ElementRef} from '@angular/core';

@Directive({
  selector: '[autofocus]',
})
export class AutofocusDirective implements AfterViewInit {
  constructor(private elementRef: ElementRef) {}

  ngAfterViewInit() {
    const ele = this.elementRef.nativeElement as HTMLInputElement;
    setTimeout(() => {
      ele.focus();
      ele.select();
    }, 100);
  }
}
