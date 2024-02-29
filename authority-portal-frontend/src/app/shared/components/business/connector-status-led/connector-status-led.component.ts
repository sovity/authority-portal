import {Component, Input} from '@angular/core';
import {ConnectorStatusDto} from '@sovity.de/authority-portal-client';
import {
  getConnectorStatusInnerCircleClasses,
  getConnectorStatusOuterRingClasses,
  getConnectorStatusText,
} from '../../../../core/utils/ui-utils';

@Component({
  selector: 'app-connector-status-led',
  templateUrl: './connector-status-led.component.html',
})
export class ConnectorStatusLedComponent {
  @Input()
  status: ConnectorStatusDto = 'UNKNOWN';

  getConnectorStatusOuterRingClasses = getConnectorStatusOuterRingClasses;
  getConnectorStatusInnerCircleClasses = getConnectorStatusInnerCircleClasses;
  getConnectorStatusText = getConnectorStatusText;
}
