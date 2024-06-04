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
import {Injectable} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {notBlankValidator} from 'src/app/core/utils/validators/not-blank-validator';
import {subdomainValidators} from 'src/app/core/utils/validators/subdomain-validator';
import {
  DEFAULT_REQUEST_CONNECTOR_PAGE_FORM_VALUE,
  RequestConnectorPageFormModel,
  RequestConnectorPageFormValue,
} from './request-connector-page-form-model';

@Injectable()
export class RequestConnectorPageForm {
  formGroup = this.buildFormGroup();

  constructor(private formBuilder: FormBuilder) {}

  buildFormGroup(): FormGroup<RequestConnectorPageFormModel> {
    const initial = DEFAULT_REQUEST_CONNECTOR_PAGE_FORM_VALUE;

    return this.formBuilder.nonNullable.group({
      connectorTitle: [
        initial.connectorTitle,
        [Validators.required, Validators.maxLength(128), notBlankValidator()],
      ],
      connectorSubdomain: [
        initial.connectorSubdomain,
        [
          Validators.required,
          Validators.maxLength(128),
          ...subdomainValidators,
        ],
      ],
      connectorDescription: [
        initial.connectorDescription,
        [Validators.required, Validators.maxLength(128), notBlankValidator()],
      ],
    });
  }

  get getValue(): RequestConnectorPageFormValue {
    return this.formGroup.value as RequestConnectorPageFormValue;
  }
}
