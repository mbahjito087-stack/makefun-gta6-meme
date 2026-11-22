// Entry program for make.fun bounty gta6-meme-x-01: publish the bundled
// GTA 6 meme image as /output/entry.png.
// Standard library only, no network, deterministic: the same bundled
// meme.png always produces the same output bytes. Run: node main.ts
// (Node 24). Set MAKEFUN_OUTPUT_DIR to choose a different output folder.
import { copyFileSync, createReadStream, existsSync, mkdirSync, statSync } from "node:fs";
import { createHash } from "node:crypto";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(fileURLToPath(import.meta.url));
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
const src = join(root, "meme.png");
const dest = join(outDir, "entry.png");

function sha256File(path: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const hash = createHash("sha256");
    const stream = createReadStream(path);
    stream.on("data", (chunk) => hash.update(chunk));
    stream.on("error", reject);
    stream.on("end", () => resolve(hash.digest("hex")));
  });
}

if (!existsSync(src)) {
  throw new Error(
    `bundled meme image not found: ${src} — ` +
      `meme.png must sit next to main.ts in the checked-out entry; ` +
      `re-clone the repo or restore the file before running again.`,
  );
}
const srcStat = statSync(src);
if (!srcStat.isFile()) {
  throw new Error(`bundled meme image is not a regular file: ${src}`);
}
const srcSize = srcStat.size;
if (srcSize === 0) {
  throw new Error(`bundled meme image is empty (0 bytes): ${src}`);
}
const srcHash = await sha256File(src);

mkdirSync(outDir, { recursive: true });
copyFileSync(src, dest);

const destSize = statSync(dest).size;
const destHash = await sha256File(dest);
if (destSize !== srcSize || destHash !== srcHash) {
  throw new Error(
    `output verification failed: ${dest} does not match ${src} ` +
      `(source ${srcSize} bytes sha256 ${srcHash}, ` +
      `output ${destSize} bytes sha256 ${destHash}) — copy was incomplete or corrupted.`,
  );
}
console.log(`wrote ${dest} (${destSize} bytes, sha256 ${destHash})`);
