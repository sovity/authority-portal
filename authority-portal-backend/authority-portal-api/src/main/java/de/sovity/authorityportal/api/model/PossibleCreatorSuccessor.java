package de.sovity.authorityportal.api.model;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Possible successor (Participant Admin), if a users gets deleted, that is creator of an organization.")
public class PossibleCreatorSuccessor {
    @Schema(description = "ID", requiredMode = Schema.RequiredMode.REQUIRED)
    String userId;
    @Schema(description = "First name", requiredMode = Schema.RequiredMode.REQUIRED)
    String firstName;
    @Schema(description = "Last name", requiredMode = Schema.RequiredMode.REQUIRED)
    String lastName;
}
