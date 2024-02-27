import {Component} from '@angular/core';
import {CONTROL_CENTER_ROUTES} from '../control-center-routes';

export interface ControlCenterTab {
  title: string;
  routerLink: string[];
}

@Component({
  selector: 'app-control-center-page',
  templateUrl: './control-center-page.component.html',
})
export class ControlCenterPageComponent {
  tabs: ControlCenterTab[] = this.buildControlCenterTabs();

  private buildControlCenterTabs(): ControlCenterTab[] {
    let tabs = CONTROL_CENTER_ROUTES.filter((it) => !it.data.excludeFromTabs);
    return tabs.map((it) => ({
      title: it.data.title,
      routerLink: ['/control-center', it.path!],
    }));
  }
}
