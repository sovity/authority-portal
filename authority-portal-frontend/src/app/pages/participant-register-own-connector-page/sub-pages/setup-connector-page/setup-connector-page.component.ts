import {Component} from '@angular/core';
import {SelectionBoxModel} from 'src/app/shared/components/common/selection-box/selection-box.model';

@Component({
  selector: 'app-setup-connector-page',
  templateUrl: './setup-connector-page.component.html',
})
export class SetupConnectorPageComponent {
  options: SelectionBoxModel[] = [
    {
      title: 'Download from GitHub',
      subTitle: 'host your own connector by downloading it from GitHub',
      icon: 'github_logo.svg',
      action: {
        label: 'Go to GitHub',
        externalUrl: 'https://github.com/sovity/edc-extensions',
      },
    },
  ];
}
