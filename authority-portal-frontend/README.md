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
Angular Frontend
<br />
<a href="https://github.com/sovity/authority-portal/issues/new?template=bug_report.md">Report Bug</a>
·
<a href="https://github.com/sovity/authority-portal/issues/new?template=feature_request.md">Request Feature</a>
</p>
</div>

## About This Component

Frontend for sovity's Dataspace Authority Portal, written in Angular.

<p align="right">(<a href="#readme-top">back to top</a>)

## Configuration

Both the docker image and the locally run build can be configured via ENV
Variables:

```yaml
# Required: Backend URL
AUTHORITY_PORTAL_FRONTEND_BACKEND_URL=https://my-portal.sovity.io
```

All available configuration options can be found in
[app-config.ts](src/app/core/config/app-config.ts)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Development

For local development Node16 and NPM are required.

For local development both the committed [.env.local-dev](.env.local-dev) and
not committed `.env` files are additional sources for the config.

```shell
# (1) Build and link the TypeScript API Client Library
# see parent README.md on how to do that

# (2) Start Application in Dev Mode
npm run start

# (3) Start Karma Test Server
npm run test
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## License

See [`LICENSE`](./LICENSE) for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Contact

contact@sovity.de

<p align="right">(<a href="#readme-top">back to top</a>)</p>
