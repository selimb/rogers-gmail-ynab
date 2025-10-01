import * as ynab from "ynab";

import { zConfig } from "./config";

const GMAIL_LABEL_NAME = "automation/rogers-gmail-ynab";
const PAGE_SIZE = 50;

export function rogers_to_ynab(): void {
  const ynabConfigResult = zConfig.safeParse(
    PropertiesService.getScriptProperties().getProperties(),
  );
  if (!ynabConfigResult.success) {
    throw new Error(`Invalid YNAB config: ${ynabConfigResult.error.message}`);
  }
  const ynabConfig = ynabConfigResult.data;
  const ynabClient = new ynab.API(ynabConfig.YNAB_TOKEN);

  const messages = GmailApp.search(
    `label:${GMAIL_LABEL_NAME} in:inbox`,
    0,
    PAGE_SIZE,
  ).flatMap((thread) => thread.getMessages());

  Logger.log(`Found ${messages.length} messages.`);
  if (messages.length === 0) {
    return;
  }

  for (const message of messages) {
    const body = message.getPlainBody();
    // XXX
    Logger.log(body);
  }

  // XXX
  return;
}

Object.assign(globalThis, { rogers_to_ynab });
