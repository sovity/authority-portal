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
import {addHook, sanitize} from 'isomorphic-dompurify';

@Injectable({providedIn: 'root'})
export class HtmlSanitizer {
  constructor() {
    addHook('afterSanitizeAttributes', function (node) {
      // https://developer.chrome.com/docs/lighthouse/best-practices/external-anchors-use-rel-noopener/
      if ('target' in node) {
        node.setAttribute('target', '_blank');
        node.setAttribute('rel', 'noopener noreferrer');
      }
    });
  }

  sanitize(html: string) {
    return sanitize(html);
  }
}
