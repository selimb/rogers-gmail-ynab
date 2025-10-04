import { zConfig } from "./config";
import { parseRogersEmail } from "./parser";
import { YnabClient } from "./ynab";

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
  const ynabClient = new YnabClient(ynabConfig);

  const messages = GmailApp.search(
    `label:${GMAIL_LABEL_NAME} in:inbox -is:starred`,
    0,
    PAGE_SIZE,
  ).flatMap((thread) => thread.getMessages());

  Logger.log(`Found ${messages.length} messages.`);
  if (messages.length === 0) {
    return;
  }

  for (const message of messages) {
    const body = message.getPlainBody();
    const parsed = parseRogersEmail(body);
    if (parsed instanceof Error) {
      Logger.log(
        `Failed to parse message. ${parsed.message}\nmessage:\n${body}`,
      );
      message.star();
      continue;
    }

    Logger.log(`Parsed message: %s`, parsed);
    if (message.isInTrash()) {
      Logger.log(`Message is already in trash, skipping.`);
      continue;
    }

    try {
      const _response = ynabClient.createTransaction({
        date: parsed.date,
        // *1000 for milliunits, *-1 because it's an outflow, Math.round to avoid floating point issues
        amount: Math.round(parsed.amount * 1000 * -1),
        payee_name: parsed.merchant,
      });
    } catch (error) {
      Logger.log(`Failed to upload transaction for %s.\n%s`, parsed, error);
      message.star();
      continue;
    }

    message.moveToTrash();
  }
}
