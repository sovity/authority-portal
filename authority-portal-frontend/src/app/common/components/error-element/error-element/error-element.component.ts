import {Component, HostBinding, Input} from '@angular/core';

@Component({
  selector: 'app-error-element',
  templateUrl: './error-element.component.html',
})
export class ErrorElementComponent {
  @HostBinding('class.flex')
  @HostBinding('class.items-center')
  @HostBinding('class.justify-center')
  @HostBinding('class.text-center')
  @HostBinding('class.px-6')
  @HostBinding('class.py-24')
  @HostBinding('class.sm:py-32')
  @HostBinding('class.lg:px-8')
  cls = true;

  @Input() errorMessage: string = '';
}
