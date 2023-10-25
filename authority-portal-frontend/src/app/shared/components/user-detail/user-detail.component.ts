import {Component, Input} from '@angular/core';
import {UserDetailDto} from '@sovity.de/authority-portal-client';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
})
export class UserDetailComponent {
  @Input() userId!: string;
  @Input() user!: UserDetailDto;
}
