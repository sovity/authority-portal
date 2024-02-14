import {Component} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Store} from '@ngxs/store';
import {ClearMyOrganizationUserId} from '../state/control-center-page-action';
import {SettingTab} from './control-center-page.model';

@Component({
  selector: 'app-control-center-page',
  templateUrl: './control-center-page.component.html',
})
export class ControlCenterPageComponent {
  activeTab!: string;
  tabs: SettingTab[] = [
    {id: 'my-profile', label: 'My Profile'},
    {id: 'my-organization', label: 'My Organization'},
    {id: 'my-users', label: 'Users & Roles'},
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private store: Store,
  ) {
    this.route.queryParams.subscribe((params) => {
      this.activeTab = params['tab'] || 'my-profile'; // Access the 'tab' query parameter
    });
  }

  onTabChange(queryParam: string) {
    this.store.dispatch(new ClearMyOrganizationUserId());
    this.router.navigate(['/control-center'], {
      queryParams: {tab: queryParam},
    });
  }
}
