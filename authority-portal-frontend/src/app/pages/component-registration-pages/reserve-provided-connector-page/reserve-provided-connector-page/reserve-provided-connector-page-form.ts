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
import {
  ConnectorInfoFormModel,
  DEFAULT_PROVIDE_CONNECTOR_PAGE_FORM_VALUE,
  ReserveProvidedConnectorPageFormModel,
  ReserveProvidedConnectorPageFormValue,
} from './reserve-provided-connector-page-form-model';

@Injectable()
export class ReserveProvidedConnectorPageForm {
  group = this.buildFormGroup();

  get connectorInfo(): FormGroup<ConnectorInfoFormModel> {
    return this.group.controls.connectorInfo;
  }

  get value(): ReserveProvidedConnectorPageFormValue {
    return this.group.value as ReserveProvidedConnectorPageFormValue;
  }

  constructor(private formBuilder: FormBuilder) {}

  buildFormGroup(): FormGroup<ReserveProvidedConnectorPageFormModel> {
    const initial = DEFAULT_PROVIDE_CONNECTOR_PAGE_FORM_VALUE;

    const connectorInfo = this.formBuilder.nonNullable.group({
      name: [
        initial.connectorInfo.name,
        [Validators.required, Validators.maxLength(128), notBlankValidator()],
      ],
      location: [
        initial.connectorInfo.location,
        [Validators.required, Validators.maxLength(128), notBlankValidator()],
      ],
      organization: [
        initial.connectorInfo.organization,
        [Validators.required, Validators.maxLength(128)],
      ],
    });

    return this.formBuilder.nonNullable.group({
      connectorInfo: connectorInfo,
    });
  }
}
