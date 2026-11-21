import Script from 'next/script';
import './globals.css';

const GA_ID = 'G-TFPDN3XMCJ';

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
    <body>
      {children}
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GA_ID}');
document.addEventListener('click', function (e) {
  var a = e.target.closest && e.target.closest('a[href^="mailto:"]');
  if (a) gtag('event', 'generate_lead', { method: 'email', link_url: a.href });
});`}
      </Script>
    </body>
    </html>
  );
}
