import {Pipe, PipeTransform} from '@angular/core';
import {Observable, distinctUntilChanged} from 'rxjs';
import {map} from 'rxjs/operators';
import {UserRoleDto} from '../../../../../../authority-portal-backend/authority-portal-api-client-ts';
import {GlobalStateUtils} from '../../../core/global-state/global-state-utils';

@Pipe({name: 'hasAnyRole'})
export class HasAnyRolePipe implements PipeTransform {
  constructor(private globalStateUtils: GlobalStateUtils) {}
  transform(value: UserRoleDto[]): Observable<boolean> {
    return this.globalStateUtils.userRoles$.pipe(
      map((rolesOfUser) =>
        Array.from(rolesOfUser)
          .filter((role) => value.includes(role))
          .some((x) => x),
      ),
      distinctUntilChanged(),
    );
  }
}
