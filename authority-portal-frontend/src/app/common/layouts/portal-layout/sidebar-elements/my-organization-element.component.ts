import {Component, Input} from '@angular/core';

@Component({
  selector: 'sidebar-my-organization-element',
  template: `
    <a class="sidebar-item" [routerLink]="rLink">
      <svg
        width="24px"
        height="24px"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        fill="#ffffff"
        stroke="#ffffff">
        <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
        <g
          id="SVGRepo_tracerCarrier"
          stroke-linecap="round"
          stroke-linejoin="round"></g>
        <g id="SVGRepo_iconCarrier">
          <path
            id="company-small-24px-2"
            data-name="company-small-24px"
            d="M16,4H2A2.006,2.006,0,0,0,0,6V24H18V6A2.006,2.006,0,0,0,16,4ZM8,22V18h2v4Zm8,0H12V17a.945.945,0,0,0-1-1H7a.945.945,0,0,0-1,1v5H2V6H16ZM8,10H6V8H8Zm4,0H10V8h2ZM8,14H6V12H8Zm4,0H10V12h2Z"
            transform="translate(3 -2)"></path>
          <rect
            id="Retângulo_222"
            data-name="Retângulo 222"
            width="24"
            height="24"
            fill="none"
            opacity="0"></rect>
        </g>
      </svg>
      <p
        class="text-sm leading-4 lg:block group-hover:blockDisable"
        [ngClass]="smallDisplayExpandedMenu ? 'block' : 'hidden'">
        Profile
      </p>
    </a>
  `,
})
export class MyOrganizationElementComponent {
  @Input() smallDisplayExpandedMenu: boolean = false;
  @Input() rLink: string = '';
}
