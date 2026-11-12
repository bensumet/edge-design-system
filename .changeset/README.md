# Changesets

Every change that affects people using Edge comes with a changeset: run `npx changeset`, pick patch, minor or major, and write one line about the change for the changelog.

- **patch**: a fix that changes nothing anyone relies on.
- **minor**: something new (a component, a text role, a layout preset) that existing screens don't need to change for.
- **major**: anything a screen has to change for: a renamed prop, a removed role, a theme API change.

When changesets reach `main`, the release workflow opens a "Version packages" pull request that bumps the version and writes CHANGELOG.md. Merging it publishes the new version to GitHub Packages.
