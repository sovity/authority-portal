package de.sovity.authorityportal.api;

import de.sovity.authorityportal.api.model.CaasAvailabilityResponse;
import de.sovity.authorityportal.api.model.CentralComponentCreateRequest;
import de.sovity.authorityportal.api.model.CentralComponentDto;
import de.sovity.authorityportal.api.model.ComponentStatusOverview;
import de.sovity.authorityportal.api.model.ConnectorDetailDto;
import de.sovity.authorityportal.api.model.ConnectorOverviewResult;
import de.sovity.authorityportal.api.model.CreateCaasRequest;
import de.sovity.authorityportal.api.model.CreateConnectorRequest;
import de.sovity.authorityportal.api.model.CreateConnectorResponse;
import de.sovity.authorityportal.api.model.DeploymentEnvironmentDto;
import de.sovity.authorityportal.api.model.IdResponse;
import de.sovity.authorityportal.api.model.InviteOrganizationRequest;
import de.sovity.authorityportal.api.model.InviteParticipantUserRequest;
import de.sovity.authorityportal.api.model.OnboardingUserUpdateDto;
import de.sovity.authorityportal.api.model.ProvidedConnectorOverviewResult;
import de.sovity.authorityportal.api.model.RegistrationRequestDto;
import de.sovity.authorityportal.api.model.UpdateOrganizationDto;
import de.sovity.authorityportal.api.model.UpdateUserDto;
import de.sovity.authorityportal.api.model.UserDeletionCheck;
import de.sovity.authorityportal.api.model.UserDetailDto;
import de.sovity.authorityportal.api.model.UserInfo;
import de.sovity.authorityportal.api.model.UserRegistrationStatusResult;
import de.sovity.authorityportal.api.model.UserRoleDto;
import de.sovity.authorityportal.api.model.organization.OnboardingOrganizationUpdateDto;
import de.sovity.authorityportal.api.model.organization.OrganizationDetailsDto;
import de.sovity.authorityportal.api.model.organization.OrganizationOverviewResult;
import de.sovity.authorityportal.api.model.organization.OwnOrganizationDetailsDto;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.DELETE;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.PUT;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import java.util.List;

@Path("/api/")
@Tag(name = "Ui", description = "Authority Portal UI API Endpoints.")
public interface UiResource {

    // User info
    @GET
    @Path("/user-info")
    @Produces(MediaType.APPLICATION_JSON)
    @Operation(description = "Get the current user's info.")
    UserInfo userInfo();

    @GET
    @Path("/users/{userId}")
    @Produces(MediaType.APPLICATION_JSON)
    @Operation(description = "Get the user's details.")
    UserDetailDto userDetails(@PathParam("userId") String userId);

    // Registration
    @GET
    @Path("/registration/registration-status")
    @Produces(MediaType.APPLICATION_JSON)
    @Operation(description = "Get a user's own registration status.")
    UserRegistrationStatusResult userRegistrationStatus();

    // Organization management (Internal)
    @PUT
    @Path("/organizations/my-org/users/{userId}/role")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    @Operation(description = "Change a user's participant role (PARTICIPANT_*) within their organization.")
    IdResponse changeParticipantRole(
        @PathParam("userId")
        String userId,

        @Valid
        @NotNull(message = "Role cannot be null")
        UserRoleDto role
    );

    @POST
    @Path("/organizations/my-org/users/invite")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    @Operation(description = "Invite new user to a participating organization.")
    IdResponse inviteUser(
        @Valid
        @NotNull(message = "Invitation information cannot be null")
        InviteParticipantUserRequest invitationInformation
    );

    @PUT
    @Path("/organizations/my-org/users/{userId}/deactivate")
    @Produces(MediaType.APPLICATION_JSON)
    @Operation(description = "Deactivate a user of a participating organization.")
    IdResponse deactivateParticipantUser(@PathParam("userId") String userId);

    @PUT
    @Path("/organizations/my-org/users/{userId}/reactivate")
    @Produces(MediaType.APPLICATION_JSON)
    @Operation(description = "Reactivate a user of a participating organization.")
    IdResponse reactivateParticipantUser(@PathParam("userId") String userId);

