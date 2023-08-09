package de.sovity.authorityportal.api;

import de.sovity.authorityportal.api.model.ExamplePageQuery;
import de.sovity.authorityportal.api.model.ExamplePageResult;
import de.sovity.authorityportal.api.model.UserApprovalPageQuery;
import de.sovity.authorityportal.api.model.UserApprovalPageResult;
import de.sovity.authorityportal.api.model.UserRoleDto;
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

    @POST
    @Path("pages/example-page")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    @Operation(description = "Don't forget to edit this documentation!")
    ExamplePageResult examplePage(ExamplePageQuery query);

    @GET
    @Path("pages/example-page/example-db-query")
    @Produces(MediaType.APPLICATION_JSON)
    List<String> exampleDbQuery();

    @POST
    @Path("pages/user-approval-page")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    @Operation(description = "All data for UI user approval page.")
    UserApprovalPageResult userApprovalPage(UserApprovalPageQuery query);

    @PUT
    @Path("pages/user-approval-page/users/{userId}/role")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    @Operation(description = "Update a user's role.")
    String updateUserRole(UserRoleDto role, @PathParam("userId") String userId);
}
