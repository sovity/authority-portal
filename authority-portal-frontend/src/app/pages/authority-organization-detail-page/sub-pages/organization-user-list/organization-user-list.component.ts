import {Component, EventEmitter, Input, Output} from '@angular/core';
import {MemberInfo} from '@sovity.de/authority-portal-client';
import {mapRolesToReadableFormat} from 'src/app/core/utils/user-role-utils';

@Component({
  selector: 'app-organization-user-list',
  templateUrl: './organization-user-list.component.html',
})
export class OrganizationUserListComponent {
  @Input() users!: MemberInfo[];
  @Input() organizationId!: string;
  @Output() onUserSelected = new EventEmitter<MemberInfo>();

  mapToReadable(role: string): string {
    return mapRolesToReadableFormat(role);
  }

  selectUser(user: MemberInfo): void {
    this.onUserSelected.emit(user);
  }
}
