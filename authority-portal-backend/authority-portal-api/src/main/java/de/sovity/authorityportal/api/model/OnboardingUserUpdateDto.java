package de.sovity.authorityportal.api.model;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Information about the user provided while onboarding.")
public class OnboardingUserUpdateDto {

    @NotBlank(message = "First name cannot be blank.")
    @Schema(description = "First name", requiredMode = Schema.RequiredMode.REQUIRED)
    private String firstName;

    @NotBlank(message = "Last name cannot be blank.")
    @Schema(description = "Last name", requiredMode = Schema.RequiredMode.REQUIRED)
    private String lastName;

    @NotBlank(message = "Job title cannot be blank.")
    @Schema(description = "Job title", requiredMode = Schema.RequiredMode.REQUIRED)
    private String jobTitle;

    @NotBlank(message = "Phone number cannot be blank.")
    @Schema(description = "Phone number", requiredMode = Schema.RequiredMode.REQUIRED)
    private String phoneNumber;
}
