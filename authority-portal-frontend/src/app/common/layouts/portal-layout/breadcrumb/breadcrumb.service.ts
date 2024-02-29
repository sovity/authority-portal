import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {BehaviorSubject, Observable, combineLatest} from 'rxjs';
import {distinctUntilChanged, filter, map} from 'rxjs/operators';
import {kebabCaseToSentenceCase} from '../../../../core/utils/string-utils';
import {BreadcrumbItem} from './breadcrumb.model';

@Injectable({providedIn: 'root'})
export class BreadcrumbService {
  nonLinkable: string[] = ['authority', 'users']; // these are routes that has no associated page

  private replacements = new Map<string, string>();
  private replacementsChange$ = new BehaviorSubject<null>(null);

  breadcrumb$ = new BehaviorSubject<BreadcrumbItem[]>([]);

  constructor(private router: Router) {
    combineLatest([this.url$(), this.replacementsChange$]).subscribe(
      ([url, _]) => {
        const breadcrumb = this.buildBreadcrumb(url);
        document.title = breadcrumb[breadcrumb.length - 1].label || 'Portal';
        this.breadcrumb$.next(breadcrumb);
      },
    );
  }

  buildBreadcrumb(url: string): BreadcrumbItem[] {
    let withoutQuery = url.includes('?') ? url.split('?')[0] : url;
    let segments = withoutQuery.split('/').filter((segment) => segment !== '');

    if (segments.length === 1 && segments[0] === 'dashboard') {
      segments = [];
    }

    return [
      {label: 'Home', link: '', isLinkable: true},
      ...segments.map((segment) => ({
        link: segment,
        label: kebabCaseToSentenceCase(
          this.replacements.get(segment) ?? segment,
        ),
        isLinkable: !this.nonLinkable.includes(segment),
      })),
    ];
  }

  private url$(): Observable<string> {
    return this.router.events.pipe(
      map((it) => (it as any)['url']),
      filter((it) => !!it),
      distinctUntilChanged(),
    );
  }

  addReplacement(search: string, replace: string) {
    this.replacements.set(search, replace);
    this.replacementsChange$.next(null);
  }
}
