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