    // Organization management (Authority)
    @PUT
    @Path("/authority/users/{userId}/role")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    @Operation(description = "Change a user's application role.")
    IdResponse changeApplicationRole(
        @PathParam("userId")
        String userId,

        @Valid
        @NotNull(message = "Role cannot be null")
        UserRoleDto role
    );

    @DELETE
    @Path("/authority/users/{userId}/role")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    @Operation(description = "Clear a user's application role.")
    IdResponse clearApplicationRole(@PathParam("userId") String userId);

    @PUT
    @Path("/authority/users/{userId}/deactivate")
    @Produces(MediaType.APPLICATION_JSON)
    @Operation(description = "Deactivate a user of any organization.")
    IdResponse deactivateAnyUser(@PathParam("userId") String userId);

    @PUT
    @Path("/authority/users/{userId}/reactivate")
    @Produces(MediaType.APPLICATION_JSON)
    @Operation(description = "Reactivate a user of any organization.")
    IdResponse reactivateAnyUser(@PathParam("userId") String userId);

    @GET
    @Path("/users/{userId}/check-delete")
    @Produces(MediaType.APPLICATION_JSON)
    @Operation(description = "Check under which conditions a user can be deleted from an organization.")
    UserDeletionCheck checkUserDeletion(
        @PathParam("userId")
        String userId
    );

    @DELETE
    @Path("/users/{userId}")
    @Produces(MediaType.APPLICATION_JSON)
    @Operation(description = "Delete user with respect to organizations and connectors associated with them.")
    IdResponse deleteUser(
        @PathParam("userId")
        String userId,

        // This parameter might be null, if no successor is needed
        @QueryParam("successorUserId")
        String successorUserId
    );

    @GET
    @Path("/authority/organizations")
    @Produces(MediaType.APPLICATION_JSON)
    @Operation(description = "Get all participating organizations with their status.")
    OrganizationOverviewResult organizationsOverviewForAuthority(
        @QueryParam("environmentId")
        @Valid
        @NotBlank(message = "EnvironmentId cannot be blank")
        String environmentId
    );

    @GET
    @Path("/application/organizations")
    @Produces(MediaType.APPLICATION_JSON)
    @Operation(description = "Get all participating organizations with their status. (For Service Partners and Operators)")
    OrganizationOverviewResult organizationsOverview(
        @QueryParam("environmentId")
        @Valid
        @NotBlank(message = "EnvironmentId cannot be blank")
        String environmentId
    );

    @GET
    @Path("/authority/connectors/{connectorId}")
    @Produces(MediaType.APPLICATION_JSON)
    @Operation(description = "Get all connectors of all participating organizations.")
    ConnectorDetailDto getAuthorityConnector(
        @PathParam("connectorId")
        String connectorId
    );

    @GET
    @Path("/authority/connectors")
    @Produces(MediaType.APPLICATION_JSON)
    @Operation(description = "Get all connectors of all participating organizations.")
    ConnectorOverviewResult getAllConnectors(
        @QueryParam("environmentId")
        @Valid
        @NotBlank(message = "EnvironmentId cannot be blank")
        String environmentId
    );

    @GET
    @Path("/organizations/my-org")
    @Produces(MediaType.APPLICATION_JSON)
    @Operation(description = "Get details of own organization.")
    OwnOrganizationDetailsDto ownOrganizationDetails();

    @GET
    @Path("/authority/organizations/{mdsId}")
    @Produces(MediaType.APPLICATION_JSON)
    @Operation(description = "Get details of any organization.")
    OrganizationDetailsDto organizationDetailsForAuthority(
        @PathParam("mdsId")
        String mdsId,

        @QueryParam("environmentId")
        @Valid
        @NotBlank(message = "EnvironmentId cannot be blank")
        String environmentId
    );

