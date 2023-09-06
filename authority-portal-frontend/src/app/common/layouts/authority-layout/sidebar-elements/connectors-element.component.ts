import {Component, Input} from '@angular/core';

@Component({
  selector: 'sidebar-connectors-element',
  template: `
    <a class="sidebar-sub-item" routerLink="{{ rLink }}">
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg">
        <path
          d="M8 19C10.2091 19 12 17.2091 12 15C12 12.7909 10.2091 11 8 11C5.79086 11 4 12.7909 4 15C4 17.2091 5.79086 19 8 19Z"
          stroke="currentColor"
          stroke-width="3"
          stroke-linecap="round"
          stroke-linejoin="round" />
        <path
          d="M10.85 12.15L19 4"
          stroke="currentColor"
          stroke-width="3"
          stroke-linecap="round"
          stroke-linejoin="round" />
        <path
          d="M18 5L20 7"
          stroke="currentColor"
          stroke-width="3"
          stroke-linecap="round"
          stroke-linejoin="round" />
        <path
          d="M15 8L17 10"
          stroke="currentColor"
          stroke-width="3"
          stroke-linecap="round"
          stroke-linejoin="round" />
      </svg>
      <p
        class="text-sm leading-4 lg:block group-hover:blockDisable"
        [ngClass]="smallDisplayExpandedMenu ? 'block' : 'hidden'">
        Connectors
      </p>
    </a>
  `,
})
export class ConnectorsElementComponent {
  @Input() smallDisplayExpandedMenu: boolean = false;
  @Input() rLink: string = '';
}
