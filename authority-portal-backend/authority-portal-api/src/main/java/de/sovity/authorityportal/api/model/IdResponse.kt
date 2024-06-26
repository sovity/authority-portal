package de.sovity.authorityportal.api.model

import io.swagger.v3.oas.annotations.media.Schema
import java.time.OffsetDateTime

@Schema(description = "Wrapper for simple ID String responses.")
data class IdResponse(
    @field:Schema(description = "ID", requiredMode = Schema.RequiredMode.REQUIRED)
    val id: String,

    @field:Schema(description = "Date and time of response", requiredMode = Schema.RequiredMode.REQUIRED)
    val changedDate: OffsetDateTime,
) {
    constructor(id: String) : this(id, OffsetDateTime.now())
}
