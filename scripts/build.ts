import fs from "node:fs/promises";

import { $ } from "bun";

const ENTRY_FUNCTIONS = ["rogers_to_ynab"];
const outPath = `dist/main.js`;

async function main(): Promise<void> {
  await $`rollup --config`;

  // HACK: This is hacky, but it's easier than messing with stupid bundler configs and plugins.
  const lines = ENTRY_FUNCTIONS.flatMap((fn) => [
    `function ${fn} () {`,
    `  EXPORTS.${fn}();`,
    `}`,
  ]);

  await fs.appendFile(outPath, "\n" + lines.join("\n") + "\n");
}

void main();
