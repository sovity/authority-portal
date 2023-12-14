package de.sovity.authorityportal.api.model;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Possible status values for connector registration response", enumAsRef = true)
public enum CreateConnectorStatusDto {
    OK,
    WARNING,
    ERROR
}
