// Runs after `next build` (npm "postbuild").
//
// The static export saves the data the browser prefetches for each page in folders, like
//   out/tools/cursor/__next.tools/$d$slug/__PAGE__.txt
// but the browser asks for it with dots instead of folders:
//   /tools/cursor/__next.tools.$d$slug.__PAGE__.txt
// A static host has no server to translate between the two, so those requests would 404 and
// page-to-page clicks would lose their head start. This copies each file to the dotted name too.
import fs from "node:fs";
import path from "node:path";

const outDir = path.join(process.cwd(), "out");

/** @param {string} dir @returns {string[]} */
function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(full) : [full];
  });
}

if (!fs.existsSync(outDir)) {
  throw new Error("scripts/flatten-segments.mjs: out/ is missing. Run `npm run build` first.");
}

let copied = 0;
for (const file of walk(outDir)) {
  const parts = path.relative(outDir, file).split(path.sep);
  // The first folder whose name starts with "__next." holds the nested segment files.
  const start = parts.findIndex((part, i) => part.startsWith("__next.") && i < parts.length - 1);
  if (start === -1) continue;
  const flatName = parts.slice(start).join(".");
  const target = path.join(outDir, ...parts.slice(0, start), flatName);
  if (!fs.existsSync(target)) {
    fs.copyFileSync(file, target);
    copied++;
  }
}
console.log(`Prefetch files: copied ${copied} to the names the browser requests.`);
