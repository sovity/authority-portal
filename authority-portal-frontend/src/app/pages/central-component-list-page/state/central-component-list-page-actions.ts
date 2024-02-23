import {CentralComponentDto} from '@sovity.de/authority-portal-client';

const tag = 'CentralComponentListPage';

export class RefreshCentralComponents {
  static readonly type = `[${tag}]  Refresh`;
}

export class DeleteCentralComponent {
  static readonly type = `[${tag}]  Show Central Component Delete Modal`;
  constructor(public centralComponent: CentralComponentDto) {}
}
