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
@Schema(description = "Connector object for connector registration.")
public class CreateConnectorRequest {
    @Schema(description = "Name", requiredMode = Schema.RequiredMode.REQUIRED)
    private String name;
    @Schema(description = "Location", requiredMode = Schema.RequiredMode.REQUIRED)
    private String location;
    @Schema(description = "URL of the connector endpoint", requiredMode = Schema.RequiredMode.REQUIRED)
    private String url;
    @Schema(description = "Public key of certificate", requiredMode = Schema.RequiredMode.REQUIRED)
    private String certificate;
}
