import {Component, HostBinding} from '@angular/core';

@Component({
  selector: 'app-footer-for-full-page',
  templateUrl: './footer-for-full-page.component.html',
})
export class FooterForFullPageComponent {
  @HostBinding('class.md:fixed')
  @HostBinding('class.md:left-0')
  @HostBinding('class.md:bottom-0')
  @HostBinding('class.px-10')
  @HostBinding('class.py-5')
  @HostBinding('class.text-xs')
  @HostBinding('class.text-gray-700')
  @HostBinding('class.flex')
  @HostBinding('class.justify-center')
  @HostBinding('class.gap-4')
  cls = true;
}
