export const metadata = {
  metadataBase: new URL('https://cloudcontrolllc.com'),
  title: 'DNaI — The Genomic Sovereign Token | Cloud Control LLC',
  description:
    'DNaI is the genomic sovereign token that transforms every human\'s genetic code into a verifiable, ownable digital asset. Your DNA. Your data. Your sovereignty.',
  openGraph: {
    title: 'DNaI — Genomic Sovereign Token',
    description: 'Your genome is an asset. DNaI is the blockchain instrument that proves it.',
    url: 'https://cloudcontrolllc.com/dnai',
    siteName: 'Cloud Control LLC',
    type: 'website',
  },
};

export default function DNaILayout({ children }) {
  return children;
}
