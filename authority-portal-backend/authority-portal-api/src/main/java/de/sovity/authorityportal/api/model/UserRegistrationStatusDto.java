package de.sovity.authorityportal.api.model;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Possible user registration statuses.", enumAsRef = true)
public enum UserRegistrationStatusDto {
    FIRST_USER,
    INVITED,
    CREATED,
    PENDING,
    ACTIVE,
    REJECTED,
    DEACTIVATED
}

