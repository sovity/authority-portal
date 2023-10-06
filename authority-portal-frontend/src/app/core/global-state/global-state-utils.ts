import {Injectable} from '@angular/core';
import {Observable, distinctUntilChanged, filter, first, share} from 'rxjs';
import {map, shareReplay, switchMap, tap} from 'rxjs/operators';
import {Select, Store, createSelector} from '@ngxs/store';
import {UserInfo, UserRoleDto} from '@sovity.de/authority-portal-client';
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
      shareReplay(),
    );

  @Select(GlobalStateImpl.roles)
  userRoles$!: Observable<Set<UserRoleDto>>;

  constructor(private store: Store) {}

  public awaitLoadedUserRoles(): Observable<Set<UserRoleDto>> {
    return this.userInfo$.pipe(first()).pipe(
      switchMap(() => this.userRoles$),
      first(),
    );
  }
}
