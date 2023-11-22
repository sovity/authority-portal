import {Component} from '@angular/core';
import {RequestConnectorForm} from './request-connector-form';

@Component({
  selector: 'app-request-connector-page',
  templateUrl: './request-connector-page.component.html',
  providers: [RequestConnectorForm],
})
export class RequestConnectorPageComponent {
  constructor(public form: RequestConnectorForm) {}

  submit() {
    //TODO: implement submit
  }
}
