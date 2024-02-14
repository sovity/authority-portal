import {Component, Input, OnChanges} from '@angular/core';
import {Router} from '@angular/router';
import {mapRolesToReadableFormat} from 'src/app/core/utils/user-role-utils';
import {AvatarConfig} from 'src/app/shared/components/common/avatar/avatar.component';
import {ControlCenterModel} from './control-center.model';

@Component({
  selector: 'app-control-center',
  templateUrl: './control-center.component.html',
})
export class ControlCenterComponent implements OnChanges {
  @Input() userData!: ControlCenterModel;
  @Input() logoutUrl!: string;

  constructor(private router: Router) {}

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

  goToControlCenterPage(queryParam: string) {
    this.router.navigate(['/control-center'], {
      queryParams: {tab: queryParam},
    });
  }
}
