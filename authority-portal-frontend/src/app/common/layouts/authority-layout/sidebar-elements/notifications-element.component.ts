import {Component, Input} from '@angular/core';

@Component({
  selector: 'sidebar-notifications-element',
  template: `<div class="sidebar-item-container">
    <a class="sidebar-item" routerLink="{{ rLink }}">
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg">
        <path
          d="M10 6H7C6.46957 6 5.96086 6.21071 5.58579 6.58579C5.21071 6.96086 5 7.46957 5 8V17C5 17.5304 5.21071 18.0391 5.58579 18.4142C5.96086 18.7893 6.46957 19 7 19H16C16.5304 19 17.0391 18.7893 17.4142 18.4142C17.7893 18.0391 18 17.5304 18 17V14"
          stroke="currentColor"
          stroke-width="2.5"
          stroke-linecap="round"
          stroke-linejoin="round" />
        <path
          d="M17 10C18.6569 10 20 8.65685 20 7C20 5.34314 18.6569 4 17 4C15.3431 4 14 5.34314 14 7C14 8.65685 15.3431 10 17 10Z"
          stroke="currentColor"
          stroke-width="2.5"
          stroke-linecap="round"
          stroke-linejoin="round" />
      </svg>
      <p
        class="text-sm leading-4 lg:block group-hover:blockDisable"
        [ngClass]="smallDisplayExpandedMenu ? 'block' : 'hidden'">
        Notifications
      </p>
    </a>
  </div>`,
})
export class NotificationsElementComponent {
  @Input() smallDisplayExpandedMenu: boolean = false;
  @Input() rLink: string = '';
}
