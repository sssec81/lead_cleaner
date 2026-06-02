import Script from "next/script";

export function AnalyticsScripts() {
  const plausibleDomain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;
  const gaId = process.env.NEXT_PUBLIC_GA_ID;

  return (
    <>
      {plausibleDomain ? (
        <Script
          defer
          data-domain={plausibleDomain}
          data-manual="true"
          src="https://plausible.io/js/script.outbound-links.pageview-props.tagged-events.js"
        />
      ) : null}

      {gaId ? (
        <>
          <Script
            async
            src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
          />
          <Script id="google-analytics">
            {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
window.gtag = gtag;
gtag('js', new Date());`}
          </Script>
        </>
      ) : null}
    </>
  );
}
