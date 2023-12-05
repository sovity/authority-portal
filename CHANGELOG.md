# Changelog

For documentation on how to update this changelog,
please see [changelog_updates.md](docs/dev/changelog_updates.md).

## Unreleased - YYYY-MM-DD

### Overview

### Detailed Changes

#### Major

- Redesigned Connectors list, detail and related sub-pages
- Redesigned Portal Sidebar, Header and other general layouts
- Moved registration process from Keycloak into the portal

#### Minor

- Redesigned Portal Sidebar, Header and other general layouts
- Added an IFrame for MDS on the start page
- Added possibility to download own organization connectors as csv
- Added possibility to download connectors as csv
- Changed font from Inter to Arial
- Added possibility to update user details
- Added possibility to update organization details
- Added possibility to download user details as csv
- Adapted to new Broker API

#### Patch

- Fix logo text and alignment
- Moved breadcrumbs to the toolbar
- Fix role assignment functionality
- Check for existing users (collisions of mail addresses) during invitation
- Start page Iframe wont show if url is not set in the app-config.json
- Reworked Sirius Deployment Guide

### Deployment Migration Notes

#### Compatible Versions

## [v0.1.1] - 2023-11-09

### Overview

Patch release, adding missing buttons.

### Detailed Changes

#### Patch

- Added button for user de-/reactivation on the user details page
- Added button for user invitation on the organization details page

### Deployment Migration Notes

- Upgrade Authority Portal to this version
  - Shut down current version
  - Restart with new images

#### Compatible Versions

- Authority Portal Backend Docker Image: `ghcr.io/sovity/authority-portal-backend:0.1.1`
- Authority Portal Frontend Docker Image: `ghcr.io/sovity/authority-portal-frontend:0.1.1`
- Broker Server: `1.2.0`

## [v0.1.0] - 2023-10-31

### Overview

Second Authority Portal MVP Release, providing extended features, mainly to enable participant management.

### Detailed Changes

#### Major

- Added invitation of new participating organizations
- Added invitation of new users to an organization (Frontend missing)
- Added user deactivation (Frontend missing)
- Added support for multiple deployment environments

#### Minor

- Added possibility to change user roles
- Added unregistering of own (company intern) connectors
- Updated organization detail page to show statistics for Authority Admins
- Updated organization detail page to show more information (including user list)
- Added user detail pages
- Added possibility to generate a connector certificate in browser
- Added button with link to the invite new users page

### Deployment Migration Notes

- Upgrade Broker to version 1.2.0
- Upgrade Authority Portal to this version
  - Shut down current version
  - Restart with new images

#### Compatible Versions

- Authority Portal Backend Docker Image: `ghcr.io/sovity/authority-portal-backend:0.1.0`
- Authority Portal Frontend Docker Image: `ghcr.io/sovity/authority-portal-frontend:0.1.0`
- Broker Server: `1.2.0`

## [v1.0.0] - 2023-09-29

### Overview

Initial Authority Portal MVP Release with a minimalistic feature set.

### Detailed Changes

#### Major

- Implemented an Authority Portal MVP
  - User registration process via Keycloak
  - Organization registration process
  - Organization review process
  - Connector registration for own and other organization(s)
  - Roles and respective permissions
    - Authority Admin
    - Authority User
    - Participant Admin
    - Participant Curator
    - Participant User
    - Service Partner Admin
    - Operator Admin (not yet used)

### Deployment Migration Notes

Please view the [Deployment Section in the README.md](README.md#deployment) for initial deployment instructions.

#### Compatible Versions

- Authority Portal Backend Docker Image: `ghcr.io/sovity/authority-portal-backend:1.0.0`
- Authority Portal Frontend Docker Image: `ghcr.io/sovity/authority-portal-frontend:1.0.0`
