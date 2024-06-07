package de.sovity.authorityportal.api.model;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Result of the user deletion check.")
public class UserDeletionCheck {
    @Schema(description = "User's ID", requiredMode = Schema.RequiredMode.REQUIRED)
    String userId;
    @Schema(description = "Indicator if the user can be deleted", requiredMode = Schema.RequiredMode.REQUIRED)
    Boolean canBeDeleted;
    @Schema(description = "Indicator for the user being the last PA in their organization", requiredMode = Schema.RequiredMode.REQUIRED)
    Boolean isLastParticipantAdmin;
    @Schema(description = "Indicator for the user being the creator of their organization", requiredMode = Schema.RequiredMode.REQUIRED)
    Boolean isOrganizationCreator;
    @Schema(description = "List of possible successors (if needed)", requiredMode = Schema.RequiredMode.REQUIRED)
    List<PossibleCreatorSuccessor> possibleSuccessors;
}
