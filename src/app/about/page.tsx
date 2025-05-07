'use client';

import { Heading } from '@/components/heading';
import { Github, Twitter, Mail, Monitor, Users, Globe } from 'lucide-react';
import { Navbar } from '@/components/navbar';
import Link from 'next/link';
import { useState } from 'react';
import Image from 'next/image';
import Footer from '@/components/footer';

const teamMembers = [
  {
    name: 'John Smith',
    role: 'CEO & Co-founder',
    bio: 'Passionate about building tools that make developers\' lives easier. With over 10 years of experience in SaaS and developer tools, John leads our vision and strategy.',
    image: '/team/john.jpg' as string,
    social: {
      twitter: 'https://twitter.com/johnsmith',
      github: 'https://github.com/johnsmith',
      email: 'john@pingpanda.com'
    }
  },
  {
    name: 'Sarah Johnson',
    role: 'CTO & Co-founder',
    bio: 'Expert in distributed systems and cloud infrastructure. Sarah previously led engineering teams at Amazon Web Services and brings deep technical expertise to our platform.',
    image: '/team/sarah.jpg' as string,
    social: {
      twitter: 'https://twitter.com/sarahj',
      github: 'https://github.com/sarahj',
      email: 'sarah@pingpanda.com'
    }
  },
  {
    name: 'Michael Chen',
    role: 'Head of Product',
    bio: 'Michael is dedicated to creating intuitive user experiences that solve real problems. His background in both design and engineering helps bridge the gap between technical capability and usability.',
    image: '/team/michael.jpg' as string,
    social: {
      twitter: 'https://twitter.com/michaelchen',
      github: 'https://github.com/michaelchen',
      email: 'michael@pingpanda.com'
    }
  },
  {
    name: 'Aisha Patel',
    role: 'Lead Engineer',
    bio: 'Aisha leads our backend infrastructure team, ensuring PingPanda is fast, reliable, and scalable. She\'s passionate about performance optimization and building robust systems.',
    image: '/team/aisha.jpg' as string,
    social: {
      twitter: 'https://twitter.com/aishapatel',
      github: 'https://github.com/aishapatel',
      email: 'aisha@pingpanda.com'
    }
  },
];

const coreValues = [
  {
    title: "Simplicity First",
    description: "We believe complex problems need simple solutions. Our tools cut through the noise to provide clear, actionable insights.",
    icon: <Monitor className="h-8 w-8 text-indigo-500" />
  },
  {
    title: "Developer Empathy",
    description: "Built by developers for developers. We understand the challenges you face because we've faced them ourselves.",
    icon: <Users className="h-8 w-8 text-indigo-500" />
  },
  {
    title: "Global Reliability",
    description: "With infrastructure spread across the world, we ensure your monitoring is as reliable as it is powerful.",
    icon: <Globe className="h-8 w-8 text-indigo-500" />
  }
];

const companyTimeline = [
  { year: '2021', event: 'PingPanda founded by John and Sarah' },
  { year: '2022', event: 'First public beta launched with 500 users' },
  { year: '2023', event: 'Series A funding of $4.5M' },
  { year: '2024', event: 'Reached 10,000 active users and expanded team to 15 people' },
];

