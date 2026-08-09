export const metadata = {
  metadataBase: new URL('https://cloudcontrolllc.com'),
  title: 'Carbon Broker — Land & Carbon Credit RWA Broker | Cloud Control LLC',
  description:
    "Carbon Broker decouples the finance friction and historical restrictions that keep smaller landowners out of land and carbon-credit real-world-asset markets. Broker-matched, oracle-priced, chain-verified. Built for markets like Virginia's SWaN exchange. Testnet demo.",
  openGraph: {
    title: 'Carbon Broker — Land & Carbon Credit RWA',
    description: 'Verified, not trusted: opening land and carbon-credit markets to smaller landowners.',
    url: 'https://cloudcontrolllc.com/broker',
    siteName: 'Cloud Control LLC',
    type: 'website',
  },
};

export default function BrokerLayout({ children }) {
  return children;
}
