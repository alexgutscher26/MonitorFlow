import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service | PingPanda',
  description: 'Terms of Service and User Agreement for PingPanda users',
};

export default function TermsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}