    @GET
    @Path("/application/organizations/{mdsId}")
    @Produces(MediaType.APPLICATION_JSON)
    @Operation(description = "Get details of any organization. (For Service Partners and Operators)")
    OrganizationDetailsDto organizationDetails(
        @PathParam("mdsId")
        String mdsId,

        @QueryParam("environmentId")
        @Valid
        @NotBlank(message = "EnvironmentId cannot be blank")
        String environmentId
    );

    @GET
    @Path("/application/connectors")
    @Produces(MediaType.APPLICATION_JSON)
    @Operation(description = "Get all connectors provided by own organization. (For Service Partners)")
    ProvidedConnectorOverviewResult getProvidedConnectors(
        @QueryParam("environmentId")
        @Valid
        @NotBlank(message = "EnvironmentId cannot be blank")
        String environmentId
    );

    @GET
    @Path("/application/connectors/{connectorId}")
    @Produces(MediaType.APPLICATION_JSON)
    @Operation(description = "Get details of a connector provided by own organization. (For Service Partners)")
    ConnectorDetailDto getProvidedConnectorDetails(
        @PathParam("connectorId")
        String connectorId
    );

    @DELETE
    @Path("/application/connectors/{connectorId}")
    @Produces(MediaType.APPLICATION_JSON)
    @Operation(description = "Unregister a connector provided by own organization. (For Service Partners)")
    IdResponse deleteProvidedConnector(
        @PathParam("connectorId")
        String connectorId
    );

    @POST
    @Path("/authority/organizations/invite")
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
    @Operation(description = "Invite a new organization via a new Participant Admin.")
    IdResponse inviteOrganization(
        @Valid
        @NotNull(message = "Invitation information cannot be null")
        InviteOrganizationRequest invitationInformation
    );

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
    ConnectorOverviewResult ownOrganizationConnectors(
        @QueryParam("environmentId")
        @Valid
        @NotBlank(message = "EnvironmentId cannot be blank")
        String environmentId
    );

    @GET
    @Path("/organizations/my-org/connectors/{connectorId}")
    @Produces(MediaType.APPLICATION_JSON)
    @Operation(description = "Get details of a user's own organization's connector.")
    ConnectorDetailDto ownOrganizationConnectorDetails(@PathParam("connectorId") String connectorId);

    @GET
    @Path("/organizations/my-org/redirects/data-offers")
    @Produces(MediaType.APPLICATION_JSON)
    @Operation(description = "Redirect to the environment specific broker, with filters for connector endpoints of the own organization preselected.")
    Response redirectToOwnOrganizationCatalog(
        @QueryParam("environmentId")
        @Valid
        @NotBlank(message = "EnvironmentId cannot be blank")
        String environmentId
    );

    @GET
    @Path("/organizations/my-org/redirects/broker")
    @Produces(MediaType.APPLICATION_JSON)
    @Operation(description = "Redirect to the specific broker catalog based on the environment.")
    Response redirectToCatalog(
        @QueryParam("environmentId")
        @Valid
        @NotBlank(message = "EnvironmentId cannot be blank")
        String environmentId
    );

    @POST
    @Path("/organizations/my-org/connectors/create-on-premise")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    @Operation(description = "Register a self-hosted connector.")
    CreateConnectorResponse createOwnConnector(
        @QueryParam("environmentId")
        @Valid
        @NotBlank(message = "EnvironmentId cannot be blank")
        String environmentId,

        @Valid
        @NotNull(message = "Connector cannot be null")
        CreateConnectorRequest connector
    );

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
    CreateConnectorResponse createProvidedConnector(
        @PathParam("mdsId")
        String mdsId,

        @QueryParam("environmentId")
        @Valid
        @NotBlank(message = "EnvironmentId cannot be blank")
        String environmentId,

        @Valid
        @NotNull(message = "Connector cannot be null")
        CreateConnectorRequest connector
    );

    @POST
    @Path("/organizations/my-org/connectors/request-caas")
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
    @Operation(description = "Request a CaaS registration.")
    CreateConnectorResponse createCaas(
        @QueryParam("environmentId")
        @Valid
        @NotBlank(message = "EnvironmentId cannot be blank")
        String environmentId,

        @Valid
        @NotNull(message = "CaaS request cannot be null")
        CreateCaasRequest caasRequest
    );

