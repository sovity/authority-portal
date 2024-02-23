package de.sovity.authorityportal.api.model;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Possible component statuses.", enumAsRef = true)
public enum ComponentStatusDto {
    UP,
    DOWN,
    PENDING,
    MAINTENANCE
}
