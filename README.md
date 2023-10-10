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
<a href="https://github.com/sovity/authority-portal/issues/new?template=bug_report.md">Report Bug</a>
·
<a href="https://github.com/sovity/authority-portal/issues/new?template=feature_request.md">Request Feature</a>
</p>
</div>

## About The Project

TODO

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Local E2E Development

Local E2E Development requires:

- JDK17
- Docker Environment
- Node 16 / NPM 7

```shell
# Build + Run Backend
(cd authority-portal-backend && ./gradlew clean quarkusDev)

# Build TS API Client Library
(cd authority-portal-backend && ./gradlew :authority-portal-api:clean :authority-portal-api:build -x test && cd authority-portal-api-client-ts && npm i && npm run build)

# Build + Run Frontend (basic version with fake Backend*)
bash:
    (cd authority-portal-frontend && npm i && npm run cold-start)
powershell:
    cd authority-portal-frontend ; npm i ; npm run cold-start

* other ways to start frontend are available in
README in "authority-portal-frontend" folder
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## License

See [`LICENSE`](./LICENSE) for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Contact

contact@sovity.de

<p align="right">(<a href="#readme-top">back to top</a>)</p>
