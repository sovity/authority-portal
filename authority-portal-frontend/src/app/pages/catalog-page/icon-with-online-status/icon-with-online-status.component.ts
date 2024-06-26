import {Component, HostBinding, Input} from '@angular/core';
import {
  ConnectorOnlineStatus,
  getOnlineStatusColor,
  getOnlineStatusIcon,
} from './online-status-utils';

@Component({
  selector: 'icon-with-online-status',
  template: `
    <mat-icon
      *ngIf="onlineStatus"
      class="absolute mat-icon-[24px] mt-[26px] ml-[26px]"
      [ngClass]="onlineStatusColor"
      >{{ onlineStatusIcon }}</mat-icon
    >

    <mat-icon
      style="width: 2.5rem; height: 2.5rem; font-size: 2.5rem; line-height: 2.5rem; color: black;"
      >{{ mainIcon }}</mat-icon
    >
  `,
})
export class IconWithOnlineStatusComponent {
  @HostBinding('class.relative')
  cls = true;

  @Input()
  mainIcon!: string;

  @Input()
  onlineStatus!: ConnectorOnlineStatus;

  get onlineStatusColor(): string {
    return getOnlineStatusColor(this.onlineStatus);
  }

  get onlineStatusIcon(): string {
    return getOnlineStatusIcon(this.onlineStatus);
  }
}
