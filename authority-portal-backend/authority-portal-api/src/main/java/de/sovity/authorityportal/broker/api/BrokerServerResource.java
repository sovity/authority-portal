/*
 *  Copyright (c) 2023 sovity GmbH
 *
 *  This program and the accompanying materials are made available under the
 *  terms of the Apache License, Version 2.0 which is available at
 *  https://www.apache.org/licenses/LICENSE-2.0
 *
 *  SPDX-License-Identifier: Apache-2.0
 *
 *  Contributors:
 *       sovity GmbH - initial API and implementation
 *
 */

package de.sovity.authorityportal.broker.api;

import de.sovity.authorityportal.broker.api.model.CatalogPageQuery;
import de.sovity.authorityportal.broker.api.model.CatalogPageResult;
import de.sovity.authorityportal.broker.api.model.DataOfferDetailPageQuery;
import de.sovity.authorityportal.broker.api.model.DataOfferDetailPageResult;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.core.MediaType;

@Path("wrapper/broker")
@Tag(name = "Broker Server", description = "Broker Server API Endpoints. Requires the Broker Server Extension")
public interface BrokerServerResource {

    @POST
    @Path("catalog-page")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    @Operation(description = "Query the Broker's Catalog of Data Offers")
    CatalogPageResult catalogPage(@QueryParam("environment") String environment, CatalogPageQuery query);

    @POST
    @Path("data-offer-detail-page")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    @Operation(description = "Query a Data Offer's Detail Page")
    DataOfferDetailPageResult dataOfferDetailPage(@QueryParam("environment") String environment, DataOfferDetailPageQuery query);
}
