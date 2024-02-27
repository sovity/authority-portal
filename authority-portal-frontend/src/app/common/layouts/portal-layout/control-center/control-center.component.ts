import {Component, Input, OnChanges} from '@angular/core';
import {AvatarConfig} from 'src/app/shared/components/common/avatar/avatar.component';
import {ControlCenterModel} from './control-center.model';

@Component({
  selector: 'app-control-center',
  templateUrl: './control-center.component.html',
})
export class ControlCenterComponent implements OnChanges {
  @Input() userData!: ControlCenterModel;
  @Input() logoutUrl!: string;

  userAvatar!: AvatarConfig;
  userMenuOpen = false;

  ngOnChanges(): void {
    this.userAvatar = {
      firstName: this.userData.firstName,
      lastName: this.userData.lastName,
    };
  }
}
