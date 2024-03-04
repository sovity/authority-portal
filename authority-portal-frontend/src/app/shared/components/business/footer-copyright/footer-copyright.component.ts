import {Component, HostBinding} from '@angular/core';

@Component({
  selector: 'app-footer-copyright',
  templateUrl: './footer-copyright.component.html',
})
export class FooterCopyrightComponent {
  @HostBinding('class.flex')
  @HostBinding('class.justify-center')
  @HostBinding('class.items-center')
  cls = true;

  thisYear: number = new Date().getFullYear();
}
