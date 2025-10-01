import fs from "node:fs/promises";

import { expect } from "bun:test";

const ENTRY_FUNCTIONS = ["rogers_to_ynab"];

const { outputs } = await Bun.build({
  entrypoints: ["src/main.ts"],
  outdir: "dist",
  target: "browser",
  format: "iife",
});

expect(outputs.length).toBe(1);
const outPath = outputs[0].path;

const lines = ENTRY_FUNCTIONS.flatMap((fn) => [
  `function ${fn} () {`,
  `  globalThis.${fn};`,
  `}`,
]);

await fs.appendFile(outPath, "\n" + lines.join("\n") + "\n");
