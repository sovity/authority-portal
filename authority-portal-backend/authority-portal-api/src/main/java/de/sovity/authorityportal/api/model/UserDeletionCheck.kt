package de.sovity.authorityportal.api.model

import com.fasterxml.jackson.annotation.JsonProperty
import io.swagger.v3.oas.annotations.media.Schema

@Schema(description = "Result of the user deletion check.")
class UserDeletionCheck(
    @field:Schema(description = "User's ID", requiredMode = Schema.RequiredMode.REQUIRED)
    val userId: String,

    @field:Schema(description = "Indicator if the user can be deleted", requiredMode = Schema.RequiredMode.REQUIRED)
    val canBeDeleted: Boolean,

    @field:Schema(
        description = "Indicator for the user being the last PA in their organization",
        requiredMode = Schema.RequiredMode.REQUIRED,
    )
    @JsonProperty("isLastParticipantAdmin")
    val isLastParticipantAdmin: Boolean,

    @field:Schema(
        description = "Indicator for the user being the creator of their organization",
        requiredMode = Schema.RequiredMode.REQUIRED,
        name = "isOrganizationCreator"
    )
    @JsonProperty("isOrganizationCreator")
    val isOrganizationCreator: Boolean,

    @field:Schema(description = "List of possible successors (if needed)", requiredMode = Schema.RequiredMode.REQUIRED)
    var possibleCreatorSuccessors: MutableList<PossibleCreatorSuccessor>,
)
