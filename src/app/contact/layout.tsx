import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us | PingPanda',
  description: 'Get in touch with the PingPanda team for support, sales inquiries, or technical assistance',
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}