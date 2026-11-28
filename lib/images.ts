import fs from "node:fs";
import path from "node:path";
import { imageSize } from "image-size";

export interface ImageInfo {
  src: string;
  width: number;
  height: number;
}

const cache = new Map<string, ImageInfo>();

/**
 * Reads the size of an image in /public, so next/image can reserve its space
 * (no layout shift). A missing file fails the build with the file that used it.
 */
export function getImageInfo(src: string, usedIn: string): ImageInfo {
  const cached = cache.get(src);
  if (cached) return cached;

  if (!src.startsWith("/")) {
    throw new Error(`${usedIn}: image path "${src}" must start with "/" (for example /images/my-article/shot.png)`);
  }
  const file = path.join(process.cwd(), "public", src);
  if (!fs.existsSync(file)) {
    throw new Error(`${usedIn}: image "${src}" not found. Put the file at public${src}`);
  }
  const { width, height } = imageSize(fs.readFileSync(file));
  if (!width || !height) throw new Error(`${usedIn}: could not read the size of "${src}"`);

  const info = { src, width, height };
  cache.set(src, info);
  return info;
}
