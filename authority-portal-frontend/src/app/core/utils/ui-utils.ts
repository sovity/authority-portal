import {
  ConnectorTypeDto,
  OrganizationRegistrationStatusDto,
  UserRegistrationStatusDto,
} from '@sovity.de/authority-portal-client';

export const getOrganizationRegistrationStatusClasses = (
  status: OrganizationRegistrationStatusDto,
): string => {
  switch (status) {
    case OrganizationRegistrationStatusDto.Active:
      return 'text-emerald-700 bg-emerald-100/60';
    case OrganizationRegistrationStatusDto.Rejected:
      return 'text-red-700 bg-red-100/60';
    case OrganizationRegistrationStatusDto.Pending:
      return 'bg-gray-100/90';
    case OrganizationRegistrationStatusDto.Invited:
      return 'bg-gray-100/90';
    default:
      return '';
  }
};

export const getOrganizationUserRegistrationStatusClasses = (
  status: UserRegistrationStatusDto,
): string => {
  switch (status) {
    case UserRegistrationStatusDto.Active:
      return 'text-emerald-700 bg-emerald-100/60';
    case UserRegistrationStatusDto.Rejected:
      return 'text-red-700 bg-red-100/60';
    case UserRegistrationStatusDto.Pending:
      return 'bg-gray-100/90';
    case UserRegistrationStatusDto.Invited:
      return 'bg-gray-100/90';
    default:
      return '';
  }
};

export const getConnectorsTypeClasses = (status: ConnectorTypeDto): string => {
  switch (status) {
    case ConnectorTypeDto.Own:
      return 'text-emerald-700 bg-emerald-100/60';
    case ConnectorTypeDto.Provided:
      return 'text-blue-700 bg-blue-100/60';
    case ConnectorTypeDto.Caas:
      return 'bg-yellow-300/90';
    default:
      return '';
  }
};
