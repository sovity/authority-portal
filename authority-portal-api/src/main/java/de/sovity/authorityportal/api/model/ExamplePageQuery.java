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
@Schema(description = "Example Page Result Object. Don't forget to edit this documentation.")
public class ExamplePageQuery {
    @Schema(description = "Example Field", requiredMode = Schema.RequiredMode.REQUIRED)
    private String greeting;
}

