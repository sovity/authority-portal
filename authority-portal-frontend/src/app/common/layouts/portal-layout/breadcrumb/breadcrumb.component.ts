import {Component, OnDestroy, OnInit, inject} from '@angular/core';
import {NavigationEnd, Router} from '@angular/router';
import {Subscription, filter} from 'rxjs';

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
})
export class BreadcrumbComponent implements OnDestroy {
  fullRoute: string[] = [];
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
        router.url
          .toString()
          .split('/')
          .forEach((r, idx) => {
            r = r.charAt(0).toUpperCase() + r.slice(1);
            if (r.toLowerCase() != 'dashboard') {
              this.fullRoute.push(
                r === '' ? 'Home' : r.replace('_', ' ').replace('-', ' '),
              );
            }
          });
        document.title = this.fullRoute[this.fullRoute.length - 1] || 'Portal';
      });
  }

  ngOnDestroy(): void {
    this.routeSubscription.unsubscribe();
  }

  getLink(idx: number) {
    return this.fullRoute
      .slice(1, idx + 1)
      .map((s) => s.toLowerCase().replace(' ', '-').replace('_', '-'))
      .join('/');
  }
}
