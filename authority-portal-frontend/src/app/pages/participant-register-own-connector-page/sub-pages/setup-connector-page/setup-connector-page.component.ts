import {Component} from '@angular/core';
import {SelectionBoxModel} from 'src/app/shared/components/common/selection-box/selection-box.model';

@Component({
  selector: 'app-setup-connector-page',
  templateUrl: './setup-connector-page.component.html',
})
export class SetupConnectorPageComponent {
  options: SelectionBoxModel[] = [
    {
      title: 'Start Sponsored CaaS',
      subTitle: 'Managed EDC Connector to begin your journey in Data Spaces',
      icon: 'caas_logo.svg',
      bulletPoints: [
        '1st CaaS free for MDS participants',
        'Easiest access to Mobility Data Space',
        'Easiest access via web browser',
        'Hosted & maintained solution',
        '2 actively consumed data contracts included',
        'User & Access Management with 1 user',
      ],
      action: {
        label: 'Request CaaS',
        url: 'my-organization/connectors/registration/request',
      },
    },
  ];
}
