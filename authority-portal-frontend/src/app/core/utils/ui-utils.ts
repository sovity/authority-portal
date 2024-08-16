/*
 * Copyright (c) 2024 sovity GmbH
 *
 * This program and the accompanying materials are made available under the
 * terms of the Apache License, Version 2.0 which is available at
 * https://www.apache.org/licenses/LICENSE-2.0
 *
 * SPDX-License-Identifier: Apache-2.0
 *
 * Contributors:
 *      sovity GmbH - initial implementation
 */
import {
  ConnectorStatusDto,
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
    case ConnectorTypeDto.AwaitingProvisioning:
      return 'bg-red-300/90';
    default:
      return '';
  }
};

export const getConnectorsTypeText = (status: ConnectorTypeDto): string => {
  switch (status) {
    case ConnectorTypeDto.Own:
      return 'OWN';
    case ConnectorTypeDto.Provided:
      return 'PROVIDED';
    case ConnectorTypeDto.Caas:
      return 'CAAS';
    case ConnectorTypeDto.AwaitingProvisioning:
      return 'AWAITING PROVISIONING';
  }
};

export const getConnectorStatusText = (status: ConnectorStatusDto): string => {
  switch (status) {
    case ConnectorStatusDto.Init:
      return 'Init';
    case ConnectorStatusDto.Provisioning:
      return 'Provisioning';
    case ConnectorStatusDto.AwaitingRunning:
      return 'Awaiting Running';
    case ConnectorStatusDto.Running:
      return 'Running';
    case ConnectorStatusDto.Deprovisioning:
      return 'Deprovisioning';
    case ConnectorStatusDto.AwaitingStopped:
      return 'Awaiting stopped';
    case ConnectorStatusDto.Stopped:
      return 'Stopped';
    case ConnectorStatusDto.Error:
      return 'Error';
    case ConnectorStatusDto.NotFound:
      return 'Not Found';
    case ConnectorStatusDto.Online:
      return 'Online';
    case ConnectorStatusDto.Offline:
      return 'Offline';
    case ConnectorStatusDto.Dead:
      return 'Dead';
    case ConnectorStatusDto.Unknown:
      return 'Unknown';
  }
};

export const getConnectorStatusOuterRingClasses = (
  status: ConnectorStatusDto,
): string => {
  switch (status) {
    case ConnectorStatusDto.Online:
    case ConnectorStatusDto.Running:
      return 'bg-emerald-500/20';
    case ConnectorStatusDto.Init:
    case ConnectorStatusDto.Provisioning:
    case ConnectorStatusDto.AwaitingRunning:
    case ConnectorStatusDto.Offline:
    case ConnectorStatusDto.Deprovisioning:
    case ConnectorStatusDto.AwaitingStopped:
      return 'bg-amber-500/20';
    case ConnectorStatusDto.Stopped:
    case ConnectorStatusDto.Error:
    case ConnectorStatusDto.NotFound:
    case ConnectorStatusDto.Dead:
    case ConnectorStatusDto.Unknown:
      return 'bg-red-500/20';
  }
};

export const getConnectorStatusInnerCircleClasses = (
  status: ConnectorStatusDto,
): string => {
  switch (status) {
    case ConnectorStatusDto.Online:
    case ConnectorStatusDto.Running:
      return 'bg-emerald-500';
    case ConnectorStatusDto.Init:
    case ConnectorStatusDto.Provisioning:
    case ConnectorStatusDto.AwaitingRunning:
    case ConnectorStatusDto.Deprovisioning:
    case ConnectorStatusDto.AwaitingStopped:
    case ConnectorStatusDto.Offline:
      return 'bg-amber-500';
    case ConnectorStatusDto.Stopped:
    case ConnectorStatusDto.Error:
    case ConnectorStatusDto.NotFound:
    case ConnectorStatusDto.Dead:
    case ConnectorStatusDto.Unknown:
      return 'bg-red-500';
  }
};
