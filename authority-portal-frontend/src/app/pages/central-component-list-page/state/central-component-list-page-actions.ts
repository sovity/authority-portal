import {CentralComponentDto} from '@sovity.de/authority-portal-client';

const tag = 'CentralComponentListPage';

export class RefreshCentralComponents {
  static readonly type = `[${tag}]  Refresh`;
}

export class ShowDeleteCentralComponentModal {
  static readonly type = `[${tag}]  Show Central Component Delete Modal`;
  constructor(public centralComponent: CentralComponentDto) {}
}

export class DismissDeleteCentralComponentModal {
  static readonly type = `[${tag}]  Dismiss Central Component Delete Modal`;
}

export class ConfirmDeleteCentralComponent {
  static readonly type = `[${tag}]  Confirm Central Component Deletion`;
}
