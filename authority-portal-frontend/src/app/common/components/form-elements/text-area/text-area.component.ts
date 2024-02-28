import {Component, HostBinding, Input} from '@angular/core';
import {FormControl} from '@angular/forms';

@Component({
  selector: 'app-text-area',
  templateUrl: './text-area.component.html',
})
export class TextAreaComponent {
  @HostBinding('class.select-none')
  @HostBinding('class.flex')
  @HostBinding('class.flex-col')
  @HostBinding('class.justify-between')
  @HostBinding('class.items-center')
  cls = true;

  @Input()
  ctrl: FormControl<string> = new FormControl();

  @Input()
  ctrlId = 'missing-id-' + Math.random().toString(36).substring(7);

  @Input()
  label: string = 'Unnamed';

  @Input()
  placeholder: string = '...';

  @Input()
  requiredMessage = 'Field is required.';
}
