import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subject, distinctUntilChanged, takeUntil} from 'rxjs';
import {Store} from '@ngxs/store';
import {GlobalStateUtils} from 'src/app/core/global-state/global-state-utils';
import {RefreshUserProfile} from 'src/app/pages/user-profile-page/state/user-profile-page-actions';
import {
  DEFAULT_USER_PROFILE_PAGE_STATE,
  UserProfilePageState,
} from 'src/app/pages/user-profile-page/state/user-profile-page-state';
import {UserProfilePageStateImpl} from 'src/app/pages/user-profile-page/state/user-profile-page-state-impl';

@Component({
  selector: 'app-user-profile-page',
  templateUrl: './user-profile-page.component.html',
})
export class UserProfilePageComponent implements OnInit, OnDestroy {
  state = DEFAULT_USER_PROFILE_PAGE_STATE;
  ngOnDestroy$ = new Subject();

  constructor(
    private store: Store,
    private globalStateUtils: GlobalStateUtils,
  ) {}

  ngOnInit(): void {
    this.globalStateUtils.userInfo$
      .pipe(distinctUntilChanged(), takeUntil(this.ngOnDestroy$))
      .subscribe((userInfo) => {
        if (this.state.userId === userInfo.userId) return;
        this.setUserId(userInfo.userId);
      });

    this.startListeningToState();
  }

  startListeningToState() {
    this.store
      .select<UserProfilePageState>(UserProfilePageStateImpl)
      .pipe(takeUntil(this.ngOnDestroy$))
      .subscribe((state) => {
        this.state = state;
      });
  }

  setUserId(userId: string) {
    this.store.dispatch(new RefreshUserProfile(userId));
  }

  ngOnDestroy(): void {
    this.ngOnDestroy$.next(null);
    this.ngOnDestroy$.complete();
  }
}