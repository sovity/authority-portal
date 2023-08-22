package de.sovity.authorityportal.api.model;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Object for containing the current registration status for a user.")
public class UserRegistrationStatusResult {
    @Schema(description = "Registration status", requiredMode = Schema.RequiredMode.REQUIRED)
    private UserRegistrationStatusDto registrationStatus;
}

