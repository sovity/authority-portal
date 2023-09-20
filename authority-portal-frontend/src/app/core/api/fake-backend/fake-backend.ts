import {
  CreateOrganizationRequestFromJSON,
  FetchAPI,
  IdResponseToJSON,
  UserInfoToJSON,
} from '@sovity.de/authority-portal-client';
import {createOrganization} from './impl/registration-process-fake';
import {getUserInfo} from './impl/user-info-fake';
import {getBody, getMethod, getUrl} from './utils/request-utils';
import {ok} from './utils/response-utils';
import {UrlInterceptor} from './utils/url-interceptor';

export const AUTHORITY_PORTAL_FAKE_BACKEND: FetchAPI = async (
  input: RequestInfo,
  init?: RequestInit,
): Promise<Response> => {
  let url = getUrl(input, 'http://authority-portal.fake-backend/api/v1/ui/');
  let method = getMethod(init);
  let body = getBody(init);

  console.log(...['Fake Backend:', method, url, body].filter((it) => !!it));

  return new UrlInterceptor(url, method)

    .url('user-info')
    .on('GET', () => {
      let result = getUserInfo();
      return ok(UserInfoToJSON(result));
    })

    .url('registration/organization')
    .on('POST', () => {
      let request = CreateOrganizationRequestFromJSON(body);
      let result = createOrganization(request);
      return ok(IdResponseToJSON(result));
    })

    .tryMatch();
};
