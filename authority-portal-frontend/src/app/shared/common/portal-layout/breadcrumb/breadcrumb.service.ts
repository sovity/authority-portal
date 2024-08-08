/*
 * Copyright (c) 2024 sovity GmbH
 *
 * This program and the accompanying materials are made available under the
 * terms of the Apache License, Version 2.0 which is available at
 * https://www.apache.org/licenses/LICENSE-2.0
 *
 * SPDX-License-Identifier: Apache-2.0
 *
 * Contributors:
 *      sovity GmbH - initial implementation
 */
import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {BehaviorSubject, Observable, combineLatest} from 'rxjs';
import {distinctUntilChanged, filter, map} from 'rxjs/operators';
import {ActiveFeatureSet} from 'src/app/core/services/config/active-feature-set';
import {kebabCaseToSentenceCase} from 'src/app/core/utils/string-utils';
import {BreadcrumbItem} from './breadcrumb.model';

@Injectable({providedIn: 'root'})
export class BreadcrumbService {
  nonLinkable: string[] = [
    'authority',
    'users',
    'service-partner',
    'operator',
    'my-organization',
    'control-center',
  ]; // these are routes that has no associated page

  private replacements = new Map<string, string>();
  private replacementsChange$ = new BehaviorSubject<null>(null);

  breadcrumb$ = new BehaviorSubject<BreadcrumbItem[]>([]);

  constructor(
    private router: Router,
    private activeFeatureSet: ActiveFeatureSet,
  ) {
    combineLatest([this.url$(), this.replacementsChange$]).subscribe(
      ([url, _]) => {
        const breadcrumb = this.buildBreadcrumb(url);
        document.title = `${
          this.activeFeatureSet.usesMdsId()
            ? 'MDS '
            : breadcrumb[breadcrumb.length - 1].label || 'Authority Portal'
        }`;
        this.breadcrumb$.next(breadcrumb);
      },
    );
  }

  buildBreadcrumb(url: string): BreadcrumbItem[] {
    let withoutQuery = url.includes('?') ? url.split('?')[0] : url;
    let segments = withoutQuery
      .split('/')
      .filter((segment) => segment !== '' && segment !== 'control-center');

    if (segments.length === 1 && segments[0] === 'mds-home') {
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
