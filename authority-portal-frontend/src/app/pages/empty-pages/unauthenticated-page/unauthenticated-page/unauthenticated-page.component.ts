import {Component, Inject} from '@angular/core';
import {APP_CONFIG, AppConfig} from 'src/app/core/config/app-config';

@Component({
  selector: 'app-unauthenticated-page',
  templateUrl: './unauthenticated-page.component.html',
})
export class UnauthenticatedPageComponent {
  constructor(@Inject(APP_CONFIG) public appConfig: AppConfig) {}
}
