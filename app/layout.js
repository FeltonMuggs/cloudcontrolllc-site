import Script from 'next/script';
import './globals.css';

// Google Tag Manager container. GA4 (G-TFPDN3XMCJ) is configured inside
// this container — do not add a direct gtag.js GA4 tag here, or every
// visit is counted twice.
const GTM_ID = 'GTM-WF7KPQVL';

export const metadata = {
  metadataBase: new URL('https://cloudcontrolllc.com'),
  title: 'Cloud Control LLC - Verifiable Infrastructure, From the Ground Up',
  description:
    'The digital foundation for real infrastructure - GBA-certified blockchain for verifiable trust, compliance, and performance across the built environment.',
  icons: {
    icon: '/logo.png',
    shortcut: '/logo.png',
    apple: '/logo.png',
  },
  openGraph: {
    title: 'Cloud Control LLC',
    description: 'Verifiable Infrastructure, From the Ground Up.',
    url: 'https://cloudcontrolllc.com',
    siteName: 'Cloud Control LLC',
    type: 'website',
  },
};

export const viewport = {
  themeColor: '#0a0c0d',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
    <head>
      <Script id="gtm-base" strategy="afterInteractive">
        {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_ID}');
document.addEventListener('click', function (e) {
  var a = e.target.closest && e.target.closest('a[href^="mailto:"]');
  if (a) window.dataLayer.push({ event: 'generate_lead', method: 'email', link_url: a.href });
});`}
      </Script>
    </head>
    <body>
      <noscript>
        <iframe
          src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
          height="0"
          width="0"
          style={{ display: 'none', visibility: 'hidden' }}
        />
      </noscript>
      {children}
    </body>
    </html>
  );
}
