import {
  OwnOrganizationDetailsDto,
  UserDeletionCheck,
  UserDetailDto,
} from '@sovity.de/authority-portal-client';
import {Fetched} from '../../../core/utils/fetched';

export interface UserProfileState {
  userId: string;
  user: Fetched<UserDetailDto>;
  busy: boolean;
}
export interface OrganizationProfileState {
  organizationMdsId: string;
  organization: Fetched<OwnOrganizationDetailsDto>;
  showMemberDetail: boolean;
  busy: boolean;
}

export interface OrganizationUserDetailState {
  userId: string;
  organizationMdsId: string;
  user: Fetched<UserDetailDto>;
  busy: boolean;
  userParticipantRolesForm: {
    state: 'editing' | 'submitting' | 'success' | 'error';
    errors: {[key: string]: string};
  };
  userApplicationRolesForm: {
    state: 'editing' | 'submitting' | 'success' | 'error';
    errors: {[key: string]: string};
  };
  modalData?: Fetched<UserDeletionCheck>;
  isRequestingUserDeletion: boolean;
  showUserDeletionModal: boolean;
}

export interface ControlCenterPageState {
  userProfileState: UserProfileState;
  organizationProfileState: OrganizationProfileState;
  organizationUserDetailState: OrganizationUserDetailState;
}

export const DEFAULT_USER_PROFILE_STATE: UserProfileState = {
  userId: '',
  user: Fetched.empty(),
  busy: false,
};

export const DEFAULT_ORGANIZATION_PROFILE_STATE: OrganizationProfileState = {
  organizationMdsId: '',
  organization: Fetched.empty(),
  showMemberDetail: false,
  busy: false,
};

export const DEFAULT_ORGANIZATION_USER_DETAIL_STATE: OrganizationUserDetailState =
  {
    userId: '',
    organizationMdsId: '',
    user: Fetched.empty(),
    busy: false,
    userParticipantRolesForm: {state: 'editing', errors: {}},
    userApplicationRolesForm: {state: 'editing', errors: {}},
    isRequestingUserDeletion: false,
    showUserDeletionModal: false,
  };

export const DEFAULT_CONTROL_CENTER_PAGE_STATE: ControlCenterPageState = {
  userProfileState: DEFAULT_USER_PROFILE_STATE,
  organizationProfileState: DEFAULT_ORGANIZATION_PROFILE_STATE,
  organizationUserDetailState: DEFAULT_ORGANIZATION_USER_DETAIL_STATE,
};
