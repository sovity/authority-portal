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
import {Observable} from 'rxjs';
import {
  CatalogApi,
  CatalogPageQuery,
  CatalogPageResult,
  DataOfferDetailPageQuery,
  DataOfferDetailPageResult,
} from '@sovity.de/authority-portal-client';
import {toObservable} from '../utils/rxjs-utils';
import {ApiClientFactory} from './api-client-factory';

@Injectable()
export class CatalogApiService {
  constructor(private apiClientFactory: ApiClientFactory) {}

  catalogPage(
    environmentId: string,
    catalogPageQuery: CatalogPageQuery,
  ): Observable<CatalogPageResult> {
    return toObservable(() =>
      this.api().catalogPage({environmentId, catalogPageQuery}),
    );
  }

  dataOfferDetailPage(
    environmentId: string,
    dataOfferDetailPageQuery: DataOfferDetailPageQuery,
  ): Observable<DataOfferDetailPageResult> {
    return toObservable(() =>
      this.api().dataOfferDetailPage({
        environmentId,
        dataOfferDetailPageQuery,
      }),
    );
  }

  private api(): CatalogApi {
    return this.apiClientFactory.newAuthorityPortalClient().catalogApi;
  }
}
