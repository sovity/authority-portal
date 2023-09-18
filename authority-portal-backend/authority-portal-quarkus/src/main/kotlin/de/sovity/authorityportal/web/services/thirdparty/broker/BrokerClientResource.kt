package de.sovity.authorityportal.web.services.thirdparty.broker

import jakarta.ws.rs.Consumes
import jakarta.ws.rs.HeaderParam
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
}
