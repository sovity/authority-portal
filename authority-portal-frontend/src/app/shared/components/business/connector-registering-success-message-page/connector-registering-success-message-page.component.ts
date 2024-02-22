import {Component, HostBinding, Input} from '@angular/core';
import {copyToClipboard} from '../../../../core/utils/clipboard-utils';

@Component({
  selector: 'app-connector-registering-success-message-page',
  templateUrl: './connector-registering-success-message-page.component.html',
})
export class ConnectorRegisteringSuccessMessagePageComponent {
  @HostBinding('class.flex')
  @HostBinding('class.flex-col')
  @HostBinding('class.gap-3')
  @HostBinding('class.justify-center')
  @HostBinding('class.px-8')
  cls = true;

  @Input()
  connectorConfig: string = '...';

  copyToClipboard() {
    copyToClipboard(this.connectorConfig);
  }
}
