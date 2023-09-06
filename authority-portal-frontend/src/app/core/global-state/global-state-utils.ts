import {Injectable} from '@angular/core';
import {Observable, distinctUntilChanged, filter, first, share} from 'rxjs';
import {map, switchMap} from 'rxjs/operators';
import {Select, Store, createSelector} from '@ngxs/store';
import {UserInfo, UserInfoRolesEnum} from '@sovity.de/authority-portal-client';
import {GlobalState} from './global-state';
import {GlobalStateImpl} from './global-state-impl';

@Injectable({providedIn: 'root'})
export class GlobalStateUtils {
  userInfo$: Observable<UserInfo> = this.store
    .select<GlobalState>(GlobalStateImpl)
    .pipe(
      map((state) => state.userInfo),
      distinctUntilChanged(),
      filter((it) => it.isReady),
      map((it) => it.data),
      share(),
    );

  @Select(GlobalStateImpl.roles)
  userRoles$!: Observable<Set<UserInfoRolesEnum>>;

  constructor(private store: Store) {}

  public awaitLoadedUserRoles(): Observable<Set<UserInfoRolesEnum>> {
    return this.userInfo$.pipe(first()).pipe(
      switchMap(() => this.userRoles$),
      first(),
    );
  }
}
