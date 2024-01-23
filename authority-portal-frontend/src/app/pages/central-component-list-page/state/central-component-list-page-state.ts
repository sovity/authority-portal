import {CentralComponentDto} from '@sovity.de/authority-portal-client';
import {Fetched} from 'src/app/core/utils/fetched';

export interface CentralComponentListPageState {
  centralComponents: Fetched<CentralComponentDto[]>;

  deleteConfirmation: CentralComponentDto | null;

  busy: boolean;
  busyDeletingComponentId: string | null;
}

export const DEFAULT_CENTRAL_COMPONENT_LIST_PAGE_STATE: CentralComponentListPageState =
  {
    centralComponents: Fetched.empty(),
    deleteConfirmation: null,
    busy: false,
    busyDeletingComponentId: null,
  };
