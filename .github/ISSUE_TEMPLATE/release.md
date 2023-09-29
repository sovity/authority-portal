---
name: Release
about: Create an issue to track a release process.
title: "Release x.x.x"
labels: ["task/release", "scope/mds"]
assignees: ""
---

# Release

## Work Breakdown

Feel free to edit this release checklist in-progress depending on what tasks need to be done:

- [ ] Decide a release version depending on major/minor/patch changes in the CHANGELOG.md.
- [ ] Update this issue's title to the new version
- [ ] `release-prep` PR:
    - [ ] Update the CHANGELOG.md.
        - [ ] Add a clean `Unreleased` version.
        - [ ] Add the version to the old section.
        - [ ] Add the current date to the old version.
        - [ ] Write or review the `Deployment Migration Notes` section.
        - [ ] Ensure the `Deployment Migration Notes` contains the compatible docker images.
        - [ ] Write or review a release summary.
        - [ ] Remove empty sections from the patch notes.
    - [ ] Merge the `release-prep` PR.
- [ ] Wait for the main branch to be green.
- [ ] Create a release and re-use the changelog section as release description, and the version as title.
- [ ] Check if the pipeline built the release versions in the Actions-Section (or you won't see it).
- [ ] Check the contents of the Deployment Docs Zip from the GitHub Release.
- [ ] Notify the deployment team with Deployment Docs Zip file attached to the release, which should now contain both product changes and a deployment migration guide.
- [ ] `release-cleanup` PR:
    - [ ] Revisit the changed list of tasks and compare it with [.github/ISSUE_TEMPLATE/release.md](https://github.com/sovity/authority-portal/blob/main/.github/ISSUE_TEMPLATE/release.md). Apply changes where it makes sense.
    - [ ] Merge the `release-cleanup` PR.