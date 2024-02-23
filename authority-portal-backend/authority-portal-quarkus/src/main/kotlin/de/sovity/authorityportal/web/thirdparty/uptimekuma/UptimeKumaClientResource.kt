package de.sovity.authorityportal.web.thirdparty.uptimekuma

import jakarta.ws.rs.GET
import jakarta.ws.rs.HeaderParam
import jakarta.ws.rs.Path
import jakarta.ws.rs.Produces
import jakarta.ws.rs.core.MediaType

interface UptimeKumaClientResource {

    @GET
    @Path("metrics")
    @Produces(MediaType.TEXT_PLAIN)
    fun getMetrics(
        @HeaderParam("Authorization") basicAuthHeader: String
    ): String
}
