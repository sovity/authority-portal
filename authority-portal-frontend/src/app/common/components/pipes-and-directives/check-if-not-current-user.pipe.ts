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
import {UserInfo} from '@sovity.de/authority-portal-client';
import {GlobalStateUtils} from '../../../core/global-state/global-state-utils';

@Pipe({name: 'CheckIfNotCurrentUser'})
export class CheckIfNotCurrentUserPipe implements PipeTransform {
  constructor(private globalStateUtils: GlobalStateUtils) {}
  transform(userId: string | false | null): Observable<boolean> {
    return this.globalStateUtils.userInfo$.pipe(
      map((info: UserInfo) => {
        return info.userId !== userId;
      }),
      distinctUntilChanged(),
    );
  }
}
