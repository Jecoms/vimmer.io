import { mkdir, copyFile, access } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "..");
const src = resolve(root, "node_modules/vim-wasm");
const dest = resolve(root, "public/vim-wasm");

const files = ["vim.js", "vim.wasm", "vim.data"];

await mkdir(dest, { recursive: true });
for (const f of files) {
  const from = resolve(src, f);
  const to = resolve(dest, f);
  await access(from).catch(() => {
    throw new Error(`Missing ${from} — is vim-wasm installed?`);
  });
  await copyFile(from, to);
  console.log(`copied ${f}`);
}
