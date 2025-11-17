export type ParsedRogersEmail = {
  merchant: string;
  amount: number;
  /** In YYYY-MM-DD format. */
  date: string;
};

const REGEX =
  /\$(\S+) on ([A-Za-z]{3,} \d{2}, \d{4}) on your credit card ending in \d+. Details: (.+)\./;

export function parseRogersEmail(body: string): ParsedRogersEmail | Error {
  // Trim all lines.
  body = body
    .trim()
    .split("\n")
    .map((s) => s.trim())
    .join("\n");
  // Join consecutive lines.
  body = body.replaceAll(/\n([^\n])/g, (_match, s) => ` ${s}`);

  const match = REGEX.exec(body);

  if (!match) {
    return new Error("Message does not match regex.");
  }

  const [, amountRaw, dateRaw, merchant] = match;

  const amount = Number.parseFloat(amountRaw.replaceAll(",", ""));
  if (Number.isNaN(amount)) {
    return new Error(`Invalid amount: '${amountRaw}'.`);
  }

  const date = new Date(dateRaw);
  if (Number.isNaN(date.getTime())) {
    return new Error(`Invalid date: '${dateRaw}'.`);
  }
  const dateString = date.toISOString().split("T")[0];

  return {
    amount,
    date: dateString,
    merchant,
  };
}
