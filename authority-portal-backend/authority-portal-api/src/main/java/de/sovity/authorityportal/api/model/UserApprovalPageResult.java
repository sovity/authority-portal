package de.sovity.authorityportal.api.model;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.util.List;

@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "All data for user approval page.")
public class UserApprovalPageResult {
    @Schema(description = "Visible users.", requiredMode = Schema.RequiredMode.REQUIRED)
    private List<UserListEntryDto> users;
}

