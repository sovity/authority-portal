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

import {Pipe, PipeTransform} from '@angular/core';
import {Observable, distinctUntilChanged} from 'rxjs';
import {map} from 'rxjs/operators';
import {UserRoleDto} from '@sovity.de/authority-portal-client';
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
