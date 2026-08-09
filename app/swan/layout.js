export const metadata = {
  metadataBase: new URL('https://cloudcontrolllc.com'),
  title: 'SWAN — Land & Carbon Credit RWA Broker | Cloud Control LLC',
  description:
    'SWAN decouples the finance friction and historical restrictions that keep smaller landowners out of land and carbon-credit real-world-asset markets. Broker-matched, oracle-priced, chain-verified. Testnet demo.',
  openGraph: {
    title: 'SWAN — Land & Carbon Credit RWA Broker',
    description: 'Verified, not trusted: opening land and carbon-credit markets to smaller landowners.',
    url: 'https://cloudcontrolllc.com/swan',
    siteName: 'Cloud Control LLC',
    type: 'website',
  },
};

export default function SwanLayout({ children }) {
  return children;
}
