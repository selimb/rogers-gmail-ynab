export type ParsedRogersEmail = {
  merchant: string;
  /** Amount, in milliunits. */
  amount: number;
  /** In YYYY-MM-DD format. */
  date: string;
};

// Regex up to "at ... ."
const REGEX =
  /Attempt of \$(\S+) was made on ([A-Za-z]{3,} \d{2}, \d{4}) on your credit card ending in \d+ at (.+)\./;

export function parseRogersEmail(body: string): ParsedRogersEmail | Error {
  body = body.replaceAll("\n", " ").replaceAll(/\s+/g, " ").trim();

  const match = REGEX.exec(body);

  if (!match) {
    return new Error("Message does not match regex.");
  }

  const [, amountRaw, dateRaw, merchantAndLocation] = match;

  const amount = Number.parseFloat(
    amountRaw.replaceAll(",", "").replaceAll(".", ""),
  );
  if (Number.isNaN(amount)) {
    return new Error(`Invalid amount: '${amountRaw}'.`);
  }

  const date = new Date(dateRaw);
  if (Number.isNaN(date.getTime())) {
    return new Error(`Invalid date: '${dateRaw}'.`);
  }
  const dateString = date.toISOString().split("T")[0];

  // The general format is '$MERCHANT in $LOCATION', but either $MERCHANT or $LOCATION may contain ' in '.
  // There's no way to disambiguate, but it's probably more likely that $MERCHANT contains ' in ' than $LOCATION.
  const sep = " in ";
  const parts = merchantAndLocation.split(sep);
  if (parts.length < 2) {
    return new Error(
      `Missing ' in ' in merchant/location: '${merchantAndLocation}'.`,
    );
  }
  let merchant: string;
  // eslint-disable-next-line unicorn/prefer-ternary -- No.
  if (parts.length === 2) {
    merchant = parts[0];
  } else {
    merchant = parts.slice(0, -1).join(sep);
  }

  return {
    amount,
    date: dateString,
    merchant,
  };
}
