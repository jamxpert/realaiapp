import Image from "next/image";
import type { ImageInfo } from "@/lib/images";

export function Screenshot({ image, alt, caption }: { image: ImageInfo; alt: string; caption?: string }) {
  return (
    <figure className="not-prose my-8">
      <a href={image.src} target="_blank" rel="noopener" className="block" aria-label={`${alt} (open full size)`}>
        <Image
          src={image.src}
          alt={alt}
          width={image.width}
          height={image.height}
          sizes="(min-width: 1024px) 720px, 100vw"
          className="h-auto w-full rounded-xl border border-line"
        />
      </a>
      {caption && <figcaption className="mt-2 text-center text-sm text-muted">{caption}</figcaption>}
    </figure>
  );
}
