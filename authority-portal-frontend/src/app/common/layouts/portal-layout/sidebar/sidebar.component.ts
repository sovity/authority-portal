import {Component, HostListener} from '@angular/core';
import {SidebarSection} from './sidebar.model';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
})
export class SidebarComponent {
  isExpandedMenu: boolean = true;
  sidebarSections: SidebarSection[] = [];

  constructor() {
    this.sidebarSections = [
      {
        title: 'My Organization',
        userRoles: ['PARTICIPANT_USER'],
        menus: [
          {
            title: 'Dashboard',
            icon: 'home',
            rLink: '/dashboard',
          },
          {
            title: 'Profile',
            icon: 'building-office',
            rLink: '/my-organization/profile',
          },
          {
            title: 'Connectors',
            icon: 'connector',
            rLink: '/my-organization/connectors',
          },
        ],
      },
      {
        title: 'Operator Section',
        userRoles: ['OPERATOR_ADMIN'],
        menus: [
          {
            title: 'Central Components',
            icon: 'extension',
            rLink: '/operator/central-components',
          },
        ],
      },
      {
        title: 'Authority Section',
        userRoles: ['AUTHORITY_USER'],
        menus: [
          {
            title: 'Organizations',
            icon: 'building-office-2',
            rLink: '/authority/organizations',
          },
        ],
      },
      {
        title: 'External Links',
        userRoles: ['PARTICIPANT_USER'],
        menus: [
          {
            title: 'Prod Catalog',
            icon: 'document-text',
            rLink: 'https://catalog.mobility-dataspace.eu/',
            isExternalLink: true,
          },
          {
            title: 'Test Catalog',
            icon: 'document-text',
            rLink: 'https://catalog.test.mobility-dataspace.eu/',
            isExternalLink: true,
          },
        ],
      },
    ];
  }
  // Listen for window resize events
  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    this.checkWindowWidth();
  }

  // Function to check window width and update isExpandedMenu accordingly
  checkWindowWidth(): void {
    this.isExpandedMenu = window.innerWidth > 768; // Set the breakpoint as per your design
  }

  openNewTab() {
    window.open('https://mobility-dataspace.eu/de', '_blank');
  }

  toggleMenuSize() {
    this.isExpandedMenu = !this.isExpandedMenu;
  }
}
