import {Component, Inject} from '@angular/core';
import {APP_CONFIG, AppConfig} from 'src/app/core/config/app-config';

@Component({
  selector: 'app-organization-pending-page',
  templateUrl: './organization-pending-page.component.html',
})
export class OrganizationPendingPageComponent {
  constructor(@Inject(APP_CONFIG) public config: AppConfig) {}
}
