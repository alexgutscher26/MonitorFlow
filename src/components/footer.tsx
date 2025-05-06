'use client';

import Link from 'next/link';
import { Github, Twitter, Mail, Heart } from 'lucide-react';
import React from 'react';

const Footer = () => {
  // Use state to handle client-side rendering of the year
  const [currentYear, setCurrentYear] = React.useState(2025); // Default to current year

  // Update the year on the client side
  React.useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);
  
  const links = [
    { href: '/about', label: 'About' },
    { href: '/blog', label: 'Blog' },
    { href: '/privacy-policy', label: 'Privacy Policy' },
    { href: '/terms', label: 'Terms of Service' },
    { href: '/contact', label: 'Contact' },
  ];
  
  const socialLinks = [
    { 
      href: 'https://twitter.com/pingpanda', 
      label: 'Twitter',
      icon: <Twitter className="h-5 w-5" />
    },
    { 
      href: 'https://github.com/pingpanda', 
      label: 'GitHub',
      icon: <Github className="h-5 w-5" />
    },
    { 
      href: 'mailto:hello@pingpanda.com', 
      label: 'Email',
      icon: <Mail className="h-5 w-5" />
    },
  ];

  return (
    <footer className="bg-white dark:bg-gray-900 border-t">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Footer top section with logo and newsletter */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-gray-900 dark:text-white">PingPanda</span>
            </Link>
            <p className="text-sm text-gray-600 dark:text-gray-400 max-w-md">
              Monitoring and observability tools for modern applications.
              Keep your systems running smoothly with PingPanda.
            </p>
          </div>
          
          {/* Newsletter signup form */}
          <div className="lg:col-span-2">
            <div className="rounded-lg bg-gray-50 dark:bg-gray-800 p-6">
              <h3 className="text-base font-medium text-gray-900 dark:text-white">
                Subscribe to our newsletter
              </h3>
              <div className="mt-2 flex max-w-md gap-x-4">
                <label htmlFor="email-address" className="sr-only">
                  Email address
                </label>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="min-w-0 flex-auto rounded-md border-0 bg-white px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 dark:bg-gray-700 dark:text-white dark:ring-gray-600"
                  placeholder="Enter your email"
                />
                <button
                  type="submit"
                  className="flex-none rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Subscribe
                </button>
              </div>
              <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                We care about your data. Read our{' '}
                <Link href="/privacy-policy" className="underline hover:text-gray-700 dark:hover:text-gray-300">
                  Privacy Policy
                </Link>
                .
              </p>
            </div>
          </div>
        </div>
        
        {/* Divider */}
        <div className="mt-12 border-t border-gray-200 dark:border-gray-700 pt-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            {/* Navigation links */}
            <nav className="flex flex-wrap gap-x-4 gap-y-2">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300 transition"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            
            {/* Social links */}
            <div className="flex justify-start lg:justify-end space-x-6">
              {socialLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={link.label}
                >
                  {link.icon}
                </Link>
              ))}
            </div>
          </div>
          
          {/* Copyright */}
          <div className="mt-8 flex flex-col md:flex-row items-center justify-between">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              &copy; {currentYear} PingPanda. All rights reserved.
            </p>
            <p className="mt-4 md:mt-0 text-xs text-gray-500 dark:text-gray-400 flex items-center">
              Made with <Heart className="h-3 w-3 mx-1 text-red-500" /> in San Francisco
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;