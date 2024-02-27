import {Component, OnDestroy} from '@angular/core';
import {Subject, takeUntil} from 'rxjs';
import {BreadcrumbItem} from './breadcrumb.model';
import {BreadcrumbService} from './breadcrumb.service';

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
})
export class BreadcrumbComponent implements OnDestroy {
  breadcrumb: BreadcrumbItem[] = [];

  constructor(private breadcrumbService: BreadcrumbService) {
    this.breadcrumbService.breadcrumb$
      .pipe(takeUntil(this.ngOnDestroy$))
      .subscribe((breadcrumb) => {
        this.breadcrumb = breadcrumb;
      });
  }

  ngOnDestroy$ = new Subject();

  ngOnDestroy(): void {
    this.ngOnDestroy$.next(null);
    this.ngOnDestroy$.complete();
  }

  getLink(idx: number) {
    return this.breadcrumb
      .slice(1, idx + 1)
      .map((s) => s.link)
      .join('/');
  }
}
