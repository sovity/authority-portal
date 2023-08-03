<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/sovity/authority-portal">
    <img src="https://raw.githubusercontent.com/sovity/edc-ui/main/src/assets/images/sovity_logo.svg" alt="Logo" width="300">
  </a>

<h3 align="center">Authority Portal API Java Client Library</h3>

  <p align="center">
    <a href="https://github.com/sovity/authority-portal/issues/new?template=bug_report.md">Report Bug</a>
    ·
    <a href="https://github.com/sovity/authority-portal/issues/new?template=feature_request.md">Request Feature</a>
  </p>
</div>

## About this component

Java API Client Library to be imported and used in use-case applications. Is also used to run Quarkus Tests in a type
safe manner.

## Installation

```xml
<!-- Requires the GitHub Maven Registry -->
<dependency>
    <groupId>de.sovity.authorityportal</groupId>
    <artifactId>authority-portal-api-client</artifactId>
    <version>${sovity-authority-portal.version}</version>
</dependency>
```

## Usage Example

```java
import de.sovity.authorityportal.client.AuthorityPortalClient;
import de.sovity.authorityportal.client.gen.model.ExamplePageQuery;
import de.sovity.authorityportal.client.gen.model.ExamplePageResult;

/**
 * Example using the Authority Portal API Java Client Library
 */
public class AuthorityPortalClientExample {

    public static final String AUTHORITY_PORTAL_URL = "https://my-portal.sovity.io";

    public static void main(String[] args) {
        // Configure Client
        AuthorityPortalClient client = AuthorityPortalClient.builder()
                .backendUrl(AUTHORITY_PORTAL_URL)
                .build();

        // API Endpoints are now available for use
        ExamplePageQuery examplePageQuery = new ExamplePageQuery();
        ExamplePageResult examplePageResult = client.uiApi().examplePage(examplePageQuery);
        System.out.println(examplePageResult.getGreetingResult());
    }
}
```

## License

See [LICENSE](../LICENSE)

## Contact

sovity GmbH - contact@sovity.de
