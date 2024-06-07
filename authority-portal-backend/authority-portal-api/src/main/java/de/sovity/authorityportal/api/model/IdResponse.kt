package de.sovity.authorityportal.api.model

import io.swagger.v3.oas.annotations.media.Schema
import lombok.AllArgsConstructor
import lombok.Getter
import lombok.Setter
import lombok.ToString
import java.time.OffsetDateTime

@Schema(description = "Wrapper for simple ID String responses.")
class IdResponse(
    @Schema(description = "ID", requiredMode = Schema.RequiredMode.REQUIRED)
    val id: String,

    @Schema(description = "Date and time of response", requiredMode = Schema.RequiredMode.REQUIRED)
    val changedDate: OffsetDateTime,
) {
    constructor(id: String) : this(id, OffsetDateTime.now())
}
