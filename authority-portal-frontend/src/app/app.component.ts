import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subject, from, takeUntil} from 'rxjs';
import {buildAuthorityPortalClient} from '@sovity.de/authority-portal-client';
import {ApiService} from './services/api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'app';
  exampleDbQueryResult: string[] | null = null;
  constructor(private apiService: ApiService) {}
  ngOnInit() {
    // Run dummy request on page open
    this.apiService
      .exampleDbQuery()
      .pipe(takeUntil(this.ngOnDestroy$))
      .subscribe((exampleDbQueryResult) => {
        this.exampleDbQueryResult = exampleDbQueryResult;
      });
  }
  ngOnDestroy$ = new Subject();
  ngOnDestroy(): void {
    this.ngOnDestroy$.next(null);
    this.ngOnDestroy$.complete();
  }
}
