import {Component, HostBinding} from '@angular/core';
import {Router} from '@angular/router';
import {Store} from '@ngxs/store';
import {UserInfo} from '@sovity.de/authority-portal-client';
import {TEST_USERS} from 'src/app/core/api/fake-backend/impl/fake-users';
import {updateLoggedInUser} from '../../../../core/api/fake-backend/impl/fake-users';
import {RefreshUserInfo} from '../../../../core/global-state/global-state-actions';

@Component({
  selector: 'app-fake-backend-user-switcher',
  templateUrl: './fake-backend-user-switcher.component.html',
})
export class FakeBackendUserSwitcherComponent {
  @HostBinding('class.flex')
  @HostBinding('class.flex-row')
  @HostBinding('class.rounded-lg')
  @HostBinding('class.bg-white')
  @HostBinding('class.shadow-lg')
  @HostBinding('class.text-xs')
  @HostBinding('class.fixed')
  @HostBinding('class.bottom-0')
  @HostBinding('class.right-0')
  @HostBinding('class.m-1')
  @HostBinding('class.px-4')
  @HostBinding('class.py-3')
  @HostBinding('class.space-x-2')
  @HostBinding('class.z-50')
  cls = true;
  users: UserInfo[] = Object.values(TEST_USERS);
  switcherMinimized = true;
  activeUser = 0;

  constructor(private store: Store, private router: Router) {}

  setUser(user: UserInfo, idx: number) {
    this.activeUser = idx;
    updateLoggedInUser(() => user);
    this.store.dispatch(RefreshUserInfo);
    this.router.navigate(['dashboard']);
  }

  toggleMinimize() {
    this.switcherMinimized = !this.switcherMinimized;
  }
}
