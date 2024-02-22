import {Component, HostBinding, Input} from '@angular/core';

@Component({
  selector: 'app-readonly-text-input',
  templateUrl: './readonly-text-input.component.html',
})
export class ReadonlyTextInputComponent {
  @HostBinding('class.select-none')
  @HostBinding('class.flex')
  @HostBinding('class.flex-col')
  @HostBinding('class.justify-between')
  @HostBinding('class.items-center')
  cls = true;

  @Input()
  value: String = '';

  @Input()
  ctrlId = 'missing-id-' + Math.random().toString(36).substring(7);

  @Input()
  label: string = 'Unnamed';

  @Input()
  placeholder: string = '...';
}
