package de.sovity.authorityportal.api.model

import io.swagger.v3.oas.annotations.media.Schema

@Schema(description = "Response for the availability of free CaaS")
data class CaasAvailabilityResponse(
    @field:Schema(description = "CaaS limit for your organization")
    val limit: Int,

    @field:Schema(description = "CaaS usage for your organization")
    val current: Int
)
