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

import {Component, Input, OnDestroy} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {Subject} from 'rxjs';
import {OrganizationCreateFormModel} from './organization-create-form-model';

export const LEGAL_ID_TYPES: {value: string; viewValue: string}[] = [
  {value: 'TAX_ID', viewValue: 'Tax ID'},
  {
    value: 'COMMERCE_REGISTER_INFO',
    viewValue: 'Commercial Register Number',
  },
];

@Component({
  selector: 'app-organization-create-form',
  templateUrl: './organization-create-form.component.html',
})
export class OrganizationCreateFormComponent implements OnDestroy {
  @Input()
  orgForm!: FormGroup<OrganizationCreateFormModel>;

  idTypes = LEGAL_ID_TYPES;

  ngOnDestroy$ = new Subject();

  ngOnDestroy() {
    this.ngOnDestroy$.next(null);
    this.ngOnDestroy$.complete();
  }
}
