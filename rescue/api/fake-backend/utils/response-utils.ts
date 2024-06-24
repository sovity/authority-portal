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

export const buildOkFn =
  (method: string, url: string, queryParams: URLSearchParams, body: any) =>
  (responseBody: any, log = true): Promise<Response> =>
    new Promise((resolve) => {
      if (log) {
        const output = [
          'Fake Backend',
          method,
          url + (queryParams.toString() ? '?' + queryParams.toString() : ''),
        ];

        if (body) {
          output.push('Requested ', body);
        }

        output.push('Responding ', responseBody);
        console.log(...output);
      }
      const response = new Response(JSON.stringify(responseBody), {
        status: 200,
      });
      setTimeout(() => resolve(response), 400);
    });
