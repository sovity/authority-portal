import {Component, HostBinding, Inject} from '@angular/core';
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';
import {APP_CONFIG, AppConfig} from 'src/app/core/config/app-config';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard-page.component.html',
})
export class DashboardPageComponent {
  @HostBinding('class.flex-1')
  @HostBinding('class.flex')
  @HostBinding('class.items-stretch')
  cls = true;

  iframeUrl: SafeResourceUrl | null = null;

  constructor(
    @Inject(APP_CONFIG) public appConfig: AppConfig,
    private sanitizer: DomSanitizer,
  ) {
    if (this.appConfig.iframeUrl) {
      this.iframeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
        this.appConfig.iframeUrl,
      );
    }
  }
}
