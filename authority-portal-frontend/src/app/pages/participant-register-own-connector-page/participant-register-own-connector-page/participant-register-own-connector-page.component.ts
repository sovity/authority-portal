import {Component} from '@angular/core';
import {SelectionBoxModel} from 'src/app/shared/components/common/selection-box/selection-box.model';

@Component({
  selector: 'app-participant-register-own-connector-page',
  templateUrl: './participant-register-own-connector-page.component.html',
})
export class ParticipantRegisterOwnConnectorPageComponent {
  options: SelectionBoxModel[] = [
    {
      title: 'I have a connector',
      subTitle: 'Follow the process to set-up your self-hosted connector here',
      icon: 'self-hosted-connector_logo.svg',
      action: {
        url: '/my-organization/connectors/registration/register',
      },
    },
    {
      title: 'I need a connector',
      subTitle:
        'Request a managed connector to begin your journey in data spaces',
      icon: 'request-caas_logo.svg',
      action: {
        url: '/my-organization/connectors/registration/setup',
      },
    },
  ];
}
