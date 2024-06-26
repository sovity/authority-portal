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
import { Injectable } from '@angular/core';
import { marked } from 'marked';


@Injectable({providedIn: 'root'})
export class MarkdownConverter {
  constructor() {
    const renderer = new marked.Renderer();

    renderer.image = function (href, title, alt) {
      return `<a href="${href}" target="_blank"><img src="${href}" alt="${alt}"></a>`;
    };

    marked.use({renderer});
  }

  toHtml(markdown: string) {
    return marked.parse(markdown).toString();
  }
}
