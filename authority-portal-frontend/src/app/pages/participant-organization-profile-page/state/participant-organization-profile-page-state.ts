import {OwnOrganizationDetailsDto} from '@sovity.de/authority-portal-client';
import {Fetched} from '../../../core/utils/fetched';

export interface ParticipantOrganizationProfilePageState {
  organizationMdsId: string;
  organization: Fetched<OwnOrganizationDetailsDto>;
  busy: boolean;
}

export const DEFAULT_PARTICIPANT_ORGANIZATION_PROFILE_PAGE_STATE: ParticipantOrganizationProfilePageState =
  {
    organizationMdsId: '',
    organization: Fetched.empty(),
    busy: false,
  };
