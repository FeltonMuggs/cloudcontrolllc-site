export const metadata = {
  metadataBase: new URL('https://cloudcontrolllc.com'),
  title: 'DNaI — Genomic Sovereign Token & Sovereign Genomic Wallet | Cloud Control LLC',
  description:
    "DNaI turns a genome into a verifiable, ownable digital asset. The Sovereign Genomic Wallet keeps your sequence sealed in a vault you control, makes consent a signed and revocable smart contract, and anchors every access grant, royalty and revocation on Flare. Provisional patent filed. Interactive Coston2 testnet demo from Cloud Control LLC, Colonial Beach, Virginia.",
  keywords: [
    'DNaI',
    'sovereign genomic wallet',
    'genomic sovereign token',
    'genomic data ownership',
    'DNA data sovereignty',
    'genomic consent management',
    'revocable data consent',
    'genomic royalties',
    'blockchain genomics',
    'Inherited Sciences',
    'Flare Network',
    'Cloud Control LLC',
    'blockchain company Virginia',
  ],
  alternates: {
    canonical: 'https://cloudcontrolllc.com/dnai',
  },
  openGraph: {
    title: 'DNaI — Your genome is an asset. Hold the keys.',
    description:
      'Your sequence stays sealed. Consent is a signed contract, not a checkbox. Every grant and revocation is provable on-chain. Try the interactive testnet demo.',
    url: 'https://cloudcontrolllc.com/dnai',
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
    title: 'DNaI — Sovereign Genomic Wallet',
    description:
      'Your genome, sealed in a vault you control. Consent as a revocable contract, anchored on Flare.',
    images: ['/assets/dnai-og.png'],
  },
};

export default function DNaILayout({ children }) {
  return children;
}
