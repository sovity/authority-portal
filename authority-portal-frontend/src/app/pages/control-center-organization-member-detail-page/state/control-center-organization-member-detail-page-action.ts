import {Observable} from 'rxjs';

const tag = 'ControlCenterOrganizationMemberDetailPage';

export class Reset {
  static readonly type = `[${tag}] Reset`;

  constructor(
    public userId: string,
    public componentLifetime$: Observable<any>,
  ) {}
}
