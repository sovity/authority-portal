import {
  OrganizationDetailsDto,
  UserDetailDto,
} from '@sovity.de/authority-portal-client';
import {Fetched} from '../../../core/utils/fetched';

export interface AuthorityOrganizationUserDetailState {
  userId: string;
  organizationMdsId: string;
  user: Fetched<UserDetailDto>;
  busy: boolean;
}

export interface AuthorityOrganizationDetailState {
  organizationMdsId: string;
  organization: Fetched<OrganizationDetailsDto>;
  busy: boolean;
}

export interface AuthorityOrganizationDetailPageState {
  organizationDetail: AuthorityOrganizationDetailState;
  openedUserDetail: AuthorityOrganizationUserDetailState;
}

export const DEFAULT_AUTHORITY_ORGANIZATION_USER_DETAIL_STATE: AuthorityOrganizationUserDetailState =
  {
    userId: '',
    organizationMdsId: '',
    user: Fetched.empty(),
    busy: false,
  };

export const DEFAULT_AUTHORITY_ORGANIZATION_DETAIL_STATE: AuthorityOrganizationDetailState =
  {
    organizationMdsId: '',
    organization: Fetched.empty(),
    busy: false,
  };

export const DEFAULT_AUTHORITY_ORGANIZATION_DETAIL_PAGE_STATE: AuthorityOrganizationDetailPageState =
  {
    organizationDetail: DEFAULT_AUTHORITY_ORGANIZATION_DETAIL_STATE,
    openedUserDetail: DEFAULT_AUTHORITY_ORGANIZATION_USER_DETAIL_STATE,
  };
