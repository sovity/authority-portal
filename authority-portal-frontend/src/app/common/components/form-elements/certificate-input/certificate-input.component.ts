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
  AfterViewInit,
  Component,
  ElementRef,
  HostBinding,
  Input,
  OnDestroy,
} from '@angular/core';
import {FormControl} from '@angular/forms';
import {Subject, interval, takeUntil} from 'rxjs';

@Component({
  selector: 'app-certificate-input',
  templateUrl: './certificate-input.component.html',
})
export class CertificateInputComponent implements AfterViewInit, OnDestroy {
  @HostBinding('class.flex')
  @HostBinding('class.flex-col')
  @HostBinding('class.items-stretch')
  @HostBinding('class.select-none')
  cls = true;

  textAreaClasses = 'border-b-2 border-gray-400 mb-3 py-1 pl-1 !resize-none';

  @Input()
  label = 'Certificate';

  @Input()
  ctrl: FormControl<string> = new FormControl();

  @Input()
  ctrlId = 'certificate-input';

  @Input()
  showLabel = true;

  @Input()
  readonly = false;

  @Input()
  placeholder = [
    '-----BEGIN CERTIFICATE-----',
    'MIICqjCCAhOgAwIBAgIBADANBgk',
    '...',
    'AkmFH0MPvGNeUum02F0=',
    '-----END CERTIFICATE-----',
  ].join('\n');

  private _textarea: HTMLTextAreaElement | null = null;

  constructor(private elementRef: ElementRef) {}

  ngAfterViewInit() {
    interval(100)
      .pipe(takeUntil(this.ngOnDestroy$))
      .subscribe(() => {
        let textArea = this.getTextArea();
        let height = textArea.parentElement!.parentElement!.clientHeight - 32;
        textArea.style.height = height + 'px';
      });
  }

  private getTextArea(): HTMLTextAreaElement {
    if (!this._textarea) {
      const componentDomElement = this.elementRef.nativeElement as HTMLElement;
      this._textarea = componentDomElement.querySelector('textarea');
    }
    return this._textarea!;
  }

  ngOnDestroy$ = new Subject();
  ngOnDestroy() {
    this.ngOnDestroy$.next(null);
    this.ngOnDestroy$.complete();
  }
}
