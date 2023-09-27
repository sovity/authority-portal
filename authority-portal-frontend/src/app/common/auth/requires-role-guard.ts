import {inject} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivateFn, Router} from '@angular/router';
import {map} from 'rxjs/operators';
import {UserInfoRolesEnum} from '../../../../../authority-portal-backend/authority-portal-api-client-ts';
import {GlobalStateUtils} from '../../core/global-state/global-state-utils';

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

const getAllowedRoles = (value: any): UserInfoRolesEnum[] => {
  if (typeof value === 'string') {
    return [value as UserInfoRolesEnum];
  }
  if (Array.isArray(value)) {
    return value;
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
