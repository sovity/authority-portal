package de.sovity.authorityportal.api.model

import io.swagger.v3.oas.annotations.media.Schema

@Schema(description = "Result of the user deletion check.")
class UserDeletionCheck(
    @Schema(description = "User's ID", requiredMode = Schema.RequiredMode.REQUIRED)
    val userId: String,

    @Schema(description = "Indicator if the user can be deleted", requiredMode = Schema.RequiredMode.REQUIRED)
    val canBeDeleted: Boolean,

    @Schema(
        description = "Indicator for the user being the last PA in their organization",
        requiredMode = Schema.RequiredMode.REQUIRED
    )
    val isLastParticipantAdmin: Boolean,

    @Schema(
        description = "Indicator for the user being the creator of their organization",
        requiredMode = Schema.RequiredMode.REQUIRED
    )
    val isOrganizationCreator: Boolean,

    @Schema(description = "List of possible successors (if needed)", requiredMode = Schema.RequiredMode.REQUIRED)
    val possibleSuccessors: List<PossibleCreatorSuccessor>,
)