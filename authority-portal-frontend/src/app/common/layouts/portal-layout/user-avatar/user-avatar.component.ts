import {Component, Input, OnChanges, OnInit} from '@angular/core';
import {AvatarConfig} from 'src/app/shared/components/avatar/avatar.component';

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
}
