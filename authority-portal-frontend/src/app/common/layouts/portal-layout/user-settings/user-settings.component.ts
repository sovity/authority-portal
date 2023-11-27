import {Component, Inject, Input, OnChanges, OnInit} from '@angular/core';
import {APP_CONFIG, AppConfig} from 'src/app/core/config/app-config';
import {mapRolesToReadableFormat} from 'src/app/core/utils/user-role-utils';
import {AvatarConfig} from 'src/app/shared/components/common/avatar/avatar.component';
import {UserSettingsModel} from './user-settings.model';

@Component({
  selector: 'app-user-avatar',
  templateUrl: './user-settings.component.html',
})
export class UserSettingsComponent implements OnChanges {
  @Input() userData!: UserSettingsModel;
  @Input() logoutUrl!: string;

  userAvatar!: AvatarConfig;
  userMenuOpen = false;

  ngOnChanges(): void {
    this.userAvatar = {
      firstName: this.userData.firstName,
      lastName: this.userData.lastName,
    };
  }

  mapToReadable(role: string): string {
    return mapRolesToReadableFormat(role);
  }

  onMenuAction(status: 'OPENED' | 'CLOSED'): void {
    if (status === 'OPENED') {
      this.userMenuOpen = true;
    } else {
      this.userMenuOpen = false;
    }
  }
}
