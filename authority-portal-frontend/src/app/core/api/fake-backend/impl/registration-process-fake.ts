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
  IdResponse,
  RegistrationRequestDto,
} from '@sovity.de/authority-portal-client';
import {updateLoggedInUser} from './fake-users';

export const createOrganization = (
  request: RegistrationRequestDto,
): IdResponse => {
  // User is now pending
  updateLoggedInUser(() => ({
    organizationName: request.organizationName,
    registrationStatus: 'PENDING',
  }));

  return {id: 'test-organization-id', changedDate: new Date()};
};

export const registerOrganization = (
  request: RegistrationRequestDto,
): IdResponse => {
  // User is now pending
  updateLoggedInUser(() => ({
    organizationName: request.organizationName,
    registrationStatus: 'PENDING',
  }));

  return {id: 'test-organization-id', changedDate: new Date()};
};
