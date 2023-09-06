import {Component, HostBinding} from '@angular/core';

@Component({
  selector: 'app-authority-layout',
  templateUrl: './authority-layout.component.html',
})
export class AuthorityLayoutComponent {
  @HostBinding('class.flex')
  @HostBinding('class.flex-row')
  cls = true;
}
