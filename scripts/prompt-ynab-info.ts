#!/usr/bin/env -S bun run
import { z } from "zod";
import ynab from "ynab";
import * as inquirer from "@inquirer/prompts";

const envSchema = z.object({
  YNAB_TOKEN: z.string().min(1),
});

const env = envSchema.parse(process.env);

const client = new ynab.API(env.YNAB_TOKEN);

const budgets = await client.budgets.getBudgets(true);

const budgetChoices = budgets.data.budgets.map((budget) => ({
  value: budget,
  name: budget.name,
}));
const budgetSelected = await inquirer.select({
  message: "Select budget",
  choices: budgetChoices,
});

const accountChoices = budgetSelected.accounts?.map((account) => ({
  value: account,
  name: account.name,
}));
if (!accountChoices || accountChoices.length === 0) {
  throw new Error("No accounts found in the selected budget");
}
const accountSelected = await inquirer.select({
  message: "Select account",
  choices: accountChoices,
  pageSize: accountChoices.length,
});

// XXX type
const config = {
  YNAB_TOKEN: env.YNAB_TOKEN,
  YNAB_BUDGET: budgetSelected.id,
  YNAB_ACCOUNT: accountSelected.id,
};
console.log(
  "Copy-paste the following properties -- use `clasp open-api-console` to browse to settings page."
);
for (const [key, value] of Object.entries(config)) {
  console.log(key, value);
}
