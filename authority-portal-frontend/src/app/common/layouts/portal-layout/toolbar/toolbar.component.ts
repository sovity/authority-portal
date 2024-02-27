import {Component, Inject} from '@angular/core';
import {Subject, takeUntil} from 'rxjs';
import {UserInfo} from '@sovity.de/authority-portal-client';
import {APP_CONFIG, AppConfig} from 'src/app/core/config/app-config';
import {GlobalStateUtils} from 'src/app/core/global-state/global-state-utils';
import {getHighestRole} from 'src/app/core/utils/user-role-utils';
import {ControlCenterModel} from '../control-center/control-center.model';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
})
export class ToolbarComponent {
  userInfo: UserInfo | null = null;
  userAvatarData!: ControlCenterModel;

  constructor(
    @Inject(APP_CONFIG) public config: AppConfig,
    private globalStateUtils: GlobalStateUtils,
  ) {}

  ngOnInit() {
    this.startListeningToUserInfo();
  }

  startListeningToUserInfo() {
    this.globalStateUtils.userInfo$
      .pipe(takeUntil(this.ngOnDestroy$))
      .subscribe((userInfo) => {
        this.userInfo = userInfo;
        this.userAvatarData = {
          firstName: userInfo.firstName,
          lastName: userInfo.lastName,
          role: getHighestRole(userInfo.roles),
        };
      });
  }

  ngOnDestroy$ = new Subject();
  ngOnDestroy() {
    this.ngOnDestroy$.next(null);
    this.ngOnDestroy$.complete();
  }
}
