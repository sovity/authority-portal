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
        this.fullRoute = this.createBreadcrumb(router.url);
        document.title =
          this.fullRoute[this.fullRoute.length - 1].label || 'Portal';
      });
  }

  createBreadcrumb(url: string): BreadcrumbItem[] {
    let segments = url.split('/').filter((segment) => segment !== ''); // Remove empty segments
    segments = [...segments[segments.length - 1].split('?tab=')]; // Split the last segment by query params
    const breadcrumb: BreadcrumbItem[] = [];
    breadcrumb.push({label: 'Home', link: '', isLinkable: true});

    segments.forEach((segment, idx) => {
      let originalSegment = segment;
      segment = segment
        .split('-')
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');
      if (segment.toLocaleLowerCase() != 'dashboard') {
        breadcrumb.push({
          link: originalSegment,
          label: segment.replace('_', ' ').replace('-', ' '),
          isLinkable: !this.nonLinkable.includes(originalSegment),
        });
      }
    });

    return breadcrumb;
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
