package de.sovity.authorityportal.api.model;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Possible user registration statuses.", enumAsRef = true)
public enum UserRegistrationStatusDto {
    FIRST_USER,         // Special status indicating the first user, only used on the first user registration
    INVITED,            // User that has been invited by another participant
    CREATED,            // Edge-case status, used between a self-registration and the first login
    ONBOARDING,         // User that has self-registered but needs to fill in missing data on login
    PENDING,            // User that has self-registered and is waiting for approval
    ACTIVE,             // User that has been approved and is active
    REJECTED,           // User that has been rejected
    DEACTIVATED         // User that has been deactivated, no access to the portal
}

