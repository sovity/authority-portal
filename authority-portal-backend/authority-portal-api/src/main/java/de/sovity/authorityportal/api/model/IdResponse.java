package de.sovity.authorityportal.api.model;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.time.OffsetDateTime;

@Getter
@Setter
@ToString
@AllArgsConstructor
@Schema(description = "Wrapper for simple ID String responses.")
public class IdResponse {
    @Schema(description = "ID", requiredMode = Schema.RequiredMode.REQUIRED)
    private String id;

    @Schema(description = "Date and time of response", requiredMode = Schema.RequiredMode.REQUIRED)
    private OffsetDateTime changedDate;

    public IdResponse(String id) {
        this(id, OffsetDateTime.now());
    }
}
