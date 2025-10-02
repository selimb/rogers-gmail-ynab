import ynab from "ynab";

import { zYnabConfig } from "../src/config";

type DataItem = {
  date: string;
  merchant: string;
  amount: string;
};

/** Can be run in the browser console to extract data. */
function _parseRows(table: HTMLElement): void {
  const rows = [...table.querySelectorAll("tr")].slice(1);
  const _data = rows.map((row): DataItem => {
    const children = [...row.children];
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- Hush.
    const date = children[0].textContent ?? "";
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- Hush.
    const merchant = children[1].children[0].children[1].textContent ?? "";
    const amount =
      children[4].children[0].children[1]
        .querySelector("span")
        ?.getAttribute("aria-label") ?? "";
    return { date, merchant, amount };
  });
}

const DATA: DataItem[] = [];

const envSchema = zYnabConfig;
const env = envSchema.parse(process.env);

async function main(): Promise<void> {
  const client = new ynab.API(env.YNAB_TOKEN);

  for (const item of DATA) {
    const date = new Date(item.date);
    const dateString = date.toISOString().split("T")[0];
    const data: ynab.PostTransactionsWrapper = {
      transaction: {
        account_id: env.YNAB_ACCOUNT,
        date: dateString,
        // In milliunits
        amount: Math.round(Number.parseFloat(item.amount) * 1000),
        payee_name: item.merchant.toUpperCase(),
      },
    };
    // eslint-disable-next-line no-console -- Not debugging.
    console.info(data);
    await client.transactions.createTransaction(env.YNAB_BUDGET, data);
  }
}

void main();
