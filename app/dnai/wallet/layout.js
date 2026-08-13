export const metadata = {
  metadataBase: new URL('https://cloudcontrolllc.com'),
  title:
    'Sovereign Genomic Wallet — Own Your DNA Data | Inherited Sciences · Cloud Control LLC',
  description:
    'The Sovereign Genomic Wallet keeps your genome sealed in a vault you control. Consent is a signed, revocable smart contract; every access grant, royalty and revocation is anchored on Flare. Provisional patent filed. Interactive Coston2 testnet demo from Cloud Control LLC, Colonial Beach, Virginia.',
  keywords: [
    'sovereign genomic wallet',
    'genomic data ownership',
    'DNA data sovereignty',
    'genomic consent management',
    'blockchain genomics',
    'revocable data consent',
    'genomic royalties',
    'Inherited Sciences',
    'DNaI',
    'Flare Network',
    'Cloud Control LLC',
    'blockchain company Virginia',
  ],
  alternates: {
    canonical: 'https://cloudcontrolllc.com/dnai/wallet',
  },
  openGraph: {
    title: 'Sovereign Genomic Wallet — Your genome is an asset. Hold the keys.',
    description:
      'Your sequence stays sealed. Consent is a signed contract, not a checkbox. Every grant and revocation is provable on-chain. Try the interactive testnet demo.',
    url: 'https://cloudcontrolllc.com/dnai/wallet',
    siteName: 'Cloud Control LLC',
    type: 'website',
    images: [
      {
        url: '/assets/dnai-og.png',
        width: 1200,
        height: 630,
        alt: 'Inherited Sciences — DNaI, Decentralized Nucleic Asset Intelligence',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sovereign Genomic Wallet — Inherited Sciences',
    description:
      'Your genome, sealed in a vault you control. Consent as a revocable contract, anchored on Flare.',
    images: ['/assets/dnai-og.png'],
  },
};

export default function WalletLayout({ children }) {
  return children;
}
