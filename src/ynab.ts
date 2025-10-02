import type * as ynab from "ynab";

import type { YnabConfig } from "./config";

const BASE_URL = `https://api.ynab.com/v1`;

function buildUrl(path: `/${string}`): string {
  return `${BASE_URL}${path}`;
}

type CreateTransactionInput = Required<
  Pick<ynab.NewTransaction, "amount" | "date" | "payee_name">
>;

/**
 * Custom YNAb client.
 * The GAS runtime doesn't support things like `URLSearchParams`.
 */
export class YnabClient {
  private readonly config: YnabConfig;

  constructor(config: YnabConfig) {
    this.config = config;
  }

  public createTransaction(
    data: CreateTransactionInput,
  ): GoogleAppsScript.URL_Fetch.HTTPResponse {
    const config = this.config;
    const headers = this.buildHeaders();
    const url = buildUrl(`/budgets/${config.YNAB_BUDGET}/transactions`);
    const body: ynab.PostTransactionsWrapper = {
      transaction: {
        account_id: config.YNAB_ACCOUNT,
        ...data,
      },
    };

    const response = UrlFetchApp.fetch(url, {
      method: "post",
      contentType: "application/json",
      headers,
      payload: JSON.stringify(body),
    });
    return response;
  }

  private buildHeaders(): GoogleAppsScript.URL_Fetch.HttpHeaders {
    return {
      Authorization: `Bearer ${this.config.YNAB_TOKEN}`,
    };
  }
}
