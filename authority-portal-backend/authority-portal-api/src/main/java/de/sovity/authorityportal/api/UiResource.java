package de.sovity.authorityportal.api;

import de.sovity.authorityportal.api.model.CreateOrganizationRequest;
import de.sovity.authorityportal.api.model.ExamplePageQuery;
import de.sovity.authorityportal.api.model.ExamplePageResult;
import de.sovity.authorityportal.api.model.OrganizationDetailResult;
import de.sovity.authorityportal.api.model.OrganizationOverviewResult;
import de.sovity.authorityportal.api.model.UserApprovalPageResult;
import de.sovity.authorityportal.api.model.UserInfo;
import de.sovity.authorityportal.api.model.UserRegistrationStatusResult;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.PUT;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;

import java.util.List;

@Path("/api/v1/ui")
@Tag(name = "Ui", description = "Authority Portal UI API Endpoints.")
public interface UiResource {

    // Example
    @POST
    @Path("/example-page")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    @Operation(description = "Don't forget to edit this documentation!")
    ExamplePageResult examplePage(ExamplePageQuery query);

    @GET
    @Path("/example-page/example-db-query")
    @Produces(MediaType.APPLICATION_JSON)
    List<String> exampleDbQuery();

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

    // LEGACY: user approval
    @GET
    @Path("/user-approval")
    @Produces(MediaType.APPLICATION_JSON)
    @Operation(description = "All data for UI user approval page.")
    UserApprovalPageResult userApprovalPage();
}
