import {Component} from '@angular/core';
import {SelectionBoxModel} from 'src/app/shared/components/common/selection-box/selection-box.model';

@Component({
  selector: 'app-participant-register-own-connector-page',
  templateUrl: './participant-register-own-connector-page.component.html',
})
export class ParticipantRegisterOwnConnectorPageComponent {
  options: SelectionBoxModel[] = [
    {
      title: 'Register self-hosted connector',
      subTitle: 'Follow the process to set-up your self-hosted connector here',
      icon: 'self-hosted-connector_logo.svg',
      action: {
        url: '/my-organization/connectors/registration/register',
      },
    },
  ];
}
