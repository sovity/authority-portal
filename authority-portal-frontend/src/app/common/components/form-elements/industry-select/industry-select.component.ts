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
  selector: 'app-industry-select',
  templateUrl: './industry-select.component.html',
})
export class IndustrySelectComponent {
  @HostBinding('class.flex')
  @HostBinding('class.flex-col')
  @HostBinding('class.flex-1')
  cls = true;

  @Input()
  label: string = 'Industry';

  @Input()
  ctrl: FormControl<string | null> = new FormControl();

  @Input()
  ctrlId = 'industry';

  @Input({transform: booleanAttribute})
  required = true;

  industries = [
    'Automotive industry',
    'Consulting',
    'Electrical engineering',
    'E-Mobility',
    'Energy industry',
    'Finance',
    'Geodata',
    'Government',
    'Information and communication technology',
    'Infrastructure operator',
    'Insurance industry',
    'Logistics',
    'Meteorological services',
    'Micromobility provider',
    'Municipality',
    'Passenger transportation',
    'Research & Development',
    'Sensor supplier',
    'Software development',
    'Telecommunication',
    'Tourism',
    'Traffic engineering',
    'Other',
  ];
}
