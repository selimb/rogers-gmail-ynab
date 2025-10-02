import * as z from "zod/mini";

const nonemptyString = z.string().check(z.minLength(1));

export const zYnabConfig = z.object({
  YNAB_TOKEN: nonemptyString,
  YNAB_BUDGET: nonemptyString,
  YNAB_ACCOUNT: nonemptyString,
});
export type YnabConfig = z.infer<typeof zYnabConfig>;

export const zConfig = zYnabConfig;
export type Config = z.infer<typeof zConfig>;
