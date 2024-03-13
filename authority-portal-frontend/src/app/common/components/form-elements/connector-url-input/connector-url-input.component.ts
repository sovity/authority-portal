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
import {booleanAttribute, Component, HostBinding, Input} from '@angular/core';
import {FormControl} from '@angular/forms';

@Component({
  selector: 'app-connector-url-input',
  templateUrl: './connector-url-input.component.html',
})
export class ConnectorUrlInputComponent {
  @HostBinding('class.select-none')
  @HostBinding('class.flex')
  @HostBinding('class.flex-col')
  @HostBinding('class.justify-between')
  @HostBinding('class.items-center')
  cls = true;

  @Input()
  label: string = 'Unnamed';

  @Input()
  ctrl: FormControl<string> = new FormControl();

  @Input()
  ctrlId = 'connector-url-' + Math.random().toString(36).substring(7);

  @Input()
  urlSuffix = '/api/dsp';

  @Input({transform: booleanAttribute})
  required = true;

  get placeholder() {
    return 'https://my-connector.my-org.com' + this.urlSuffix;
  }

  exampleBaseUrl = 'https://{{ Connector URL }}';
}
