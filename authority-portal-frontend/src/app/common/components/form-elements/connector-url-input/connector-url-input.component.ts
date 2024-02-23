import {Component, HostBinding, Input} from '@angular/core';
import {FormControl} from '@angular/forms';

@Component({
  selector: 'app-connector-url-input',
  templateUrl: './connector-url-input.component.html',
})
export class ConnectorUrlInputComponent {
  @HostBinding('class.select-none')
  @HostBinding('class.flex')
  @HostBinding('class.flex-col')
  @HostBinding('class.justify-between')
  @HostBinding('class.items-center')
  cls = true;

  @Input()
  label: string = 'Unnamed';

  @Input()
  ctrl: FormControl<string> = new FormControl();

  @Input()
  ctrlId = 'connector-url-' + Math.random().toString(36).substring(7);

  @Input()
  urlSuffix = '/api/dsp';

  get placeholder() {
    return 'https://my-connector.my-org.com' + this.urlSuffix;
  }

  exampleBaseUrl = 'https://{{ Connector URL }}';
}