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
