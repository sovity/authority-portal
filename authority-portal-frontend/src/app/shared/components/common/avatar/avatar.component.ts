import {Component, Input, OnChanges} from '@angular/core';

export interface AvatarConfig {
  firstName: string;
  lastName: string;
}
@Component({
  selector: 'app-avatar',
  templateUrl: './avatar.component.html',
})
export class AvatarComponent implements OnChanges {
  @Input() name!: AvatarConfig;
  userName: string = '';

  ngOnChanges(): void {
    if (this.name.firstName.length > 0 && this.name.lastName.length > 0) {
      const firstInitial = this.name.firstName.charAt(0).toUpperCase();
      const lastInitial = this.name.lastName.charAt(0).toUpperCase();
      this.userName = firstInitial + lastInitial;
    }
  }
}
