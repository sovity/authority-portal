import {Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import {Subject, takeUntil} from 'rxjs';
import {GlobalStateUtils} from 'src/app/core/global-state/global-state-utils';
import {SidebarSection} from './sidebar.model';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
})
export class SidebarComponent implements OnInit, OnDestroy {
  isExpandedMenu: boolean = true;
  sidebarSections: SidebarSection[] = [];

  private ngOnDestroy$ = new Subject();

  constructor(private globalStateUtils: GlobalStateUtils) {}

  ngOnInit() {
    this.setSideBarSections();
    this.updateSidebarSections();
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

  setSideBarSections(envId?: string) {
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
            title: 'Connectors',
            icon: 'connector',
            rLink: '/my-organization/connectors',
          },
          {
            title: 'Data Offers',
            icon: 'tag',
            rLink: `/api/organizations/my-org/redirects/data-offers?environmentId=${
              envId ?? ''
            }`,
            isExternalLink: true,
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
          {
            title: 'All Connectors',
            icon: 'connector',
            rLink: '/authority/connectors',
          },
        ],
      },
      {
        title: 'Links',
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
      {
        title: 'Support',
        userRoles: ['PARTICIPANT_USER'],
        menus: [
          {
            title: 'Support',
            icon: 'question-mark-circle',
            rLink: 'https://mobility-dataspace.online/',
            isExternalLink: true,
          },
        ],
      },
    ];
  }

  updateSidebarSections() {
    this.globalStateUtils
      .getDeploymentEnvironment()
      .pipe(takeUntil(this.ngOnDestroy$))
      .subscribe((env) => {
        this.setSideBarSections(env.environmentId);
      });
  }

  ngOnDestroy(): void {
    this.ngOnDestroy$.next(null);
    this.ngOnDestroy$.complete();
  }
}
