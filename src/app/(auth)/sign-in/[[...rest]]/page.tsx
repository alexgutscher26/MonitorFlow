"use client";

import { SignIn } from "@clerk/nextjs";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { MoveRight, HelpCircle, Shield } from "lucide-react";

/**
 * Represents a sign-in page with branding and authentication functionality.
 */
const Page = () => {
  // Get URL parameters to handle redirect after authentication
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
          
          <h2 className="text-4xl font-bold mb-4 text-center">Welcome to MonitorFlow</h2>
          
          <p className="text-center text-lg max-w-md opacity-90 mb-8">
            Your all-in-one platform for managing projects and teams effectively.
          </p>
          
          {/* Feature highlights */}
          <div className="mt-8 space-y-4 w-full max-w-md">
            <div className="flex items-center space-x-3">
              <div className="bg-white/20 p-2 rounded-full">
                <MoveRight size={20} className="text-white" />
              </div>
              <p className="text-white/90">Streamlined workflow management</p>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="bg-white/20 p-2 rounded-full">
                <MoveRight size={20} className="text-white" />
              </div>
              <p className="text-white/90">Real-time collaboration tools</p>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="bg-white/20 p-2 rounded-full">
                <MoveRight size={20} className="text-white" />
              </div>
              <p className="text-white/90">Advanced analytics dashboard</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right side with sign-in form */}
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Sign in</h1>
            <p className="text-gray-600">Access your account to get started</p>
          </div>
          
          {/* Security message */}
          <div className="mb-6 p-3 bg-blue-50 border border-blue-100 rounded-lg flex items-center">
            <Shield size={18} className="text-blue-500 mr-2 flex-shrink-0" />
            <p className="text-sm text-blue-700">
              Secure authentication powered by Clerk
            </p>
          </div>
          
          {/* Sign-in component from Clerk */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <SignIn
              forceRedirectUrl={intent ? `/dashboard?intent=${intent}` : "/dashboard"}
            />
          </div>
          
          {/* Enhanced support section */}
          <div className="mt-8 text-center p-4 bg-gray-50 rounded-lg border border-gray-100">
            <div className="flex items-center justify-center mb-2">
              <HelpCircle size={16} className="text-gray-400 mr-1" />
              <span className="text-sm font-medium text-gray-700">Need assistance?</span>
            </div>
            <p className="text-sm text-gray-500">
              We're here to help! <Link href="/contact" className="text-blue-600 hover:underline font-medium">Contact support</Link>
            </p>
          </div>
        </div>
        
        {/* Footer with enhanced styling */}
        <footer className="mt-auto pt-8 text-center">
          <p className="text-sm text-gray-500">© {new Date().getFullYear()} Trae. All rights reserved.</p>
          <div className="mt-2 flex justify-center space-x-4">
            <Link href="/terms" className="text-xs text-gray-400 hover:text-gray-600">Terms</Link>
            <Link href="/privacy" className="text-xs text-gray-400 hover:text-gray-600">Privacy</Link>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Page;