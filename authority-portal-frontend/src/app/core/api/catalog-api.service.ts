import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {
  CatalogApi,
  CatalogPageQuery,
  CatalogPageResult,
  DataOfferDetailPageQuery,
  DataOfferDetailPageResult,
} from '@sovity.de/authority-portal-client';
import {ApiClientFactory} from "./api-client-factory";
import {toObservable} from "../utils/rxjs-utils";

@Injectable()
export class CatalogApiService {

  constructor(private apiClientFactory: ApiClientFactory) {}

  catalogPage(
    environmentId: string,
    catalogPageQuery: CatalogPageQuery,
  ): Observable<CatalogPageResult> {
    return toObservable( () =>
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
