package de.sovity.authorityportal.web.thirdparty.broker

import de.sovity.authorityportal.web.thirdparty.broker.model.DataOfferCountResult
import jakarta.ws.rs.Consumes
import jakarta.ws.rs.DELETE
import jakarta.ws.rs.HeaderParam
import jakarta.ws.rs.POST
import jakarta.ws.rs.PUT
import jakarta.ws.rs.Path
import jakarta.ws.rs.QueryParam
import jakarta.ws.rs.core.MediaType
import jakarta.ws.rs.core.Response

@Path("backend/api/v1/management/wrapper/broker")
interface BrokerClientResource {

    @PUT
    @Path("connectors")
    @Consumes(MediaType.APPLICATION_JSON)
    fun addConnectors(
        @HeaderParam("X-Api-Key") apiKey: String,
        @QueryParam("adminApiKey") adminApiKey: String,
        connectors: List<String>
    ): Response

    @DELETE
    @Path("connectors")
    @Consumes(MediaType.APPLICATION_JSON)
    fun removeConnectors(
        @HeaderParam("X-Api-Key") apiKey: String,
        @QueryParam("adminApiKey") adminApiKey: String,
        connectors: List<String>
    ): Response

    @POST
    @Path("authority-portal-api/data-offer-counts")
    @Consumes(MediaType.APPLICATION_JSON)
    fun getDataOfferCounts(
        @HeaderParam("X-Api-Key") apiKey: String,
        connectors: List<String>
    ): DataOfferCountResult
}
