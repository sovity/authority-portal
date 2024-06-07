package de.sovity.authorityportal.api.model

import io.swagger.v3.oas.annotations.media.Schema

@Schema(description = "Possible successor (Participant Admin), if a users gets deleted, that is creator of an organization.")
class PossibleCreatorSuccessor(
    @Schema(description = "ID", requiredMode = Schema.RequiredMode.REQUIRED)
    val userId: String,
    @Schema(description = "First name", requiredMode = Schema.RequiredMode.REQUIRED)
    val firstName: String,
    @Schema(description = "Last name", requiredMode = Schema.RequiredMode.REQUIRED)
    val lastName: String,
)
