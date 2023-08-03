package de.sovity.authorityportal.api;

import de.sovity.authorityportal.api.model.ExamplePageQuery;
import de.sovity.authorityportal.api.model.ExamplePageResult;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
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
}
