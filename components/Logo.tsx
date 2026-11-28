import Image from "next/image";
import Link from "next/link";
import icon from "@/app/icon.svg";

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2 font-display text-lg font-extrabold">
      <Image src={icon} alt="" width={32} height={32} unoptimized />
      <span>
        Real<span className="text-accent">AI</span>Apps
      </span>
    </Link>
  );
}
