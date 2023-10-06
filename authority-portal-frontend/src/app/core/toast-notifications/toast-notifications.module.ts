import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {ToastNotificationsComponent} from './toast-notifications/toast-notifications.component';

@NgModule({
  declarations: [ToastNotificationsComponent],
  imports: [CommonModule],
  exports: [ToastNotificationsComponent],
})
export class ToastNotificationsModule {}
