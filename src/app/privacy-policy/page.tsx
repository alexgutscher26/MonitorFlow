import { Metadata } from 'next';
import { MaxWidthWrapper } from '@/components/max-width-wrapper';
import { Navbar } from '@/components/navbar';
import { format } from 'date-fns';
import Footer from '@/components/footer';

export const metadata: Metadata = {
  title: 'Privacy Policy | PingPanda',
  description: 'Privacy Policy and Data Protection Information for PingPanda users',
};

const PrivacyPolicyPage = () => {
  const lastUpdated = format(new Date(), 'MMMM dd, yyyy');
  
  return (
    <>
      <Navbar />
      <MaxWidthWrapper className="py-16">
        <div className="prose dark:prose-invert max-w-none mx-auto px-4 sm:px-6 lg:px-8">
          <header className="text-center mb-16">
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl mb-6">Privacy Policy</h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              At PingPanda, we take your privacy seriously. This policy describes how we collect,
              use, and protect your personal information.
            </p>
          </header>

          <section className="space-y-12">
            <PolicySection 
              title="1. Data Collection" 
              content="We collect information that you provide directly to us, including:"
              listItems={[
                "Account information (name, email, organization)",
                "Usage data and preferences",
                "Event monitoring data",
                "Communication preferences"
              ]}
            />

            <PolicySection 
              title="2. Data Usage" 
              content="We use your data to:"
              listItems={[
                "Provide and improve our services",
                "Send notifications and updates",
                "Analyze service performance",
                "Ensure security and prevent fraud"
              ]}
            />

            <PolicySection 
              title="3. Your Rights" 
              content="Under GDPR and CCPA, you have the right to:"
              listItems={[
                "Access your personal data",
                "Correct inaccurate data",
                "Request data deletion",
                "Export your data",
                "Opt-out of data processing",
                "Withdraw consent"
              ]}
            />

            <PolicySection 
              title="4. Data Protection" 
              content="We implement appropriate technical and organizational measures to protect your
              personal data against unauthorized access, alteration, disclosure, or destruction. Our security
              practices include encryption at rest and in transit, regular security audits, and strict 
              access controls for all personnel."
            />

            <PolicySection 
              title="5. Cookie Policy" 
              content="We use cookies and similar technologies to:"
              listItems={[
                "Remember your preferences",
                "Understand how you use our service",
                "Improve user experience",
                "Provide personalized content"
              ]}
            />

            <PolicySection 
              title="6. Third-Party Services" 
              content="We may share data with trusted third-party service providers who assist us in
              operating our service, conducting business, or servicing you. These parties are
              obligated to keep your information confidential and process data only according to our
              instructions. We carefully vet all service providers to ensure they maintain adequate
              security measures."
            />
            
            <PolicySection 
              title="7. International Data Transfers" 
              content="If your data is transferred outside your region, we ensure appropriate safeguards
              are in place in compliance with applicable data protection laws. This may include standard
              contractual clauses, adequacy decisions, or other legally recognized mechanisms."
            />

            <PolicySection 
              title="8. Data Retention" 
              content="We retain your personal data only for as long as necessary to fulfill the purposes
              for which it was collected, including legal, accounting, or reporting requirements. When
              data is no longer required, we securely delete or anonymize it."
            />

            <PolicySection 
              title="9. Contact Us" 
              content="For any privacy-related questions or to exercise your data rights, please contact
              our Data Protection Officer at:"
              listItems={[
                "Email: privacy@pingpanda.com",
                "Address: 123 Monitoring Street, Tech Valley, CA 94043"
              ]}
            />

            <PolicySection 
              title="10. Updates to This Policy" 
              content="We may update this privacy policy from time to time. We will notify you of any
              significant changes by posting the new policy on this page, sending you an email notification,
              or displaying a prominent notice in our application."
            />
          </section>

          <footer className="border-t border-gray-200 dark:border-gray-700 mt-16 pt-8">
            <p className="text-sm text-gray-500 text-center">
              Last updated: {lastUpdated}
            </p>
          </footer>
        </div>
      </MaxWidthWrapper>
    </>
  );
};

interface PolicySectionProps {
  title: string;
  content: string;
  listItems?: string[];
}

const PolicySection = ({ title, content, listItems }: PolicySectionProps) => {
  return (
    <><div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8 transition-all hover:shadow-lg">
      <h2 className="text-2xl font-semibold mb-4">{title}</h2>
      <p className="mb-4 text-gray-600 dark:text-gray-400">{content}</p>

      {listItems && listItems.length > 0 && (
        <ul className="space-y-3 text-gray-600 dark:text-gray-400">
          {listItems.map((item, index) => (
            <li key={index} className="flex items-start">
              <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 mr-3 flex-shrink-0">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      )}
    </div><Footer /></>
  );
};

export default PrivacyPolicyPage;