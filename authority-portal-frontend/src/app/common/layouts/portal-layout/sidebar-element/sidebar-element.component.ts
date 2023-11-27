import {Component, Input} from '@angular/core';
import {SidebarMenu} from './sidebar-element.model';

@Component({
  selector: 'app-sidebar-element',
  templateUrl: './sidebar-element.component.html',
})
export class SidebarElementComponent {
  @Input() sidebarMenu!: SidebarMenu;
  @Input() isExpandedMenu!: boolean;
}
