import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {
  CatalogApi,
  CatalogPageQuery,
  CatalogPageResult,
  DataOfferDetailPageQuery,
  DataOfferDetailPageResult,
} from '@sovity.de/authority-portal-client';
import {ApiClientFactory} from "../../../../core/api/api-client-factory";
import {toObservable} from "../../../../core/utils/rxjs-utils";

@Injectable()
export class CatalogApiService {

  constructor(private apiClientFactory: ApiClientFactory) {}

  catalogPage(
    catalogPageQuery: CatalogPageQuery,
  ): Observable<CatalogPageResult> {
    return toObservable( () =>
      this.api().catalogPage({catalogPageQuery}),
    );
  }

  dataOfferDetailPage(
    dataOfferDetailPageQuery: DataOfferDetailPageQuery,
  ): Observable<DataOfferDetailPageResult> {
    return toObservable(() =>
      this.api().dataOfferDetailPage({
        dataOfferDetailPageQuery,
      }),
    );
  }

  private api(): CatalogApi {
    return this.apiClientFactory.newAuthorityPortalClient().catalogApi;
  }
}
