import { describe, expect, it } from "bun:test";

import { type ParsedRogersEmail, parseRogersEmail } from "./parser";

// eslint-disable-next-line unicorn/template-indent -- Must be kept as-is.
const MESSAGE_FULL = `


$69.59 on Nov 16, 2025 on your credit card ending in 9999. Details: SAVE ON
FOODS #2245.

*Learn how to manage account alerts.
<https://rogersbank.com/en/help_centre_answers/managing_your_account#q174>*

Thank you for choosing Rogers Bank.

This is an automated message. Please do not reply to this email.
Contact Us <https://www.rogersbank.com/en/contact_us> | Terms & Conditions
<https://www.rogersbank.com/en/legal> | Privacy Policy
<https://www.rogersbank.com/en/privacy> | rogersbank.com
<https://www.rogersbank.com>
Rogers Bank | 1 Mount Pleasant Road | Toronto ON | M4Y 2Y5
This email was sent to you because you’re a Rogers Bank customer. We value
your privacy and security, and will never contact you for personal
information, including any passwords or Multi-Factor Authentication (MFA)
codes.
`;

describe(parseRogersEmail, () => {
  it("handles malformed messages gracefully", () => {
    const message = "This is not a valid message.";
    expect(parseRogersEmail(message)).toMatchInlineSnapshot(
      `[Error: Message does not match regex.]`,
    );
  });

  it("handles commas in the amount", () => {
    const message =
      "$1,234.56 on Nov 30, 2025 on your credit card ending in 9999. Details: Fancy Place.";
    const expected: ParsedRogersEmail = {
      amount: 1234.56,
      date: "2025-11-30",
      merchant: "Fancy Place",
    };
    expect(parseRogersEmail(message)).toEqual(expected);
  });

  it("handles full message", () => {
    const expected: ParsedRogersEmail = {
      amount: 69.59,
      date: "2025-11-16",
      merchant: "SAVE ON FOODS #2245",
    };
    expect(parseRogersEmail(MESSAGE_FULL)).toEqual(expected);
  });
});
