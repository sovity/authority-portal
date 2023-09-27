import {Component, HostBinding} from '@angular/core';

@Component({
  selector: 'app-portal-layout',
  templateUrl: './portal-layout.component.html',
})
export class PortalLayoutComponent {
  @HostBinding('class.flex')
  @HostBinding('class.flex-row')
  cls = true;
}
