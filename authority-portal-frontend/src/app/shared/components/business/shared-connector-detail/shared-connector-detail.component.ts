import {Component, HostBinding, Input} from '@angular/core';
import {ConnectorDetailDto} from '@sovity.de/authority-portal-client';
import {copyToClipboard} from '../../../../core/utils/clipboard-utils';
import {getConnectorStatusText} from '../../../../core/utils/ui-utils';

@Component({
  selector: 'app-shared-connector-detail',
  templateUrl: './shared-connector-detail.component.html',
})
export class SharedConnectorDetailComponent {
  @HostBinding('class.flex')
  @HostBinding('class.flex-col')
  @HostBinding('class.my-6')
  @HostBinding('class.@container') // tailwind container queries
  cls = true;

  @Input() connector!: ConnectorDetailDto;

  getConnectorStatusText = getConnectorStatusText;
  copyToClipboard = copyToClipboard;
}
