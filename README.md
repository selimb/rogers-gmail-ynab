# rogers-gmail-ynab

## Prerequisites

- [clasp](https://developers.google.com/apps-script/guides/clasp)
- bun

## Setup

Copy `.env.template` to `.env` and fill it.
See https://api.ynab.com/#personal-access-tokens for a guide on how to obtain a YNAB token.

Run the following to prompt for a YNAB budget and account:

```shell
./scripts/prompt-ynab-info.ts
```

## Deploy

```
version=1.0
# bump version in package.json
git commit -am "v$version"
git tag v$version
git push
git push --tags

just push
clasp version v$version
# copy version number
gas_version=XXX
clasp deploy --versionNumber "$gas_version" --description "v$version"
```
