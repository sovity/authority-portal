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
Manage your Dataspace
<br />
<a href="https://github.com/sovity/authority-portal/issues/new?assignees=&labels=kind%2Fbug&projects=&template=bug_report.yaml">Report Bug</a>
·
<a href="https://github.com/sovity/authority-portal/issues/new?template=feature_request.md">Request Feature</a>
</p>
</div>

## About The Project

Allows a Dataspace to manage its participants. Supports participant organization structure, multiple ways to get or add
connectors and service partners that can provide their own CaaS for other participants.

Since the Authority Portal is part of a dataspace administration, technical connections to other dataspace systems are necessary. If you would like to deploy the Authority Portal yourself and use it productively, please contact sovity so that we can help you.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Development

To develop new features, once the API definitions are implemented
in the backend, the development of both the frontend and backend can start in parallel.

The frontend has a type-safe fake backend which also uses the API models via an autogenerated TypeScript API Client
Library.

Once a feature is implemented in both the frontend and backend, it can be manually tested
using [Local E2E Development](#local-e2e-development).

### Local Development

The backend and the frontend can be developed separately:

- [Local Backend Development](authority-portal-backend/README.md#development)
- [Local Frontend Development](authority-portal-frontend/README.md#development)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Local E2E Development

Local E2E Development is what you use to integration test the backend and frontend locally. Requires JDK17, a Docker
Environment and Node 16 / NPM 7.

```shell
# Bash, WSL or Git Bash

# Build + Run Backend
(cd authority-portal-backend && ./gradlew clean quarkusDev)

# Build + Run Frontend (basic version with fake Backend*)
(cd authority-portal-frontend && npm i && npm run cold-start-e2e-dev)
```

For more details on how to launch the frontend,
see [Frontend Local E2E Development](authority-portal-frontend/README.md#local-e2e-development).

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Deployment

### Productive Deployment Guide

There is a guide on [How to deploy the Authority Portal for Production](docs/deployment-guide/goals/production/README.md) in this
repository.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## License

See [`LICENSE`](./LICENSE) for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Contact

contact@sovity.de

<p align="right">(<a href="#readme-top">back to top</a>)</p>
