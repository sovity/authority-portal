import {Component, Inject} from '@angular/core';
import {Store} from '@ngxs/store';
import {APP_CONFIG, AppConfig} from 'src/app/core/config/app-config';
import {
  RefreshUserInfo,
  SwitchE2eDevUser,
} from 'src/app/core/global-state/global-state-actions';
import {RouteConfigService} from 'src/app/core/global-state/routes/route-config-service';
import {E2eDevUser} from './e2e-dev-user';
import {E2E_DEV_USERS} from './e2e-dev-users';

@Component({
  selector: 'app-e2e-dev-user-switcher',
  templateUrl: './e2e-dev-user-switcher.component.html',
})
export class E2EDevUserSwitcherComponent {
  minimize = true;

  // another option would be state
  currentUser = E2E_DEV_USERS[0].user;

  users = E2E_DEV_USERS;

  constructor(
    @Inject(APP_CONFIG) public config: AppConfig,
    public store: Store,
    private routeConfig: RouteConfigService,
  ) {}

  setUser(user: E2eDevUser) {
    this.store.dispatch(new SwitchE2eDevUser(user));
    this.currentUser = user.user;
    this.store.dispatch(RefreshUserInfo);
    this.routeConfig.forceRefreshCurrentRoute();
  }

  hide() {
    this.minimize = !this.minimize;
  }
}
