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

// adjust the path as needed

@Injectable({
  providedIn: 'root',
})
export class ClipboardUtils {
  constructor(private toastService: ToastService) {}

  copyToClipboard(text: string) {
    const textarea = document.createElement('textarea');
    textarea.value = text;

    // Append the textarea to the document
    document.body.appendChild(textarea);
    textarea.select();
    navigator.clipboard
      .writeText(text)
      .then(() => {
        // On success, show a toast notification
        this.toastService.showSuccess('Copied to clipboard');
      })
      .catch(() => {
        // On failure, show a toast notification
        this.toastService.showDanger('Failed to copy to clipboard');
      });

    // Remove the textarea from the document
    document.body.removeChild(textarea);
  }
}
