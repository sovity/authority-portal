import {Component, HostBinding} from '@angular/core';
import {Store} from '@ngxs/store';
import {UserInfo} from '@sovity.de/authority-portal-client';
import {
  DUMMY_USERS,
  updateLoggedInUser,
} from '../../../../core/api/fake-backend/impl/user-info-fake';
import {RefreshUserInfo} from '../../../../core/global-state/global-state-actions';

@Component({
  selector: 'app-basic-auth-user-switcher',
  templateUrl: './basic-auth-user-switcher.component.html',
})
export class BasicAuthUserSwitcherComponent {
  @HostBinding('class.flex')
  @HostBinding('class.flex-row')
  @HostBinding('class.rounded-lg')
  @HostBinding('class.bg-white')
  @HostBinding('class.shadow-lg')
  @HostBinding('class.text-xs')
  @HostBinding('class.fixed')
  @HostBinding('class.top-0')
  @HostBinding('class.right-0')
  @HostBinding('class.m-2')
  @HostBinding('class.px-4')
  @HostBinding('class.py-3')
  @HostBinding('class.space-x-2')
  cls = true;
  @HostBinding('class.z-50')
  @HostBinding('class.hidden')
  hidden = false;

  users: UserInfo[] = DUMMY_USERS;

  constructor(private store: Store) {}

  setUser(user: UserInfo) {
    updateLoggedInUser(() => user);
    this.store.dispatch(RefreshUserInfo);
  }

  hide() {
    this.hidden = true;
  }
}
