import {Component, Inject} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';
import {APP_CONFIG, AppConfig} from 'src/app/core/config/app-config';
import {IframeConfig} from 'src/app/shared/components/common/iframe/iframe.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard-page.component.html',
})
export class DashboardPageComponent {
  iframeConfigData: IframeConfig | null | undefined;

  constructor(
    @Inject(APP_CONFIG) public appConfig: AppConfig,
    private sanitizer: DomSanitizer,
  ) {
    if (this.appConfig.iframeUrl) {
      this.iframeConfigData = {
        srcUrl: this.sanitizer.bypassSecurityTrustResourceUrl(
          this.appConfig.iframeUrl,
        ),
        width: '100%',
        height: '100%',
      };
    }
  }
}
