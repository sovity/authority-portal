import {Component} from '@angular/core';
import {SelectionBoxModel} from 'src/app/shared/components/common/selection-box/selection-box.model';

@Component({
  selector: 'app-participant-register-own-connector-page',
  templateUrl: './participant-register-own-connector-page.component.html',
  styles: [],
})
export class ParticipantRegisterOwnConnectorPageComponent {
  options: SelectionBoxModel[] = [
    {
      title: 'I need a connector',
      subTitle: 'request a connector as a service',
      icon: 'hand_connector_logo.svg',
      action: {url: '/my-organization/connectors/registration/setup'},
    },
    {
      title: 'I have a connector',
      subTitle: 'get your endpoint URL & certificate ready',
      icon: 'connector_logo.svg',
      action: {
        url: '/my-organization/connectors/registration/register',
      },
    },
  ];
}
