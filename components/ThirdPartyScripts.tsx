import Script from "next/script";
import { features } from "@/lib/site-config";

/** Google Analytics and AdSense, loaded after the page is interactive. Off unless set in data/site.ts. */
export function ThirdPartyScripts() {
  const gaId = features.googleAnalyticsId;
  const adsenseId = features.adsenseClientId;
  return (
    <>
      {gaId && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} strategy="afterInteractive" />
          <Script id="ga-init" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag("js",new Date());gtag("config","${gaId}");`}
          </Script>
        </>
      )}
      {adsenseId && (
        <Script
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseId}`}
          strategy="afterInteractive"
          crossOrigin="anonymous"
        />
      )}
    </>
  );
}
