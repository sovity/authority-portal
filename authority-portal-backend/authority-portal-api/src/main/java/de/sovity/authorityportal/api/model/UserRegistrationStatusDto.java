package de.sovity.authorityportal.api.model;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Possible user registration statuses.")
public enum UserRegistrationStatusDto {
    CREATED,
    PENDING,
    APPROVED,
    REJECTED,
}

