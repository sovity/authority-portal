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

import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-delete-connector-modal',
  templateUrl: './delete-connector-modal.component.html',
})
export class DeleteConnectorModalComponent {
  @Input() visible!: boolean;
  @Input() isCaasConnector!: boolean;
  @Output() cancel: EventEmitter<any> = new EventEmitter();
  @Output() confirm: EventEmitter<any> = new EventEmitter();
}
