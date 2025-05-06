'use client';

import Footer from '@/components/footer';
import { MaxWidthWrapper } from '@/components/max-width-wrapper';
import { Navbar } from '@/components/navbar';
import { Shield, AlertCircle, Clock, Search } from 'lucide-react';
import { useState } from 'react';

const termsData = [
  {
    id: 'acceptance',
    title: '1. Acceptance of Terms',
    content: 'By accessing or using PingPanda\'s services, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any part of these terms, you may not use our service.'
  },
  {
    id: 'service-description',
    title: '2. Service Description',
    content: 'PingPanda provides monitoring and analytics services for applications and systems. We reserve the right to modify, suspend, or discontinue any part of the service at any time. Features and functionality may change as the service evolves.'
  },
  {
    id: 'user-responsibilities',
    title: '3. User Responsibilities',
    content: 'As a user of our service, you are responsible for maintaining accurate account information, protecting account credentials, ensuring proper use of the service, and complying with all applicable laws. You agree not to use the service for any illegal or unauthorized purpose.'
  },
  {
    id: 'service-limitations',
    title: '4. Service Limitations',
    content: 'PingPanda services are subject to the following limitations: fair usage policies apply to all accounts, service availability may vary by region, maintenance windows may affect service access, and API rate limits apply to all integrations.',
    items: [
      'Fair usage policies apply to all accounts',
      'Service availability may vary by region',
      'Maintenance windows may affect service access',
      'API rate limits apply to all integrations'
    ]
  },
  {
    id: 'intellectual-property',
    title: '5. Intellectual Property',
    content: 'All content, features, and functionality of PingPanda services are owned by us and are protected by international copyright, trademark, and other intellectual property laws. You may not reproduce, distribute, modify, or create derivative works from any part of our service without our prior written consent.'
  },
  {
    id: 'data-security',
    title: '6. Data Security & Privacy',
    content: 'We implement reasonable security measures to protect your data. However, no method of transmission over the Internet is 100% secure. We process your data in accordance with our Privacy Policy, which is incorporated by reference into these Terms of Service.'
  },
  {
    id: 'termination',
    title: '7. Termination',
    content: 'We reserve the right to terminate or suspend access to our services immediately, without prior notice or liability, for any reason whatsoever, including breach of Terms. Upon termination, your right to use the service will cease immediately.'
  },
  {
    id: 'limitation-liability',
    title: '8. Limitation of Liability',
    content: 'To the maximum extent permitted by law, PingPanda shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use the service.'
  },
  {
    id: 'changes',
    title: '9. Changes to Terms',
    content: 'We reserve the right to modify these terms at any time. We will notify users of any changes by updating the date at the bottom of this page. Continued use of the service constitutes acceptance of modified terms.'
  },
  {
    id: 'governing-law',
    title: '10. Governing Law',
    content: 'These Terms shall be governed by the laws of the State of California, without respect to its conflict of laws principles. Any disputes relating to these Terms or the service shall be resolved in the courts located in San Francisco County, California.'
  }
];

const TermsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeSection, setActiveSection] = useState<string | null>(null);
  
  const filteredTerms = searchTerm 
    ? termsData.filter(term => 
        term.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        term.content.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : termsData;

  const lastUpdated = new Date('2025-03-15').toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <>
      <Navbar />
      <div className="bg-gradient-to-b from-indigo-50 to-white pt-16 pb-12">
        <MaxWidthWrapper>
          <div className="text-center">
            <div className="inline-flex items-center justify-center p-2 bg-indigo-100 rounded-full mb-6">
              <Shield className="h-6 w-6 text-indigo-600" />
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-4">Terms of Service</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              By using PingPanda's services, you agree to these terms. Please read them carefully.
            </p>
          </div>
        </MaxWidthWrapper>
      </div>

      <MaxWidthWrapper className="py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:w-1/4">
            <div className="sticky top-24 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-4 border-b border-gray-100">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="text"
                    placeholder="Search terms..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                  />
                </div>
              </div>
              <nav className="p-4">
                <ul className="space-y-1">
                  {filteredTerms.map((term) => (
                    <li key={term.id}>
                      <a
                        href={`#${term.id}`}
                        onClick={() => setActiveSection(term.id)}
                        className={`block px-3 py-2 rounded-md text-sm ${
                          activeSection === term.id
                            ? 'bg-indigo-50 text-indigo-700 font-medium'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {term.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
              
              <div className="bg-indigo-50 p-4 mt-2">
                <div className="flex items-center mb-2">
                  <Clock className="h-4 w-4 text-indigo-600 mr-2" />
                  <span className="text-xs font-medium text-indigo-700">Last Updated</span>
                </div>
                <p className="text-sm text-indigo-600">{lastUpdated}</p>
              </div>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="lg:w-3/4">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8 rounded-r-md">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <AlertCircle className="h-5 w-5 text-yellow-400" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-yellow-700">
                      This is a legal agreement between you and PingPanda. By using our services, you agree to these terms.
                    </p>
                  </div>
                </div>
              </div>
              
              {filteredTerms.map((term) => (
                <div 
                  key={term.id} 
                  id={term.id}
                  className="mb-10 scroll-mt-24"
                >
                  <h2 className="text-2xl font-semibold mb-4 text-gray-900">{term.title}</h2>
                  <p className="text-gray-600 mb-4">{term.content}</p>
                  
                  {term.items && (
                    <ul className="space-y-2 pl-5 mb-4">
                      {term.items.map((item, index) => (
                        <li key={index} className="flex items-start">
                          <span className="inline-flex items-center justify-center bg-indigo-100 rounded-full h-5 w-5 text-xs text-indigo-500 mr-3 mt-0.5">{index + 1}</span>
                          <span className="text-gray-600">{item}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
              
              <hr className="my-8 border-gray-200" />
              
              <div className="text-center">
                <p className="text-sm text-gray-500">
                  If you have any questions about these Terms, please contact us at{' '}
                  <a href="mailto:legal@pingpanda.com" className="text-indigo-600 hover:text-indigo-700">
                    legal@pingpanda.com
                  </a>
                </p>
              </div>
            </div>
            
            <div className="mt-8 flex justify-between items-center">
              <a 
                href="/privacy" 
                className="inline-flex items-center text-indigo-600 hover:text-indigo-700"
              >
                <span>Privacy Policy</span>
                <svg className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>
              
              <button 
                onClick={() => window.print()} 
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
                Print
              </button>
            </div>
          </div>
        </div>
      </MaxWidthWrapper>
      <Footer />
    </>
  );
};

export default TermsPage;