    @GET
    @Path("/organizations/my-org/connectors/check-free-caas-usage")
    @Produces(MediaType.APPLICATION_JSON)
    @Operation(description = "Check if a CaaS registration is available for your organization.")
    CaasAvailabilityResponse checkFreeCaasUsage(
        @QueryParam("environmentId")
        @Valid
        @NotBlank(message = "EnvironmentId cannot be blank")
        String environmentId
    );

    @GET
    @Path("/deployment-environments")
    @Produces(MediaType.APPLICATION_JSON)
    @Operation(description = "Get a list of all deployment environment.")
    List<DeploymentEnvironmentDto> deploymentEnvironmentList();

    @POST
    @Path("/registration")
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
    @Operation(description = "Register user and organization.")
    IdResponse registerUser(
        @Valid
        @NotNull(message = "Registration request cannot be null")
        RegistrationRequestDto registrationRequest
    );

    @POST
    @Path("/registration/me/update")
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
    @Operation(description = "Update user information during onboarding.")
    IdResponse updateOnboardingUser(
        @Valid
        @NotNull(message = "Update user request cannot be null")
        OnboardingUserUpdateDto onboardingUserUpdateDto
    );

    @POST
    @Path("/registration/my-org/update")
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
    @Operation(description = "Update organization information during onboarding.")
    IdResponse updateOnboardingOrganization(
        @Valid
        @NotNull(message = "Update organization request cannot be null")
        OnboardingOrganizationUpdateDto onboardingOrganizationUpdateDto
    );

    @PUT
    @Path("/users/{userId}")
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
    @Operation(description = "Update user information")
    IdResponse updateUser(
        @PathParam("userId")
        String userId,

        @Valid
        @NotNull(message = "Update user request cannot be null")
        UpdateUserDto updateUserDto
    );

    @PUT
    @Path("/organizations/my-org")
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
    @Operation(description = "Update own organization information")
    IdResponse updateOwnOrganizationDetails(
        @Valid
        @NotNull(message = "Update organization request cannot be null")
        UpdateOrganizationDto organizationDto
    );

    @PUT
    @Path("/authority/organizations/{mdsId}")
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
    @Operation(description = "Update organization information")
    IdResponse updateOrganizationDetails(
        @PathParam("mdsId")
        String mdsId,

        @Valid
        @NotNull(message = "Update organization request cannot be null")
        UpdateOrganizationDto organizationDto
    );

    @GET
    @Path("/authority/central-components")
    @Produces(MediaType.APPLICATION_JSON)
    @Operation(description = "List central components (e.g. a broker or logging house)")
    List<CentralComponentDto> getCentralComponents(
        @QueryParam("environmentId")
        @Valid
        @NotBlank(message = "EnvironmentId cannot be blank")
        String environmentId
    );

    @POST
    @Path("/authority/central-components")
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
    @Operation(description = "Register a central component (e.g. a broker or logging house)")
    IdResponse createCentralComponent(
        @QueryParam("environmentId")
        @Valid
        @NotBlank(message = "EnvironmentId cannot be blank")
        String environmentId,

        @Valid
        @NotNull(message = "Component cannot be null")
        CentralComponentCreateRequest componentRegistrationRequest
    );

    @DELETE
    @Path("/authority/central-components/{centralComponentId}")
    @Produces(MediaType.APPLICATION_JSON)
    @Operation(description = "Delete a central component (e.g. a broker or logging house)")
    IdResponse deleteCentralComponent(
        @PathParam("centralComponentId")
        String centralComponentId
    );

    @GET
    @Path("/component-statuses")
    @Produces(MediaType.APPLICATION_JSON)
    @Operation(description = "Get component status information for a specific environment.")
    ComponentStatusOverview getComponentsStatus(
        @QueryParam("environmentId")
        @Valid
        @NotBlank(message = "EnvironmentId cannot be blank")
        String environmentId
    );
}
