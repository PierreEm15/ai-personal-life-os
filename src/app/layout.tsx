import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI Personal Life OS',
  description: 'Your intelligent life operating system powered by AI',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
