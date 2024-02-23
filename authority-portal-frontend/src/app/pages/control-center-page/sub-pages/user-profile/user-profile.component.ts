import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subject, distinctUntilChanged, takeUntil} from 'rxjs';
import {Store} from '@ngxs/store';
import {GlobalStateUtils} from 'src/app/core/global-state/global-state-utils';
import {UserDetailConfig} from 'src/app/shared/components/business/shared-user-detail/shared-user-detail.model';
import {HeaderBarConfig} from 'src/app/shared/components/common/header-bar/header-bar.model';
import {RefreshUserProfile} from '../../state/control-center-page-action';
import {
  DEFAULT_USER_PROFILE_STATE,
  UserProfileState,
} from '../../state/control-center-page-state';
import {ControlCenterPageStateImpl} from '../../state/control-center-page-state-impl';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
})
export class UserProfileComponent implements OnInit, OnDestroy {
  state = DEFAULT_USER_PROFILE_STATE;
  userDetailConfig!: UserDetailConfig;
  ngOnDestroy$ = new Subject();
  headerConfig!: HeaderBarConfig;

  constructor(
    private store: Store,
    private globalStateUtils: GlobalStateUtils,
  ) {}

  ngOnInit(): void {
    this.globalStateUtils.userInfo$
      .pipe(distinctUntilChanged(), takeUntil(this.ngOnDestroy$))
      .subscribe((userInfo) => {
        if (this.state.userId !== userInfo.userId) {
          this.store.dispatch(new RefreshUserProfile(userInfo.userId));
        }
      });
    this.startListeningToState();
  }

  startListeningToState() {
    this.store
      .select<UserProfileState>(ControlCenterPageStateImpl.userProfileState)
      .pipe(takeUntil(this.ngOnDestroy$))
      .subscribe((state) => {
        this.state = state;
        if (this.state.user.isReady) {
          this.userDetailConfig = {
            userId: this.state.userId,
            user: this.state.user.data,
            pageFor: 'OWN',
          };
        }
        this.state.user.ifReady(
          (user) =>
            (this.headerConfig = {
              title: `${user.firstName}  ${user.lastName}`,
              subtitle: 'Details about your profile',
              headerActions: [],
            }),
        );
      });
  }
  ngOnDestroy(): void {
    this.ngOnDestroy$.next(null);
    this.ngOnDestroy$.complete();
  }
}
