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

/**
 * Collects URLs + Method + ResponseFn and then matches them in order.
 *
 * This class only exists to clean up the fake-backend code.
 */
export class UrlInterceptor {
  private entries: {
    urlPattern: string;
    method: string;
    response: ResponseFn;
  }[] = [];

  private lastUrlPattern: string | null = null;

  constructor(public requestUrl: string, public requestMethod: string) {}

  url(urlPattern: string): this {
    this.lastUrlPattern = urlPattern;
    return this;
  }

  on(method: string, response: ResponseFn): this {
    let urlPattern = this.lastUrlPattern;
    if (!urlPattern) {
      throw new Error('Call .url() before calling .on()');
    }
    this.entries.push({urlPattern, method, response});
    return this;
  }

  async tryMatch(): Promise<Response> {
    for (let entry of this.entries) {
      if (entry.method !== this.requestMethod) {
        continue;
      }

      let regexp = '^' + entry.urlPattern.replace(/\*/g, '([^/]*)') + '$';
      let match: string[] = this.requestUrl.match(regexp) || [];
      if (!match.length) {
        continue;
      }

      match = match
        .filter((_, index) => index > 0)
        .map((pathSegment) => decodeURIComponent(pathSegment));

      return await entry.response(...match);
    }

    console.warn(
      `Unmatched request: ${this.requestMethod} ${this.requestUrl}`,
      this.entries.map((it) => `${it.method} ${it.urlPattern}`),
    );

    return Promise.reject(
      `Unmatched request: ${this.requestMethod} ${this.requestUrl}`,
    );
  }
}

export type ResponseFn = (...match: string[]) => Promise<Response>;
