"use client";

import { SignUp } from "@clerk/nextjs";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { MoveRight, HelpCircle, Shield, CheckCircle } from "lucide-react";


const Page = () => {
  // Get URL parameters to handle any redirect parameters
  const searchParams = useSearchParams();
  const intent = searchParams.get("intent");

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50">
      {/* Left side with branding and visuals */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-blue-600 to-blue-800 relative overflow-hidden">
        {/* Enhanced SVG pattern background */}
        <div className="absolute inset-0 opacity-10">
          <svg width="100%" height="100%" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <circle cx="10" cy="10" r="2" fill="white" opacity="0.5" />
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="white" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
        
        {/* Content overlay with enhanced branding */}
        <div className="relative z-10 flex flex-col justify-center items-center p-12 text-white h-full">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-8 shadow-lg">
            <div className="text-blue-600 text-3xl font-bold">T</div>
          </div>
          
          <h2 className="text-4xl font-bold mb-4 text-center">Join MonitorFlow Today</h2>
          
          <p className="text-center text-lg max-w-md opacity-90 mb-8">
            Start your journey with the most powerful project management platform.
          </p>
          
          {/* Testimonial for social proof */}
          <div className="bg-white/10 p-6 rounded-lg backdrop-blur-sm mt-4 mb-8 max-w-md">
            <p className="italic text-white/90 mb-4">
              "MonitorFlow has transformed how our team collaborates. The onboarding was seamless, and we saw immediate productivity improvements."
            </p>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-500 rounded-full mr-3"></div>
              <div>
                <p className="font-medium">Sarah Johnson</p>
                <p className="text-sm text-white/70">Product Manager, TechCorp</p>
              </div>
            </div>
          </div>
          
          {/* Feature benefits */}
          <div className="mt-4 space-y-4 w-full max-w-md">
            <div className="flex items-center space-x-3">
              <div className="bg-white/20 p-2 rounded-full">
                <CheckCircle size={20} className="text-white" />
              </div>
              <p className="text-white/90">Free 14-day trial, no credit card required</p>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="bg-white/20 p-2 rounded-full">
                <CheckCircle size={20} className="text-white" />
              </div>
              <p className="text-white/90">Full access to all premium features</p>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="bg-white/20 p-2 rounded-full">
                <CheckCircle size={20} className="text-white" />
              </div>
              <p className="text-white/90">Unlimited projects during trial period</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right side with sign-up form */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 md:p-12">
        {/* Mobile logo (shown only on mobile) */}
        <div className="md:hidden mb-8 text-center">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="w-10 h-10 bg-blue-600 rounded-md flex items-center justify-center text-white font-bold shadow-md">
              T
            </div>
            <span className="text-2xl font-semibold text-gray-800">MonitorFlow</span>
          </Link>
        </div>

        <div className="w-full max-w-md">
          {/* Enhanced header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Create your account</h1>
            <p className="text-gray-600">Get started with MonitorFlow in just a few minutes</p>
          </div>
          
          {/* Benefits highlight */}
          <div className="mb-6 p-4 bg-green-50 border border-green-100 rounded-lg">
            <div className="flex items-center mb-2">
              <MoveRight size={18} className="text-green-500 mr-2 flex-shrink-0" />
              <p className="font-medium text-green-800">Quick setup process</p>
            </div>
            <p className="text-sm text-green-700 ml-6">
              Create your account and get started in under 2 minutes
            </p>
          </div>
          
          {/* Sign-up component from Clerk */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <SignUp
              fallbackRedirectUrl="/welcome"
              forceRedirectUrl={intent ? `/welcome?intent=${intent}` : "/welcome"}
            />
          </div>
          
          {/* Already have an account section */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Already have an account?{" "}
              <Link href="/sign-in" className="text-blue-600 font-medium hover:underline">
                Sign in
              </Link>
            </p>
          </div>
          
          {/* Security message */}
          <div className="mt-8 p-3 bg-blue-50 border border-blue-100 rounded-lg flex items-center">
            <Shield size={18} className="text-blue-500 mr-2 flex-shrink-0" />
            <p className="text-sm text-blue-700">
              Your data is securely encrypted and protected
            </p>
          </div>
          
          {/* Enhanced support section */}
          <div className="mt-6 text-center p-4 bg-gray-50 rounded-lg border border-gray-100">
            <div className="flex items-center justify-center mb-2">
              <HelpCircle size={16} className="text-gray-400 mr-1" />
              <span className="text-sm font-medium text-gray-700">Need assistance?</span>
            </div>
            <p className="text-sm text-gray-500">
              We're here to help! <Link href="/support" className="text-blue-600 hover:underline font-medium">Contact support</Link>
            </p>
          </div>
        </div>
        
        {/* Footer with enhanced styling */}
        <footer className="mt-auto pt-8 text-center">
          <p className="text-sm text-gray-500">© {new Date().getFullYear()} MonitorFlow. All rights reserved.</p>
          <div className="mt-2 flex justify-center space-x-4">
            <Link href="/terms" className="text-xs text-gray-400 hover:text-gray-600">Terms</Link>
            <Link href="/privacy" className="text-xs text-gray-400 hover:text-gray-600">Privacy</Link>
            <Link href="/legal" className="text-xs text-gray-400 hover:text-gray-600">Legal</Link>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Page;