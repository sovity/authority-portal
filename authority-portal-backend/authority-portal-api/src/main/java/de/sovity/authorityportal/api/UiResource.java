package de.sovity.authorityportal.api;

import de.sovity.authorityportal.api.model.CreateConnectorRequest;
import de.sovity.authorityportal.api.model.CreateOrganizationRequest;
import de.sovity.authorityportal.api.model.OrganizationDetailResult;
import de.sovity.authorityportal.api.model.OrganizationOverviewResult;
import de.sovity.authorityportal.api.model.UserInfo;
import de.sovity.authorityportal.api.model.UserRegistrationStatusResult;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.DELETE;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.PUT;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;

@Path("/api/")
@Tag(name = "Ui", description = "Authority Portal UI API Endpoints.")
public interface UiResource {

    // User info
    @GET
    @Path("/user-info")
    @Produces(MediaType.APPLICATION_JSON)
    @Operation(description = "Get the current user's info.")
    UserInfo userInfo();

    // Registration
    @GET
    @Path("/registration/registration-status")
    @Produces(MediaType.APPLICATION_JSON)
    @Operation(description = "Get a user's own registration status.")
    UserRegistrationStatusResult userRegistrationStatus();

    @POST
    @Path("/registration/organization")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    @Operation(description = "Create an organization for a user.")
    String createOrganization(CreateOrganizationRequest organization);

    // Organization management
    @GET
    @Path("/authority/organizations")
    @Produces(MediaType.APPLICATION_JSON)
    @Operation(description = "Get all participating organizations with their status.")
    OrganizationOverviewResult organizationsOverview();

    @GET
    @Path("/authority/organizations/{mdsId}")
    @Produces(MediaType.APPLICATION_JSON)
    @Operation(description = "Get an organization's detail information with their status.")
    OrganizationDetailResult organizationDetails(@PathParam("mdsId") String mdsId);

    @PUT
    @Path("/authority/organizations/{mdsId}/approve")
    @Produces(MediaType.APPLICATION_JSON)
    @Operation(description = "Approve a newly registered organization.")
    String approveOrganization(@PathParam("mdsId") String mdsId);

    @PUT
    @Path("/authority/organizations/{mdsId}/reject")
    @Produces(MediaType.APPLICATION_JSON)
    @Operation(description = "Reject a newly registered organization.")
    String rejectOrganization(@PathParam("mdsId") String mdsId);

    // Connector management
    @POST
    @Path("/organizations/my-org/connectors/create-on-premise")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    @Operation(description = "Register a self-hosted connector.")
    String createOwnConnector(CreateConnectorRequest connector);

    @DELETE
    @Path("/organizations/my-org/connectors/{connectorId}")
    @Produces(MediaType.APPLICATION_JSON)
    @Operation(description = "Unregister a self-hosted connector.")
    String deleteOwnConnector(@PathParam("connectorId") String connectorId);

    @POST
    @Path("/organizations/{mdsId}/connectors/create-service-provided")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    @Operation(description = "Register a connector for another organization as a service provider.")
    String createProvidedConnector(@PathParam("mdsId") String mdsId, CreateConnectorRequest connector);

    @DELETE
    @Path("/organizations/{mdsId}/connectors/{connectorId}")
    @Produces(MediaType.APPLICATION_JSON)
    @Operation(description = "Unregister a connector for another organization as a service provider.")
    String deleteProvidedConnector(@PathParam("mdsId") String mdsId, @PathParam("connectorId") String connectorId);
}
