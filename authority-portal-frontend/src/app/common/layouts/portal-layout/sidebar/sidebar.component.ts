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
      });
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
