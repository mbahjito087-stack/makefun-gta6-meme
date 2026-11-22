// Draft program for make.fun: copies the bundled draft asset to /output/entry.png.
// Standard library only, no network, deterministic: the same input always
// writes the same bytes. Run: node main.ts (Node 22).
// NOTE: for a real submission this file must be written in a recorded
// session (the transcript gate credits only lines the agent wrote there).
import { copyFileSync, mkdirSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(fileURLToPath(import.meta.url));
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });
const src = join(root, "meme.png");
if (!existsSync(src)) {
  throw new Error(`missing bundled asset: ${src}`);
}
copyFileSync(src, join(outDir, "entry.png"));
console.log(`wrote ${outDir}/entry.png`);
