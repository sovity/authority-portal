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

export const getUrl = (
  input: Request | string,
  baseUrl: string,
): {url: string; queryParams: URLSearchParams} => {
  let url = new URL(typeof input === 'string' ? input : input.url);

  let urlNoQuery = url.origin + url.pathname;
  urlNoQuery = urlNoQuery.startsWith(baseUrl)
    ? urlNoQuery.substring(baseUrl.length)
    : urlNoQuery;

  let queryParams = url.searchParams;

  return {url: urlNoQuery, queryParams};
};

export const getMethod = (init: RequestInit | undefined): string =>
  init?.method ?? 'GET';

export const getBody = (input: RequestInit | undefined): null | any => {
  let body = input?.body?.toString();
  return body ? JSON.parse(body) : null;
};
