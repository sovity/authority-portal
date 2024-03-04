import {Component, Inject} from '@angular/core';
import {APP_CONFIG, AppConfig} from '../../../../core/config/app-config';

@Component({
  selector: 'logout-button',
  templateUrl: './logout-button.component.html',
})
export class LogoutButtonComponent {
  constructor(@Inject(APP_CONFIG) public config: AppConfig) {}
}
