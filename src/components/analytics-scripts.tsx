import Script from "next/script";

export function AnalyticsScripts() {
 const gaId = process.env.NEXT_PUBLIC_GA_ID;

 return (
 <>
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
