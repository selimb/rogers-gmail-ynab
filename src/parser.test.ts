import { describe, expect, it } from "bun:test";

import { type ParsedRogersEmail, parseRogersEmail } from "./parser";

// eslint-disable-next-line unicorn/template-indent -- Must be kept as-is.
const MESSAGE_FULL = `


Hello MR TEST,

Attempt of $33.08 was made on Oct 01, 2025 on your credit card ending in
9999 at La Baguette Catering in REVELSTOKE.

*Learn how to manage account alerts.
<https://rogersbank.com/en/help_centre_answers/managing_your_account#q174>*

Thank you for choosing Rogers Bank.

This is an automated message. Please do not reply to this email.
Contact Us <https://www.rogersbank.com/en/contact_us> | Terms & Conditions
<https://www.rogersbank.com/en/legal> | Privacy Policy
<https://www.rogersbank.com/en/privacy> | rogersbank.com
<https://www.rogersbank.com>
Rogers Bank | 1 Mount Pleasant Road | Toronto ON | M4Y 2Y5
This email was sent to you because you're a Rogers Bank customer. We value
your privacy and security, and will never contact you for personal
information, including any passwords or Multi-Factor Authentication (MFA)
codes.
`;

describe(parseRogersEmail, () => {
  it("parses a typical message", () => {
    const message =
      "Attempt of $33.08 was made on Oct 01, 2025 on your credit card ending in 9999 at La Baguette Catering in REVELSTOKE.";
    const expected: ParsedRogersEmail = {
      amount: 33.08,
      date: "2025-10-01",
      merchant: "La Baguette Catering",
    };
    expect(parseRogersEmail(message)).toEqual(expected);
  });

  it("handles merchant containing 'in'", () => {
    const message =
      "Attempt of $114.99 was made on Jan 15, 2024 on your credit card ending in 9999 at Dine in Cafe in NEW YORK.";
    const expected: ParsedRogersEmail = {
      amount: 114.99,
      date: "2024-01-15",
      merchant: "Dine in Cafe",
    };
    expect(parseRogersEmail(message)).toEqual(expected);
  });

  it("handles merchant containing 'at'", () => {
    const message =
      "Attempt of $42.00 was made on Mar 03, 2026 on your credit card ending in 9999 at Cafe at the Park in NEW YORK.";
    const expected: ParsedRogersEmail = {
      amount: 42,
      date: "2026-03-03",
      merchant: "Cafe at the Park",
    };
    expect(parseRogersEmail(message)).toEqual(expected);
  });

  it("handles merchant containing 'in' and 'at'", () => {
    const message =
      "Attempt of $55.55 was made on Aug 20, 2023 on your credit card ending in 4321 at Eat in at Noon in DOWNTOWN.";
    const expected: ParsedRogersEmail = {
      amount: 55.55,
      date: "2023-08-20",
      merchant: "Eat in at Noon",
    };
    expect(parseRogersEmail(message)).toEqual(expected);
  });

  it("handles merchant containing 'at' and 'in'", () => {
    const message =
      "Attempt of $55.55 was made on Aug 20, 2023 on your credit card ending in 4321 at Eat at Home in Kitchen in DOWNTOWN.";
    const expected: ParsedRogersEmail = {
      amount: 55.55,
      date: "2023-08-20",
      merchant: "Eat at Home in Kitchen",
    };
    expect(parseRogersEmail(message)).toEqual(expected);
  });

  it("handles(ish) location containing 'in'", () => {
    const message =
      "Attempt of $55.55 was made on Aug 20, 2023 on your credit card ending in 4321 at Eat at Home in Kitchen in Niagara in the lake.";
    const expected: ParsedRogersEmail = {
      amount: 55.55,
      date: "2023-08-20",
      merchant: "Eat at Home in Kitchen in Niagara",
    };
    expect(parseRogersEmail(message)).toEqual(expected);
  });

  it("handles malformed messages gracefully", () => {
    const message = "This is not a valid message.";
    expect(parseRogersEmail(message)).toMatchInlineSnapshot(
      `[Error: Message does not match regex.]`,
    );
  });

  it("handles commas in the amount", () => {
    const message =
      "Attempt of $1,234.56 was made on Nov 30, 2025 on your credit card ending in 5555 at Fancy Place in BIG CITY.";
    const expected: ParsedRogersEmail = {
      amount: 1234.56,
      date: "2025-11-30",
      merchant: "Fancy Place",
    };
    expect(parseRogersEmail(message)).toEqual(expected);
  });

  it("handles full message", () => {
    const expected: ParsedRogersEmail = {
      amount: 33.08,
      date: "2025-10-01",
      merchant: "La Baguette Catering",
    };
    expect(parseRogersEmail(MESSAGE_FULL)).toEqual(expected);
  });
});
