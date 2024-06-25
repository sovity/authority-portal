import {Component, HostBinding, Input} from '@angular/core';

@Component({
  selector: 'app-empty-element',
  templateUrl: './empty-element.component.html',
})
export class EmptyElementComponent {
  @HostBinding('class.flex')
  @HostBinding('class.flex-col')
  @HostBinding('class.justify-center')
  @HostBinding('class.items-center')
  @HostBinding('class.uppercase')
  @HostBinding('class.text-gray-500')
  cls = true;

  @Input()
  emptyMessage = '';
}
