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
import { Observable } from 'rxjs';


export interface JsonDialogData {
  title: string;
  subtitle: string;
  icon: string;
  objectForJson: unknown;
  toolbarButton?: DialogToolbarButton;
}

export interface DialogToolbarButton {
  text: string;
  icon: string;
  action: () => Observable<any> | any;
}
