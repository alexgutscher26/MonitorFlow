import { Metadata } from 'next';
import { MaxWidthWrapper } from '@/components/max-width-wrapper';
import DataPrivacyManager from '@/components/data-privacy-manager';
import Footer from '@/components/footer';

export const metadata: Metadata = {
  title: 'Privacy Settings | PingPanda',
  description: 'Manage your privacy settings and data preferences',
};

const PrivacySettingsPage = () => {
  return (
    <><MaxWidthWrapper className="py-8">
      <DataPrivacyManager />
    </MaxWidthWrapper><Footer /></>
  );
};

export default PrivacySettingsPage;