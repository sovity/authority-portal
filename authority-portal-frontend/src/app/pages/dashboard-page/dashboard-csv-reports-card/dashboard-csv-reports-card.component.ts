import {Component, HostBinding} from '@angular/core';
import {UserRoleDto} from '@sovity.de/authority-portal-client';

export interface ReportLink {
  title: string;
  subTitle: string;
  url: string;
  roles: UserRoleDto[];
}

@Component({
  selector: 'app-dashboard-csv-reports-card',
  templateUrl: './dashboard-csv-reports-card.component.html',
})
export class DashboardCsvReportsCardComponent {
  @HostBinding('class.border')
  @HostBinding('class.border-gray-100')
  @HostBinding('class.shadow')
  @HostBinding('class.rounded-xl')
  @HostBinding('class.p-6')
  cls = true;

  reportLinks: ReportLink[] = [
    {
      title: 'Connectors',
      subTitle: '.csv',
      url: '/api/reporting/connectors',
      roles: ['USER'],
    },
    {
      title: 'Data Offers Report',
      subTitle: '.csv',
      url: '/api/reporting/data-offers',
      roles: ['USER'],
    },
    {
      title: 'System Stability Report',
      subTitle: '.csv',
      url: '/api/reporting/system-stability',
      roles: ['USER'],
    },
    {
      title: 'Users & Roles Report',
      subTitle: '.csv',
      url: '/api/reporting/users',
      roles: ['AUTHORITY_ADMIN', 'AUTHORITY_USER'],
    },
  ];
}
