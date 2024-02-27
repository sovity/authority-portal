import {Component, HostBinding} from '@angular/core';

@Component({
  selector: 'app-loading-element',
  templateUrl: './loading-element.component.html',
})
export class LoadingElementComponent {
  @HostBinding('class.flex')
  @HostBinding('class.items-center')
  @HostBinding('class.justify-center')
  cls = true;
}
