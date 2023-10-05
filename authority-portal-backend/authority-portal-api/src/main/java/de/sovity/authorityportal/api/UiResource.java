package de.sovity.authorityportal.api;

import de.sovity.authorityportal.api.model.ConnectorDetailDto;
import de.sovity.authorityportal.api.model.ConnectorOverviewResult;
import de.sovity.authorityportal.api.model.CreateConnectorRequest;
import de.sovity.authorityportal.api.model.CreateOrganizationRequest;
import de.sovity.authorityportal.api.model.IdResponse;
import de.sovity.authorityportal.api.model.InviteParticipantUserRequest;
import de.sovity.authorityportal.api.model.OrganizationDetailResult;
import de.sovity.authorityportal.api.model.OrganizationOverviewResult;
import de.sovity.authorityportal.api.model.UserInfo;
import de.sovity.authorityportal.api.model.UserRegistrationStatusResult;
import de.sovity.authorityportal.api.model.UserRoleDto;
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
    IdResponse createOrganization(CreateOrganizationRequest organization);

    // Organization management (Internal)
    @PUT
    @Path("/organizations/my-org/users/{userId}/role")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    @Operation(description = "Change a user's participant role (PARTICIPANT_*) within their organization.")
    IdResponse changeParticipantRole(@PathParam("userId") String userId, UserRoleDto role);

    @POST
    @Path("/organizations/my-org/users/invite")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    @Operation(description = "Invite new user to a participating organization.")
    IdResponse inviteUser(InviteParticipantUserRequest invitationInformation);

    // Organization management (Authority)
    @PUT
    @Path("/authority/users/{userId}/role")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    @Operation(description = "Change a user's authority role (AUTHORITY_*).")
    IdResponse changeAuthorityRole(@PathParam("userId") String userId, UserRoleDto role);

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
    IdResponse approveOrganization(@PathParam("mdsId") String mdsId);

    @PUT
    @Path("/authority/organizations/{mdsId}/reject")
    @Produces(MediaType.APPLICATION_JSON)
    @Operation(description = "Reject a newly registered organization.")
    IdResponse rejectOrganization(@PathParam("mdsId") String mdsId);

    // Connector management
    @GET
    @Path("/organizations/my-org/connectors")
    @Produces(MediaType.APPLICATION_JSON)
    @Operation(description = "Get all connectors of a user's own organization.")
    ConnectorOverviewResult ownOrganizationConnectors();

    @GET
    @Path("/organizations/my-org/connectors/{connectorId}")
    @Produces(MediaType.APPLICATION_JSON)
    @Operation(description = "Get details of a user's own organization's connector.")
    ConnectorDetailDto ownOrganizationConnectorDetails(@PathParam("connectorId") String connectorId);

    @GET
    @Path("/organizations/{mdsId}/connectors")
    @Produces(MediaType.APPLICATION_JSON)
    @Operation(description = "Get all connectors of any organization.")
    ConnectorOverviewResult organizationConnectors(@PathParam("mdsId") String mdsId);

    @GET
    @Path("/organizations/{mdsId}/connectors/{connectorId}")
    @Produces(MediaType.APPLICATION_JSON)
    @Operation(description = "Get details of any connector of any organization.")
    ConnectorDetailDto connectorDetails(@PathParam("mdsId") String mdsId, @PathParam("connectorId") String connectorId);

    @POST
    @Path("/organizations/my-org/connectors/create-on-premise")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    @Operation(description = "Register a self-hosted connector.")
    IdResponse createOwnConnector(CreateConnectorRequest connector);

    @DELETE
    @Path("/organizations/my-org/connectors/{connectorId}")
    @Produces(MediaType.APPLICATION_JSON)
    @Operation(description = "Unregister a self-hosted connector.")
    IdResponse deleteOwnConnector(@PathParam("connectorId") String connectorId);

    @POST
    @Path("/organizations/{mdsId}/connectors/create-service-provided")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    @Operation(description = "Register a connector for another organization as a service provider.")
    IdResponse createProvidedConnector(@PathParam("mdsId") String mdsId, CreateConnectorRequest connector);

    @DELETE
    @Path("/organizations/{mdsId}/connectors/{connectorId}")
    @Produces(MediaType.APPLICATION_JSON)
    @Operation(description = "Unregister a connector for another organization as a service provider.")
    IdResponse deleteProvidedConnector(@PathParam("mdsId") String mdsId, @PathParam("connectorId") String connectorId);
}
