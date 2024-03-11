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
import {ToastService} from '../toast-notifications/toast.service';

@Injectable({
  providedIn: 'root',
})
export class ClipboardUtils {
  constructor(private toastService: ToastService) {}

  copyToClipboard(text: string | undefined) {
    if (!text) {
      this.toastService.showDanger('Nothing to copy');
      return;
    }

    const textarea = document.createElement('textarea');
    textarea.value = text;

    document.body.appendChild(textarea);
    textarea.select();
    navigator.clipboard
      .writeText(text)
      .then(() => {
        this.toastService.showSuccess('Copied to clipboard');
      })
      .catch(() => {
        this.toastService.showDanger('Failed to copy to clipboard');
      });

    document.body.removeChild(textarea);
  }
}
