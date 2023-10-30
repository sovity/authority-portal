import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {UserAvatarModel} from 'src/app/common/layouts/portal-layout/user-avatar/user-avatar.component';
import {UserInfo} from '../../../../../../../authority-portal-backend/authority-portal-api-client-ts';
import {APP_CONFIG, AppConfig} from '../../../../core/config/app-config';
import {GlobalStateUtils} from '../../../../core/global-state/global-state-utils';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
})
export class SidebarComponent implements OnInit, OnDestroy {
  userInfo: UserInfo | null = null;
  userAvatarData!: UserAvatarModel;
  smallDisplayExpandedMenu: boolean = false;

  constructor(
    @Inject(APP_CONFIG) public config: AppConfig,
    private globalStateUtils: GlobalStateUtils,
  ) {}

  ngOnInit() {
    this.globalStateUtils.userInfo$
      .pipe(takeUntil(this.ngOnDestroy$))
      .subscribe((userInfo) => {
        this.userInfo = userInfo;
        this.userAvatarData = {
          firstName: userInfo.firstName,
          lastName: userInfo.lastName,
          role: userInfo.roles.length ? userInfo.roles[0] : '',
        };
      });
  }

  toggleMenuSize() {
    this.smallDisplayExpandedMenu = !this.smallDisplayExpandedMenu;
  }

  ngOnDestroy$ = new Subject();
  ngOnDestroy() {
    this.ngOnDestroy$.next(null);
    this.ngOnDestroy$.complete();
  }
}
