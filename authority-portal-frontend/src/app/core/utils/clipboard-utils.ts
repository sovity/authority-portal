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
export function copyToClipboard(text: string) {
  const textarea = document.createElement('textarea');
  textarea.value = text;

  // Append the textarea to the document
  document.body.appendChild(textarea);
  textarea.select();
  navigator.clipboard.writeText(text);
  // Remove the textarea from the document
  document.body.removeChild(textarea);
}
