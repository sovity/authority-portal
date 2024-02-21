import {Component, Inject, Input} from '@angular/core';
import {FormControl} from '@angular/forms';
import {APP_CONFIG, AppConfig} from '../../../../core/config/app-config';

@Component({
  selector: 'app-tos-check',
  templateUrl: './tos-check.component.html',
})
export class TosCheckComponent {
  @Input()
  ctrl: FormControl<boolean> = new FormControl();

  @Input()
  ctrlId = 'dsgvo-tos';

  constructor(@Inject(APP_CONFIG) public config: AppConfig) {}
}
