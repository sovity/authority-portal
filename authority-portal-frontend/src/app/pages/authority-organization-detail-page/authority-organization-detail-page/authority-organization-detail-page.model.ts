export enum AuthorityOrganizationActions {
  REJECT_ORGANIZATION = 'REJECT_ORGANIZATION',
  APPROVE_ORGANIZATION = 'APPROVE_ORGANIZATION',
}

export enum AuthorityOrganizationUserActions {
  REACTIVATE_USER = 'REACTIVATE_USER',
  DEACTIVATE_USER = 'DEACTIVATE_USER',
}
export enum AuthorityOrganizationDetailTab {
  DETAIL = 'DETAIL',
  MEMBERS = 'MEMBERS',
  CONNECTORS = 'CONNECTORS',
  DATA_OFFERS = 'DATA_OFFERS',
  USER_DETAILS = 'USER_DETAILS',
}

export interface UserDetailPageConfig {
  userId: string;
  mdsId: string;
}

export interface UserDetailPageConfig {
  userId: string;
  mdsId: string;
}

export enum OrganizationUserActions {
  REJECT = 'REJECT_USER',
  APPROVE = 'APPROVE_USER',
  DELETE = 'DELETE_USER',
}
