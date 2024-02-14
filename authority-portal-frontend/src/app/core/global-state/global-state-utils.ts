import {Injectable} from '@angular/core';
import {Observable, distinctUntilChanged, filter, first} from 'rxjs';
import {
  distinctUntilKeyChanged,
  map,
  shareReplay,
  skip,
  switchMap,
  take,
  takeUntil,
} from 'rxjs/operators';
import {Select, StateContext, Store} from '@ngxs/store';
import {
  DeploymentEnvironmentDto,
  UserInfo,
  UserRoleDto,
} from '@sovity.de/authority-portal-client';
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

  deploymentEnvironment$: Observable<DeploymentEnvironmentDto> = this.store
    .select<GlobalState>(GlobalStateImpl)
    .pipe(
      map((state) => state.selectedEnvironment),
      filter(
        (environment): environment is DeploymentEnvironmentDto =>
          environment !== null,
      ),
      distinctUntilKeyChanged('environmentId'),
      shareReplay(1),
    );

  @Select(GlobalStateImpl.roles)
  userRoles$!: Observable<Set<UserRoleDto>>;

  constructor(private store: Store) {}

  getDeploymentEnvironmentId(): Observable<string> {
    return this.deploymentEnvironment$.pipe(
      take(1),
      map((environment) => environment.environmentId),
    );
  }

  getDeploymentEnvironment(): Observable<DeploymentEnvironmentDto> {
    return this.deploymentEnvironment$.pipe(map((environment) => environment));
  }

  getDeploymentEnvironments(): Observable<DeploymentEnvironmentDto[]> {
    return this.store.select<GlobalState>(GlobalStateImpl).pipe(
      map((state) => state.deploymentEnvironments),
      filter((it) => it.isReady),
      map((it) => it.data),
      distinctUntilChanged(),
    );
  }

  onDeploymentEnvironmentChangeSkipFirst(opt: {
    onChanged: (environment: DeploymentEnvironmentDto) => void;
    ngOnDestroy$: Observable<any>;
  }) {
    this.deploymentEnvironment$
      .pipe(takeUntil(opt.ngOnDestroy$), skip(1))
      .subscribe((selectedEnvironment) => {
        opt.onChanged(selectedEnvironment);
      });
  }

  public awaitLoadedUserRoles(): Observable<Set<UserRoleDto>> {
    return this.userInfo$.pipe(first()).pipe(
      switchMap(() => this.userRoles$),
      first(),
    );
  }

  /**
   * Helper function to update a nested property in the state.
   * @param ctx StateContext instance
   * @param propertyPath The path to the property to update, e.g., 'openedUserDetail.userRolesForm.state'
   * @param value The new value to set
   */
  updateNestedProperty(
    ctx: StateContext<any>,
    propertyPath: string,
    value: any,
  ): void {
    const currentState = ctx.getState();
    const newState = {...currentState};
    const propertyKeys = propertyPath.split('.');
    let current = newState;

    for (let i = 0; i < propertyKeys.length - 1; i++) {
      const key = propertyKeys[i];
      current = current[key] = {...current[key]};
    }

    const lastKey = propertyKeys[propertyKeys.length - 1];
    current[lastKey] = value;

    ctx.patchState(newState);
  }
}
