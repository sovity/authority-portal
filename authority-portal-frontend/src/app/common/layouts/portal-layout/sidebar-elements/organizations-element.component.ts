import {Component, Input} from '@angular/core';

@Component({
  selector: 'sidebar-organizations-element',
  template: `
    <a class="sidebar-item" [routerLink]="rLink">
      <svg
        class="fill-stroke"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg">
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M5 4C4.44772 4 4 4.44772 4 5V19C4 19.5523 4.44772 20 5 20H12H13C13.5523 20 14 19.5523 14 19V5C14 4.44772 13.5523 4 13 4H5ZM5 22H12H13H19C20.6569 22 22 20.6569 22 19V9C22 7.34315 20.6569 6 19 6H16V5C16 3.34315 14.6569 2 13 2H5C3.34315 2 2 3.34315 2 5V19C2 20.6569 3.34315 22 5 22ZM19 20H15.8293C15.9398 19.6872 16 19.3506 16 19V8H19C19.5523 8 20 8.44772 20 9V19C20 19.5523 19.5523 20 19 20ZM7 14H5V16H7V14ZM8 14H10V16H8V14ZM13 14H11V16H13V14ZM17 14H19V16H17V14ZM19 10H17V12H19V10ZM5 10H7V12H5V10ZM10 10H8V12H10V10ZM11 10H13V12H11V10ZM7 6H5V8H7V6ZM8 6H10V8H8V6ZM13 6H11V8H13V6Z"
          fill="currentColor" />
      </svg>
      <p
        class="text-sm leading-4 lg:block group-hover:blockDisable"
        [ngClass]="smallDisplayExpandedMenu ? 'block' : 'hidden'">
        Organizations
      </p>
    </a>
  `,
})
export class OrganizationsElementComponent {
  @Input() smallDisplayExpandedMenu: boolean = false;
  @Input() rLink: string = '';
}
