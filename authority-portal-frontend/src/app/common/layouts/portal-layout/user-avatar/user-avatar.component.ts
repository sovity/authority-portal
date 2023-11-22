import {Component, Input, OnChanges, OnInit} from '@angular/core';
import {mapRolesToReadableFormat} from 'src/app/core/utils/user-role-utils';
import {AvatarConfig} from 'src/app/shared/components/common/avatar/avatar.component';

export interface UserAvatarModel {
  firstName: string;
  lastName: string;
  role: string;
}

@Component({
  selector: 'app-user-avatar',
  templateUrl: './user-avatar.component.html',
})
export class UserAvatarComponent implements OnChanges {
  @Input() userData!: UserAvatarModel;
  @Input() smallDisplayExpandedMenu!: boolean;
  @Input() logoutUrl!: string;

  userAvatar!: AvatarConfig;

  ngOnChanges(): void {
    this.userAvatar = {
      firstName: this.userData.firstName,
      lastName: this.userData.lastName,
    };
  }

  mapToReadable(role: string): string {
    return mapRolesToReadableFormat(role);
  }
}
