import {Component, HostBinding, Inject} from '@angular/core';
import {APP_CONFIG, AppConfig} from 'src/app/core/config/app-config';
import {FooterLink} from './footer-link.model';

@Component({
  selector: 'app-footer-links',
  templateUrl: './footer-links.component.html',
})
export class FooterLinksComponent {
  @HostBinding('class.flex')
  @HostBinding('class.justify-center')
  @HostBinding('class.items-center')
  @HostBinding('class.gap-4')
  cls = true;

  footerLinks: FooterLink[] = [
    {
      name: 'Privacy Policy',
      href: this.config.privacyPolicyUrl,
    },
    {
      name: 'Legal Notice',
      href: this.config.legalNoticeUrl,
    },
  ];

  constructor(@Inject(APP_CONFIG) public config: AppConfig) {}
}
