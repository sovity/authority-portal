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
import {inject} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivateFn, Router} from '@angular/router';
import {map} from 'rxjs/operators';
import {UserRoleDto} from '@sovity.de/authority-portal-client';
import {GlobalStateUtils} from '../../global-state/global-state-utils';

export const requiresRole: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const router = inject(Router);
  const globalStateUtils = inject(GlobalStateUtils);

  const requiredRoles = getAllowedRoles(mergeData(route)['requiresRole']);

  if (!requiredRoles.length) {
    return true;
  }

  return globalStateUtils.awaitLoadedUserRoles().pipe(
    map((roles) => {
      let hasAnyRole = requiredRoles.some((role) => roles.has(role));

      if (hasAnyRole) {
        return true;
      } else {
        router.navigate(['/unauthorized']);
        return false;
      }
    }),
  );
};

const getAllowedRoles = (value: UserRoleDto | UserRoleDto[]): UserRoleDto[] => {
  if (typeof value === 'string') {
    return [value as UserRoleDto];
  }
  if (Array.isArray(value)) {
    return value as UserRoleDto[];
  }
  return [];
};

const mergeData = (route: ActivatedRouteSnapshot): any => {
  let data = {};
  let current: ActivatedRouteSnapshot | null = route;
  while (current) {
    data = {...data, ...current.data};
    current = current.parent;
  }
  return data;
};
