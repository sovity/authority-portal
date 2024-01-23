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
