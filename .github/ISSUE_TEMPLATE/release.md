---
name: Release
about: Create an issue to track a release process.
title: "Release x.x.x"
labels: [ "task/release", "scope/mds" ]
assignees: ""
---

# Release

## Work Breakdown

Feel free to edit this release checklist in-progress depending on what tasks need to be done:

- [ ] Release [sovity EDC CE](https://github.com/sovity/edc-ce), this might require several steps, first of which is
  to [create a new `Release` issue](https://github.com/sovity/edc-ce/issues/new/choose)
- [ ] Decide a release version depending on major/minor/patch changes in the CHANGELOG.md.
- [ ] Update this issue's title to the new version
- [ ] `release-prep` PR:
    - [ ] Update the CHANGELOG.md.
        - [ ] Add a clean `Unreleased` version.
        - [ ] Add the version to the old section.
        - [ ] Add the current date to the old version.
        - [ ] Bump the EDC CE Version
            - [ ] Bump the EDC CE Version in the `gradle.libs.toml`
        - [ ] Add all Catalog Crawler or Catalog relevant changelog entries from the newer EDC CE release(s), merge and
          reword them.
        - [ ] Add all Catalog Crawler or Catalog deployment migration notes from the newer EDC CE release(s), merge and
          reword them.
        - [ ] Write or review the `Deployment Migration Notes` section.
        - [ ] Ensure the `Deployment Migration Notes` contains the compatible docker images.
        - [ ] Write or review a release summary.
        - [ ] Remove empty sections from the patch notes.
    - [ ] Wait for the pipeline to be green.
    - [ ] Merge the `release-prep` PR.
- [ ] Wait for the main branch to be green.
- [ ] Create a release and re-use the changelog section as release description, and the version as title.
- [ ] Create a release in the [Authority Portal EE](https://github.com/sovity/authority-portal-ee) repository.
    - [ ] `release-prep` PR:
        - [ ] Ensure that the correct Catalog Crawler image is set in EE's `.env`.
        - [ ] Copy the [Keycloak theme](https://github.com/sovity/authority-portal/tree/main/authority-portal-keycloak)
          from here to the EE repository.
        - [ ] Copy
          the [OAuth2 proxy templates](https://github.com/sovity/authority-portal/tree/main/authority-portal-oauth2-proxy)
          from here to the EE repository.
        - [ ] Copy
          the [realm.json](https://github.com/sovity/authority-portal/blob/main/authority-portal-backend/authority-portal-quarkus/src/main/resources/realm.json)
          from here to the EE repository.
        - [ ] Update the Catalog Crawler image in EE's `.env`.
        - [ ] Link this release in the EE changelog.
        - [ ] Merge the `release-prep` PR.
        - [ ] Deploy a version with the PR-Tag to Sirius and test the deployment.
    - [ ] Create a release, re-use the changelog section as EE release description.
    - [ ] Re-use the version of this release as the title for the EE release.
- [ ] Notify the deployment team, which will send a message to the customer about the new release.
- [ ] `release-cleanup` PR:
    - [ ] Revisit the changed list of tasks and compare it
      with [.github/ISSUE_TEMPLATE/release.md](https://github.com/sovity/authority-portal/blob/main/.github/ISSUE_TEMPLATE/release.md).
      Apply changes where it makes sense.
    - [ ] Merge the `release-cleanup` PR.