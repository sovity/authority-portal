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
Backend + Frontend + E2E Tests
<br />
<a href="https://github.com/sovity/authority-portal/issues/new?template=bug_report.md">Report Bug</a>
·
<a href="https://github.com/sovity/authority-portal/issues/new?template=feature_request.md">Request Feature</a>
</p>
</div>

## About This Component

Backend code for ... TODO

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Development

To start the backend in development mode, a JDK17 and docker are required.

```shell
./gradlew clean quarkusDev
```

To use the TypeScript Client Library in development mode, the library needs to be re-built, then linked into the UI
project of choice:

```shell
# Generate TypeScript sources
./gradlew authority-portal-api:build

# Build TypeScript Library
(cd authority-portal-api-client-ts && npm i && npm run build)

# Link TypeScript Library
(cd ../path-to-your-ui && npm i && npm link ../path-to-this-folder/authority-portal-client-ts)
```

### Keycloak

Local development uses a Keycloak instance launched by Quarkus both for authentication and manual testing of our interactions with the Keycloak Admin API. To add new Roles to the Dev Keycloak or change the Keycloak Realm Config, please refer to our [Keycloak Realm Export Documentation](docs/dev/keycloak-realm-export).

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## License

See [`LICENSE`](./LICENSE) for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Contact

contact@sovity.de

<p align="right">(<a href="#readme-top">back to top</a>)</p>