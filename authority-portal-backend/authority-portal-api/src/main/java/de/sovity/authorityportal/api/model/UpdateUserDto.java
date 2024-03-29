package de.sovity.authorityportal.api.model;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
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
@Schema(description = "Information about the user.")
public class UpdateUserDto {

    @Schema(description = "User's First name", requiredMode = Schema.RequiredMode.REQUIRED)
    private String firstName;

    @NotBlank(message = "User's Last name cannot be blank")
    @Schema(description = "User's Last name", requiredMode = Schema.RequiredMode.REQUIRED)
    private String lastName;

    @NotBlank(message = "User's Job title cannot be blank")
    @Schema(description = "User's Job title", requiredMode = Schema.RequiredMode.REQUIRED)
    private String jobTitle;

    @NotBlank(message = "User's Phone number cannot be blank")
    @Schema(description = "User's Phone number", requiredMode = Schema.RequiredMode.REQUIRED)
    private String phone;

    @NotBlank(message = "User's email cannot be blank")
    @Schema(description = "User's email", requiredMode = Schema.RequiredMode.REQUIRED)
    private String email;
}
