import {
  ConnectorDetailDtoStatusEnum,
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
    case OrganizationRegistrationStatusDto.Onboarding:
      return 'text-orange-700 bg-orange-100/60';
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

export const getConnectorStatusText = (
  status: ConnectorDetailDtoStatusEnum,
): string => {
  switch (status) {
    case ConnectorDetailDtoStatusEnum.Init:
      return 'Init';
    case ConnectorDetailDtoStatusEnum.Provisioning:
      return 'Provisioning';
    case ConnectorDetailDtoStatusEnum.AwaitingRunning:
      return 'Awaiting Running';
    case ConnectorDetailDtoStatusEnum.Running:
      return 'Running';
    case ConnectorDetailDtoStatusEnum.Deprovisioning:
      return 'Deprovisioning';
    case ConnectorDetailDtoStatusEnum.AwaitingStopped:
      return 'Awaiting stopped';
    case ConnectorDetailDtoStatusEnum.Stopped:
      return 'Stopped';
    case ConnectorDetailDtoStatusEnum.Error:
      return 'Error';
    case ConnectorDetailDtoStatusEnum.NotFound:
      return 'Not Found';
    case ConnectorDetailDtoStatusEnum.Online:
      return 'Online';
    case ConnectorDetailDtoStatusEnum.Offline:
      return 'Offline';
    case ConnectorDetailDtoStatusEnum.Dead:
      return 'Dead';
    case ConnectorDetailDtoStatusEnum.Unknown:
      return 'Unknown';
  }
};

export const getConnectorStatusOuterRingClasses = (
  status: ConnectorDetailDtoStatusEnum,
): string => {
  switch (status) {
    case ConnectorDetailDtoStatusEnum.Online:
    case ConnectorDetailDtoStatusEnum.Running:
      return 'bg-emerald-500/20';
    case ConnectorDetailDtoStatusEnum.Init:
    case ConnectorDetailDtoStatusEnum.Provisioning:
    case ConnectorDetailDtoStatusEnum.AwaitingRunning:
    case ConnectorDetailDtoStatusEnum.Deprovisioning:
    case ConnectorDetailDtoStatusEnum.AwaitingStopped:
      return 'bg-amber-500/20';
    case ConnectorDetailDtoStatusEnum.Stopped:
    case ConnectorDetailDtoStatusEnum.Error:
    case ConnectorDetailDtoStatusEnum.NotFound:
    case ConnectorDetailDtoStatusEnum.Offline:
    case ConnectorDetailDtoStatusEnum.Dead:
    case ConnectorDetailDtoStatusEnum.Unknown:
      return 'bg-red-500/20';
  }
};

export const getConnectorStatusInnerCircleClasses = (
  status: ConnectorDetailDtoStatusEnum,
): string => {
  switch (status) {
    case ConnectorDetailDtoStatusEnum.Online:
    case ConnectorDetailDtoStatusEnum.Running:
      return 'bg-emerald-500';
    case ConnectorDetailDtoStatusEnum.Init:
    case ConnectorDetailDtoStatusEnum.Provisioning:
    case ConnectorDetailDtoStatusEnum.AwaitingRunning:
    case ConnectorDetailDtoStatusEnum.Deprovisioning:
    case ConnectorDetailDtoStatusEnum.AwaitingStopped:
      return 'bg-amber-500';
    case ConnectorDetailDtoStatusEnum.Stopped:
    case ConnectorDetailDtoStatusEnum.Error:
    case ConnectorDetailDtoStatusEnum.NotFound:
    case ConnectorDetailDtoStatusEnum.Offline:
    case ConnectorDetailDtoStatusEnum.Dead:
    case ConnectorDetailDtoStatusEnum.Unknown:
      return 'bg-red-500';
  }
};
