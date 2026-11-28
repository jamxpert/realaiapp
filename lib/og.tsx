import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";

/** Size and type shared by every opengraph-image.tsx. */
export const ogSize = { width: 1200, height: 630 };
export const ogContentType = "image/png";

const colors = { bg: "#0a0506", fg: "#f7f2f2", muted: "#bda9ab", accent: "#ff7077", button: "#cf2c36", line: "#3a2a2d" };

interface OgInput {
  title: string;
  /** Small label above the title, e.g. "Review". */
  label?: string;
  romanUrdu?: boolean;
}

/** Title + site name on a dark background, drawn at build time. */
export async function renderOgImage({ title, label, romanUrdu = false }: OgInput): Promise<ImageResponse> {
  const [sora, icon] = await Promise.all([
    readFile(path.join(process.cwd(), "assets/fonts/Sora-Bold.ttf")),
    readFile(path.join(process.cwd(), "app/icon.svg")),
  ]);
  const iconSrc = `data:image/svg+xml;base64,${icon.toString("base64")}`;
  const fontSize = title.length > 80 ? 52 : title.length > 50 ? 62 : 74;

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "72px 80px",
        backgroundColor: colors.bg,
        backgroundImage: "radial-gradient(circle at 85% 10%, rgba(207,44,54,0.35), rgba(10,5,6,0) 55%)",
        fontFamily: "Sora",
        color: colors.fg,
      }}
    >
      <div style={{ display: "flex", gap: 14 }}>
        {label && (
          <div
            style={{
              display: "flex",
              padding: "8px 20px",
              borderRadius: 999,
              backgroundColor: colors.button,
              color: "#ffffff",
              fontSize: 24,
              textTransform: "uppercase",
              letterSpacing: 2,
            }}
          >
            {label}
          </div>
        )}
        {romanUrdu && (
          <div
            style={{
              display: "flex",
              padding: "6px 18px",
              borderRadius: 999,
              border: `2px solid ${colors.accent}`,
              color: colors.accent,
              fontSize: 24,
            }}
          >
            Roman Urdu
          </div>
        )}
      </div>

      <div style={{ display: "flex", fontSize, lineHeight: 1.15, letterSpacing: -1.5, maxWidth: 1000 }}>{title}</div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderTop: `2px solid ${colors.line}`,
          paddingTop: 28,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 36 }}>
          <img src={iconSrc} width={52} height={52} alt="" />
          <div style={{ display: "flex" }}>
            <span>Real</span>
            <span style={{ color: colors.accent }}>AI</span>
            <span>Apps</span>
          </div>
        </div>
        <div style={{ display: "flex", fontSize: 26, color: colors.muted }}>realaiapps.com</div>
      </div>
    </div>,
    { ...ogSize, fonts: [{ name: "Sora", data: sora, weight: 700, style: "normal" }] },
  );
}
