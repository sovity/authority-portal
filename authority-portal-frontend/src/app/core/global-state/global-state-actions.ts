import {E2eDevUser} from 'src/app/common/components/dev-utils/e2e-dev-user-switcher/e2e-dev-user';
import {LocalDevBasicAuthConfig} from '../config/app-config';

const tag = 'GlobalState';

export class RefreshUserInfo {
  static readonly type = `[${tag}] Load User`;
}

export class SwitchE2eDevUser {
  static readonly type = `[${tag}] Set Local Backend Basic Auth`;

  constructor(public readonly user: E2eDevUser) {}
}
