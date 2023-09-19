package de.sovity.authorityportal.api.model;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Available connector types.")
public enum ConnectorTypeDto {
    OWN,
    PROVIDED,
    CAAS
}
