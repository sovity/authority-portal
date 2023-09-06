import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {UserInfo} from '../../../../../../../authority-portal-backend/authority-portal-api-client-ts';
import {APP_CONFIG, AppConfig} from '../../../../core/config/app-config';
import {GlobalStateUtils} from '../../../../core/global-state/global-state-utils';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
})
export class SidebarComponent implements OnInit, OnDestroy {
  userInfo: UserInfo | null = null;

  profileOverviewMenuHidden: boolean = true;
  vendorsMenuHidden: boolean = true;
  servicesMenuHidden: boolean = true;
  smallDisplayExpandedMenu: boolean = false;
  logoutUrl = '';

  role: any;

  constructor(
    @Inject(APP_CONFIG) private config: AppConfig,
    private globalStateUtils: GlobalStateUtils,
  ) {}

  ngOnInit() {
    this.logoutUrl = this.config.logoutUrl;
    this.globalStateUtils.userInfo$
      .pipe(takeUntil(this.ngOnDestroy$))
      .subscribe((userInfo) => {
        this.userInfo = userInfo;
      });
  }

  toggleSubMenu(el: 'profile_overview' | 'vendors' | 'services') {
    switch (el) {
      case 'profile_overview':
        if (this.profileOverviewMenuHidden) {
          this.profileOverviewMenuHidden = false;
          this.vendorsMenuHidden = true;
          this.servicesMenuHidden = true;
        } else {
          this.profileOverviewMenuHidden = true;
        }
        break;
      case 'vendors':
        if (this.vendorsMenuHidden) {
          this.vendorsMenuHidden = false;
          this.profileOverviewMenuHidden = true;
          this.servicesMenuHidden = true;
        } else {
          this.vendorsMenuHidden = true;
        }
        break;
      case 'services':
        this.servicesMenuHidden = !this.servicesMenuHidden;
        break;
    }
  }

  toggleMenuSize() {
    console.log('this.smallDisplayCompactMenu', this.smallDisplayExpandedMenu);
    this.smallDisplayExpandedMenu = !this.smallDisplayExpandedMenu;
  }

  ngOnDestroy$ = new Subject();
  ngOnDestroy() {
    this.ngOnDestroy$.next(null);
    this.ngOnDestroy$.complete();
  }
}
