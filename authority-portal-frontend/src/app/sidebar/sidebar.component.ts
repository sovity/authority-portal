import {Component} from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
})
export class SidebarComponent {
  profileOverviewMenuHidden: boolean = true;
  vendorsMenuHidden: boolean = true;
  servicesMenuHidden: boolean = true;

  toggleSubMenu(el: 'profile_overview' | 'vendors' | 'services') {
    switch (el) {
      case 'profile_overview':
        if (this.profileOverviewMenuHidden) {
          this.profileOverviewMenuHidden = false;
          this.vendorsMenuHidden = true;
          this.servicesMenuHidden = true;
        } else {
          this.profileOverviewMenuHidden = true;
        }
        break;
      case 'vendors':
        if (this.vendorsMenuHidden) {
          this.vendorsMenuHidden = false;
          this.profileOverviewMenuHidden = true;
          this.servicesMenuHidden = true;
        } else {
          this.vendorsMenuHidden = true;
        }
        break;
      case 'services':
        this.servicesMenuHidden = !this.servicesMenuHidden;
        break;
    }
  }
}