export default function AboutPage() {
  const [activeTab, setActiveTab] = useState('mission');

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
        <main className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <div className="text-center mb-20">
            <div className="mb-6 inline-block p-2 bg-indigo-50 rounded-full">
              <Image src="/brand-asset-wave.png" alt="PingPanda Logo" width={64} height={64} className="w-16 h-16" />
            </div>
            <Heading className="mb-6" title={''} description={''}>About MonitorFlow</Heading>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              We're on a mission to make application monitoring simple, reliable, and accessible to developers worldwide. Our platform helps teams identify and resolve issues before they impact users.
            </p>
          </div>

          {/* Tabs Navigation */}
          <div className="flex justify-center mb-12">
            <div className="inline-flex p-1 bg-gray-100 rounded-lg">
              <button 
                onClick={() => setActiveTab('mission')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                  activeTab === 'mission' ? 'bg-white shadow text-indigo-600' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Our Mission
              </button>
              <button 
                onClick={() => setActiveTab('values')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                  activeTab === 'values' ? 'bg-white shadow text-indigo-600' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Core Values
              </button>
              <button 
                onClick={() => setActiveTab('story')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                  activeTab === 'story' ? 'bg-white shadow text-indigo-600' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Our Story
              </button>
            </div>
          </div>

          {/* Mission Section */}
          <section className={`mb-20 ${activeTab !== 'mission' ? 'hidden' : ''}`}>
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold mb-6 border-b pb-3">Our Mission</h2>
              <p className="text-lg text-gray-700 mb-8 leading-relaxed">
                At PingPanda, we believe every developer deserves powerful yet simple monitoring tools. 
                Too often, monitoring systems are complex, expensive, and difficult to set up, putting robust 
                observability out of reach for many teams. We're changing that by providing intelligent, 
                accessible tools that give developers the insights they need without the complexity.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition">
                  <h3 className="text-xl font-semibold mb-4 text-indigo-600">Simplify Monitoring</h3>
                  <p className="text-gray-600">
                    We believe that monitoring should be straightforward and intuitive.
                    Our tools are designed to provide clear insights without the complexity,
                    allowing you to focus on building great products instead of wrangling monitoring systems.
                  </p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition">
                  <h3 className="text-xl font-semibold mb-4 text-indigo-600">Empower Developers</h3>
                  <p className="text-gray-600">
                    By providing powerful yet accessible tools, we help developers
                    maintain reliable systems and respond quickly to issues. We aim to democratize
                    application monitoring, making it available to teams of all sizes.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Core Values Section */}
          <section className={`mb-20 ${activeTab !== 'values' ? 'hidden' : ''}`}>
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold mb-6 border-b pb-3">Core Values</h2>
              <p className="text-lg text-gray-700 mb-8 leading-relaxed">
                Our values guide everything we do at PingPanda – from how we build our product to how we 
                interact with our community. These principles have shaped our company from day one.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {coreValues.map((value) => (
                  <div key={value.title} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition">
                    <div className="mb-4">{value.icon}</div>
                    <h3 className="text-xl font-semibold mb-3 text-indigo-600">{value.title}</h3>
                    <p className="text-gray-600">{value.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Our Story Section */}
          <section className={`mb-20 ${activeTab !== 'story' ? 'hidden' : ''}`}>
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold mb-6 border-b pb-3">Our Story</h2>
              <p className="text-lg text-gray-700 mb-8 leading-relaxed">
                PingPanda was born out of frustration. As engineers at a high-growth startup, John and Sarah 
                experienced firsthand the pain of complex, expensive monitoring systems that still left critical 
                gaps in observability. They set out to build something better – monitoring that just works.
              </p>
              <div className="space-y-8">
                <ol className="relative border-l border-gray-200">
                  {companyTimeline.map((item, index) => (
                    <li key={index} className="mb-10 ml-6">
                      <span className="absolute flex items-center justify-center w-6 h-6 bg-indigo-100 rounded-full -left-3 ring-8 ring-white">
                        <div className="w-3 h-3 bg-indigo-600 rounded-full"></div>
                      </span>
                      <h3 className="flex items-center mb-1 text-lg font-semibold text-gray-900">
                        {item.event}
                        {index === companyTimeline.length - 1 && (
                          <span className="bg-indigo-100 text-indigo-800 text-sm font-medium mr-2.5 px-2.5 py-0.5 rounded ml-3">
                            Latest
                          </span>
                        )}
                      </h3>
                      <time className="block mb-2 text-sm font-normal leading-none text-gray-400">
                        {item.year}
                      </time>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </section>

          {/* Team Section */}
          <section className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Meet Our Team</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                We're a diverse team of engineers, designers, and product thinkers united by our mission to make monitoring simpler.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {teamMembers.map((member) => (
                <div key={member.name} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition">
                  <div className="text-center mb-4">
                    <Image
                      src={member.image}
                      alt={member.name}
                      width={96}
                      height={96}
                      className="w-24 h-24 rounded-full object-cover mx-auto mb-4"
                    />
                    <h3 className="text-xl font-semibold">{member.name}</h3>
                    <p className="text-indigo-600 font-medium mb-2">{member.role}</p>
                  </div>
                  <p className="text-gray-600 mb-4 text-sm">{member.bio}</p>
                  <div className="flex justify-center space-x-4">
                    <Link
                      href={member.social.twitter}
                      className="text-gray-500 hover:text-indigo-600 transition"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${member.name}'s Twitter`}
                    >
                      <Twitter className="h-5 w-5" />
                    </Link>
                    <Link
                      href={member.social.github}
                      className="text-gray-500 hover:text-indigo-600 transition"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${member.name}'s GitHub`}
                    >
                      <Github className="h-5 w-5" />
                    </Link>
                    <Link
                      href={`mailto:${member.social.email}`}
                      className="text-gray-500 hover:text-indigo-600 transition"
                      aria-label={`Email ${member.name}`}
                    >
                      <Mail className="h-5 w-5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Contact Section */}
          <section className="bg-indigo-50 p-12 rounded-xl text-center">
            <h2 className="text-3xl font-bold mb-6">Get in Touch</h2>
            <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
              Have questions or want to learn more about PingPanda?
              We'd love to hear from you and discuss how we can help your team.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="inline-block bg-indigo-600 text-white px-8 py-3 rounded-md font-semibold hover:bg-indigo-700 transition"
              >
                Contact Us
              </Link>
              <Link
                href="/demo"
                className="inline-block bg-white text-indigo-600 border border-indigo-600 px-8 py-3 rounded-md font-semibold hover:bg-indigo-50 transition"
              >
                Request a Demo
              </Link>
            </div>
          </section>
        </main>
      </div>
      <Footer />
    </>
  );
}