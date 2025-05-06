'use client';

import { MaxWidthWrapper } from '@/components/max-width-wrapper';
import { Navbar } from '@/components/navbar';
import { Mail, MessageSquare, Clock, MapPin, Twitter, Github, Send } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';
import Footer from '@/components/footer';

const contactOptions = [
  {
    title: 'General Inquiries',
    description: 'Questions about our services or company',
    email: 'info@pingpanda.com',
    responseTime: '24-48 hours',
    icon: <Mail className="h-6 w-6 text-indigo-500" />
  },
  {
    title: 'Technical Support',
    description: 'Technical issues or implementation help',
    email: 'support@pingpanda.com',
    responseTime: '12-24 hours',
    icon: <MessageSquare className="h-6 w-6 text-indigo-500" />
  },
  {
    title: 'Business Development',
    description: 'Partnership opportunities and enterprise solutions',
    email: 'business@pingpanda.com',
    responseTime: '2-3 business days',
    icon: <Clock className="h-6 w-6 text-indigo-500" />
  },
  {
    title: 'Privacy & Legal',
    description: 'Privacy concerns or legal inquiries',
    email: 'privacy@pingpanda.com',
    responseTime: '3-5 business days',
    icon: <MapPin className="h-6 w-6 text-indigo-500" />
  }
];

const faqs = [
  {
    question: "What information should I include in my support request?",
    answer: "Please include your account email, a detailed description of the issue, any error messages you're seeing, and steps to reproduce the problem if applicable."
  },
  {
    question: "Do you offer phone support?",
    answer: "We currently don't offer phone support, but our email support team is available 24/7. Enterprise customers have access to priority support channels."
  },
  {
    question: "How quickly can I expect a response?",
    answer: "Response times vary by department, but we typically respond to technical support inquiries within 12-24 hours. For urgent issues, please mark your email as high priority."
  },
];

const ContactPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [department, setDepartment] = useState('general');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    setSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
      setDepartment('general');
    }, 1500);
  };

  return (
    <>
      <Navbar />
      <div className="bg-gradient-to-b from-indigo-50 to-white pt-16 pb-8">
        <MaxWidthWrapper>
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl mb-4">
              Get in Touch
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600 max-w-2xl mx-auto">
              Have questions or need assistance? We're here to help you get the most out of PingPanda.
            </p>
          </div>
        </MaxWidthWrapper>
      </div>

      <MaxWidthWrapper className="py-12">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Contact Form Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a message</h2>
              
              {submitted ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-6 flex flex-col items-center text-center">
                  <div className="bg-green-100 p-3 rounded-full mb-4">
                    <Send className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-green-800 mb-2">Message Sent!</h3>
                  <p className="text-green-700 mb-4">
                    Thank you for reaching out. We'll get back to you shortly.
                  </p>
                  <button 
                    onClick={() => setSubmitted(false)}
                    className="bg-white text-green-700 border border-green-300 px-4 py-2 rounded-md hover:bg-green-50 transition"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                        Your Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="John Doe"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="john@example.com"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1">
                      Department
                    </label>
                    <select
                      id="department"
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="general">General Inquiry</option>
                      <option value="technical">Technical Support</option>
                      <option value="business">Business Development</option>
                      <option value="privacy">Privacy & Legal</option>
                    </select>
                  </div>
                  
                  <div className="mb-6">
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                      Subject
                    </label>
                    <input
                      type="text"
                      id="subject"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="How can we help you?"
                      required
                    />
                  </div>
                  
                  <div className="mb-6">
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                      Message
                    </label>
                    <textarea
                      id="message"
                      rows={6}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Please describe how we can assist you..."
                      required
                    />
                  </div>
                  
                  <button
                    type="submit"
                    disabled={submitting}
                    className={`w-full bg-indigo-600 text-white py-3 px-6 rounded-md font-medium hover:bg-indigo-700 transition ${
                      submitting ? 'opacity-70 cursor-not-allowed' : ''
                    }`}
                  >
                    {submitting ? 'Sending...' : 'Send Message'}
                  </button>
                </form>
              )}
            </div>
          </div>
          
          {/* Contact Info Sidebar */}
          <div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Contact Information</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium text-indigo-600 mb-2">Office Location</h3>
                  <p className="text-gray-600">
                    123 Tech Avenue, Suite 400<br />
                    San Francisco, CA 94107<br />
                    United States
                  </p>
                </div>
                
                <div>
                  <h3 className="font-medium text-indigo-600 mb-2">Operating Hours</h3>
                  <p className="text-gray-600">
                    Monday - Friday<br />
                    9:00 AM - 6:00 PM (PST)
                  </p>
                </div>
                
                <div>
                  <h3 className="font-medium text-indigo-600 mb-2">Connect With Us</h3>
                  <div className="flex space-x-4 mt-2">
                    <Link 
                      href="https://twitter.com/pingpanda" 
                      target="_blank"
                      className="bg-gray-100 hover:bg-gray-200 p-2 rounded-full transition"
                      aria-label="Twitter"
                    >
                      <Twitter className="h-5 w-5 text-gray-700" />
                    </Link>
                    <Link 
                      href="https://github.com/pingpanda" 
                      target="_blank"
                      className="bg-gray-100 hover:bg-gray-200 p-2 rounded-full transition"
                      aria-label="GitHub"
                    >
                      <Github className="h-5 w-5 text-gray-700" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-indigo-50 rounded-xl p-6">
              <h3 className="font-semibold text-indigo-900 mb-3">Need Immediate Help?</h3>
              <p className="text-indigo-700 mb-4 text-sm">
                Check out our documentation for quick answers to common questions.
              </p>
              <Link 
                href="/docs" 
                className="inline-block bg-white text-indigo-600 border border-indigo-200 px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-100 transition"
              >
                Visit Documentation
              </Link>
            </div>
          </div>
        </div>
        
        {/* Contact Options */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Department Contacts</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactOptions.map((option) => (
              <div 
                key={option.title} 
                className="bg-white border border-gray-100 rounded-lg p-6 shadow-sm hover:shadow-md transition"
              >
                <div className="mb-4">{option.icon}</div>
                <h3 className="text-lg font-semibold mb-2">{option.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{option.description}</p>
                <div className="space-y-2 text-sm">
                  <p className="font-medium">
                    Email: <a href={`mailto:${option.email}`} className="text-indigo-600 hover:underline">{option.email}</a>
                  </p>
                  <p className="text-gray-500">Response time: {option.responseTime}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* FAQs */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Frequently Asked Questions</h2>
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
            {faqs.map((faq, index) => (
              <div 
                key={index} 
                className={`p-6 ${index !== faqs.length - 1 ? 'border-b border-gray-200' : ''}`}
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{faq.question}</h3>
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </MaxWidthWrapper>
      <Footer />
    </>
  );
};

export default ContactPage;