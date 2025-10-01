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
