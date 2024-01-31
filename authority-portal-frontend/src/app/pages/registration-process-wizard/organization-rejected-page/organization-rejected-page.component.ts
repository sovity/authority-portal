import {Component, Inject} from '@angular/core';
import {APP_CONFIG, AppConfig} from 'src/app/core/config/app-config';

@Component({
  selector: 'app-organization-rejected-page',
  templateUrl: './organization-rejected-page.component.html',
})
export class OrganizationRejectedPageComponent {
  constructor(@Inject(APP_CONFIG) public config: AppConfig) {}
}
