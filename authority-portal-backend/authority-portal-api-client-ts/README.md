<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/sovity/authority-portal">
    <img src="https://raw.githubusercontent.com/sovity/edc-ui/main/src/assets/images/sovity_logo.svg" alt="Logo" width="300">
  </a>

<h3 align="center">Authority Portal API TypeScript Client Library</h3>

  <p align="center">
    <a href="https://github.com/sovity/authority-portal/issues/new?template=bug_report.md">Report Bug</a>
    ·
    <a href="https://github.com/sovity/authority-portal/issues/new?template=feature_request.md">Request Feature</a>
  </p>
</div>

## About this component

TypeScript Client Library to access APIs of our Authority Portal Backend.

## How to install

Requires a NodeJS / NPM project.

```shell script
npm i --save @sovity.de/authority-portal-client
```

## How to use

Configure your Authority Portal Client and use endpoints of our Authority Portal
API:

```typescript
import {
    AuthorityPortalClient,
    ExamplePageQuery,
    ExamplePageResult,
    buildAuthorityPortalClient,
} from '@sovity.de/authority-portal-client';
import {ExampleQuery} from './ExampleQuery';

const authorityPortalClient: AuthorityPortalClient = buildAuthorityPortalClient(
    {
        backendUrl: 'https://my-portal.sovity.io',
    },
);

let query: ExamplePageQuery = {
    greeting: 'Hello World',
};

let result: ExamplePageResult = await authorityPortalClient.uiApi.examplePage();
```

## License

See [LICENSE](https://github.com/sovity/authority-portal/blob/main/LICENSE)

## Contact

sovity GmbH - contact@sovity.de
