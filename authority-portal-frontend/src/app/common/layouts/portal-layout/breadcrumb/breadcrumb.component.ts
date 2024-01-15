import {Component, OnDestroy, inject} from '@angular/core';
import {NavigationEnd, Router} from '@angular/router';
import {Subscription, filter} from 'rxjs';
import {BreadcrumbItem} from './breadcrumb.model';

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
})
export class BreadcrumbComponent implements OnDestroy {
  fullRoute: BreadcrumbItem[] = [];
  nonLinkable: string[] = ['authority', 'users']; // these are routes that has no associated page
  routeSubscription!: Subscription;
  previousUrl: string = '';
  currentUrl: string = '';

  constructor() {
    const router = inject(Router);
    this.routeSubscription = router.events
      .pipe(filter((value) => value instanceof NavigationEnd))
      .subscribe((value) => {
        const navigationEnd = value as NavigationEnd;
        this.previousUrl = this.currentUrl;
        this.currentUrl = navigationEnd.url;
        this.fullRoute = [];
        let routes = router.url.toString().split('/');

        routes.forEach((r, idx) => {
          let originalRoute = r;

          if (
            idx === routes.length - 1 &&
            routes[routes.length - 2].toLowerCase() === 'users'
          ) {
            this.fullRoute.push({
              link: originalRoute,
              label: r,
              isLinkable: false,
            });
          } else {
            r = r
              .split('-')
              .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
              .join(' ');

            if (r.toLowerCase() != 'dashboard') {
              this.fullRoute.push(
                r === ''
                  ? {label: 'Home', link: '', isLinkable: true}
                  : {
                      link: originalRoute,
                      label: r.replace('_', ' ').replace('-', ' '),
                      isLinkable: !this.nonLinkable.includes(originalRoute),
                    },
              );
            }
          }
        });
        document.title =
          this.fullRoute[this.fullRoute.length - 1].label || 'Portal';
      });
  }

  ngOnDestroy(): void {
    this.routeSubscription.unsubscribe();
  }

  getLink(idx: number) {
    return this.fullRoute
      .slice(1, idx + 1)
      .map((s) => s.link)
      .join('/');
  }
}
