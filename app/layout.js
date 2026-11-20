import './globals.css';

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
      {/* Google tag (gtag.js) — GA4 property "Cloud Control LLC" */}
      <script async src="https://www.googletagmanager.com/gtm.js?id=GTM-PZV428WK"></script>
      <script
        dangerouslySetInnerHTML={{
          __html: `window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());`,
        }}
      />
    </head>
    <body>{children}</body>
    </html>
  );
}
