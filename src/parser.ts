export type ParsedRogersEmail = {
  payee: string;
  amount: number;
  date: string;
};

export function parseRogersEmail(body: string): ParsedRogersEmail | undefined {
  // XXX
  return undefined;
}
