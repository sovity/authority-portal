<!-- Improved compatibility of back to top link: See: https://github.com/othneildrew/Best-README-Template/pull/73 -->

<a name="readme-top"></a>

<!-- PROJECT LOGO -->
<br />
<div align="center">
<a href="https://github.com/sovity/authority-portal">
<img src="https://raw.githubusercontent.com/sovity/edc-ui/main/src/assets/images/sovity_logo.svg" alt="Logo" width="300">
</a>

<h3 align="center">Authority Portal</h3>
<p align="center" style="padding-bottom:16px">
Java / Kotlin Backend
<br />
<a href="https://github.com/sovity/authority-portal/issues/new?template=bug_report.md">Report Bug</a>
·
<a href="https://github.com/sovity/authority-portal/issues/new?template=feature_request.md">Request Feature</a>
</p>
</div>

## About The Project

TODO

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Development

To start the backend in development mode, a JDK17 and docker are required.

> **_NOTE:_**  Quarkus now ships with a Dev UI, which is available in dev mode only at http://localhost:8080/q/dev/

```shell
./gradlew clean quarkusDev
```

### Local Development Hints

- To simplify local development there are dev users available, whose properties can be found in the [application.properties](./src/main/resources/application.properties)
  - These may not work with all endpoints, since roles are assigned statically instead of via Keycloak
- In order to develop and test endpoints with a "real" user follow these steps
  - Start the BE
  - Go to [localhost:8081](http://localhost:8081) and switch to admin console
  - Enter credentials (admin/admin)
  - Switch to `authority-portal` realm
  - Go to `Clients` > `authority-portal-client` > Tick `Direct access grants`
  - Use postman (or anything similar to build your requests)
    - Authorization: OAuth 2.0
    - Under `Configure New Token` enter the following
      - Grant Type: `Client Credentials`
      - Client ID: `authority-portal-client`
      - Client Secret: `NKV91vM0KfWeXzaNGaH6fF2z4o01tugl`
      - Client Authentication: `Send as Basic Auth header`
    - At the bottom, click `Get New Access Token`
    - When done, click `Proceed` and `Use Token`
    - Perform your request(s)

### Writing Tests

This Codebase contains different kinds of tests.

The naming of the types of tests is not standardized. The
distinction between E2E, Integration and Unit Tests is made here purely for the sake of explanation.
One might argue all the these types of tests to be unit tests:

- __(Backend) E2E Tests__:
    - These tests use the [Java Client Library](../authority-portal-client-java) to call the APIs of a running backend
      started by `@QuarkusTest`.
    - These tests need to manually clean the database after themselves, since the transaction breaks from "making a call
      to the backend via REST", so `@TestTransaction` is unavailable.
    - You can still use Quarkus' `@InjectMock` to mock parts of the running application, e.g. a KeycloakService.
- __Integration Tests__:
    - These tests test ApiServices of a running backend started by `@QuarkusTest`
    - They are faster than E2E Tests due to being able to use `@TestTransaction` which allows them to not dirty the DB.
    - They might not test for HTTP-Related things such as additional headers as the above E2E Tests do.
    - You can still use Quarkus' `@InjectMock` to mock parts of the running application, e.g. a KeycloakService.
- __Unit Tests__:
    - These tests should not be annotated with `@QuarkusTest` and should not require a DB.
    - If the unit under test is a CDI unit (e.g. a Service), Mockito will be used to create mocks for all the unit's dependencies.
    - __Unit tests are lightning fast__, because they don't need to start a quarkus application, postgresql testcontainers,
      etc.
    - Life is easy when all code with branch-wise complexity is tested locally by unit tests, so it can then be used in
      integration tests without having to test all branches again.
    - A large part of being a senior software developer is about learning how to structure code so that the complexity
      can be tested locally, allowing both code and tests to stay simple and manageable.
    - Unit test don't work well when the unit under test contains db concerns.
      For testing code that uses JooQ Integration Tests are recommended.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## License

See [`LICENSE`](./LICENSE) for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Contact

contact@sovity.de

<p align="right">(<a href="#readme-top">back to top</a>)</p>
