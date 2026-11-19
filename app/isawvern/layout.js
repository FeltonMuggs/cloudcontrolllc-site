export const metadata = {
  metadataBase: new URL('https://cloudcontrolllc.com'),
  title: 'iSawVern — AI Legal Navigator | Cloud Control LLC',
  description:
    'iSawVern.ai (pronounced "I saw Vern") is a Cloud Control LLC project: Vern, an AI legal navigator for people who feel the justice system is being used against them, with a verifiable on-chain record in development. Not legal advice.',
  openGraph: {
    title: 'iSawVern — Your rights, immutably navigated',
    description: 'Meet Vern: an AI legal navigator with a tamper-evident record. A Cloud Control LLC project.',
    url: 'https://cloudcontrolllc.com/isawvern',
    siteName: 'Cloud Control LLC',
    type: 'website',
  },
};

export default function ISawVernLayout({ children }) {
  return children;
}
