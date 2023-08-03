package de.sovity.authorityportal.api;

import io.swagger.v3.oas.annotations.ExternalDocumentation;
import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Contact;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.info.License;
import jakarta.ws.rs.core.Application;

@OpenAPIDefinition(
        info = @Info(
                title = "Authority Portal API",
                version = "0.0.0",
                description = "REST API for sovity's Dataspace Authority Portal.",
                contact = @Contact(
                        name = "sovity GmbH",
                        email = "contact@sovity.de",
                        url = "https://github.com/sovity/ authority-portal-backend/issues/new/choose"
                ),
                license = @License(
                        name = "UNLICENSED",
                        url = "https://github.com/sovity/ authority-portal-backend/blob/main/LICENSE"
                )
        ),
        externalDocs = @ExternalDocumentation(
                description = "Authority Portal API definitions.",
                url = "https://github.com/sovity/ authority-portal-backend/tree/main/authority-portal-api"
        )
)
public class AuthorityPortalApplication extends Application {
}
