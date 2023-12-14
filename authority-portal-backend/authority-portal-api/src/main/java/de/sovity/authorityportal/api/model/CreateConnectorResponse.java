package de.sovity.authorityportal.api.model;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.OffsetDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Response DTO for connector registration")
public class CreateConnectorResponse {

    @Schema(description = "ID of the connector", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    private String id;

    @Schema(description = "Date and time of response", requiredMode = Schema.RequiredMode.REQUIRED)
    private OffsetDateTime changedDate;

    @Schema(description = "Message status. Informs what type of action is necessary", requiredMode = Schema.RequiredMode.REQUIRED)
    private CreateConnectorStatusDto status;

    @Schema(description = "Optional error message", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    private String message;

    public static CreateConnectorResponse ok(String connectorId) {
        return new CreateConnectorResponse(connectorId, OffsetDateTime.now(), CreateConnectorStatusDto.OK, null);
    }

    public static CreateConnectorResponse error(String message) {
        return new CreateConnectorResponse(null, OffsetDateTime.now(), CreateConnectorStatusDto.ERROR, message);
    }

    public static CreateConnectorResponse warning(String connectorId, String message) {
        return new CreateConnectorResponse(connectorId, OffsetDateTime.now(), CreateConnectorStatusDto.WARNING, message);
    }
}
