import nodeResolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";

/** @type {import('rollup').RollupOptions} */
const config = {
  input: "src/main.ts",
  output: {
    dir: "dist",
    format: "iife",
    name: "EXPORTS",
  },
  plugins: [nodeResolve(), typescript()],
};

export default config;
