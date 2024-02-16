import {Component, EventEmitter, Input, Output} from '@angular/core';
import {HeaderBarConfig} from 'src/app/shared/components/common/header-bar/header-bar.model';

@Component({
  selector: 'app-header',
  templateUrl: './header-bar.component.html',
})
export class HeaderBarComponent {
  @Input() headerConfig!: HeaderBarConfig;
}
