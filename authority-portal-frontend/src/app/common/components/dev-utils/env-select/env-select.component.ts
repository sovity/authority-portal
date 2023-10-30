import {Component, Input} from '@angular/core';
import {FormControl} from '@angular/forms';
import {DeploymentEnvironmentDto} from '@sovity.de/authority-portal-client';

@Component({
  selector: 'app-env-select',
  templateUrl: './env-select.component.html',
})
export class EnvSelectComponent {
  @Input() control!: FormControl<string>;
  @Input() environments!: DeploymentEnvironmentDto[];
}
