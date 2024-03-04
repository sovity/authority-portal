import {Component, HostBinding, Inject} from '@angular/core';
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';
import {APP_CONFIG, AppConfig} from 'src/app/core/config/app-config';

@Component({
  selector: 'app-mds-home',
  templateUrl: './mds-home.component.html',
})
export class MdsHomePageComponent {
  @HostBinding('class.flex-1')
  @HostBinding('class.flex')
  @HostBinding('class.items-stretch')
  cls = true;

  loaded = false;

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
