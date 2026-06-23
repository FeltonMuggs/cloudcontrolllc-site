import './globals.css';

export const metadata = {
  metadataBase: new URL('https://cloudcontrolllc.com'),
  title: 'Cloud Control LLC - Verifiable Infrastructure, From the Ground Up',
  description:
    'The digital foundation for real infrastructure - GBA-certified blockchain for verifiable trust, compliance, and performance across the built environment.',
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
    <body>{children}</body>
    </html>
  );
}
