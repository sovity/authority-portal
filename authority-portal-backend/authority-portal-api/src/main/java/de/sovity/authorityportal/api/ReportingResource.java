package de.sovity.authorityportal.api;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.core.Response;

@Path("/api/reporting/")
@Tag(name = "Reporting", description = "Authority Portal Reporting API Endpoints.")
public interface ReportingResource {

    @GET
    @Path("/my-org/connectors")
    @Produces("text/csv")
    @Operation(description = "Download own organization connectors information as csv")
    Response downloadOwnOrganizationConnectorsCsv(
        @QueryParam("environmentId")
        @Valid
        @NotBlank(message = "EnvironmentId cannot be blank")
        String environmentId
    );

    @GET
    @Path("/{mdsId}/connectors")
    @Produces("text/csv")
    @Operation(description = "Download organization connectors information as csv")
    Response downloadConnectorsCsv(
        @PathParam("mdsId")
        String mdsId,

        @QueryParam("environmentId")
        @Valid
        @NotBlank(message = "EnvironmentId cannot be blank")
        String environmentId
    );

    @GET
    @Path("/my-org/users")
    @Produces("text/csv")
    @Operation(description = "Download own organization's users reporting details.")
    Response ownOrganizationUserReportingDetails();

    @GET
    @Path("/{mdsId}/users")
    @Produces("text/csv")
    @Operation(description = "Download organization's users reporting details.")
    Response userReportingDetails(
        @PathParam("mdsId")
        String mdsId
    );
}
