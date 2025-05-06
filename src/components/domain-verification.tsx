"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { CheckCircle, XCircle, RefreshCw, ExternalLink } from "lucide-react";

type DomainVerificationProps = {
  domain: string;
};

export function DomainVerification({ domain }: DomainVerificationProps) {
  const [verificationStatus, setVerificationStatus] = useState<
    "pending" | "success" | "failed"
  >("pending");
  const [isChecking, setIsChecking] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  // Function to verify domain by checking DNS records
  const checkDomainVerification = async () => {
    if (!domain) return;
    
    setIsChecking(true);
    try {
      // Simulate API call to check DNS records
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      // In a real implementation, this would make API calls to check:
      // 1. If the CNAME record points to custom.pingpanda.io
      // 2. If the TXT record contains the correct verification string
      
      // For now, we'll simulate an actual DNS lookup with a more robust check
      // This is a placeholder for the actual DNS verification logic
      
      // In a production environment, this would be replaced with actual DNS lookups
      // using a DNS resolution service or API
      
      // Mock DNS verification - in a real implementation, this would be replaced with
      // actual DNS record checks against the domain's nameservers
      const mockCheckCNAME = async () => {
        console.log("Checking CNAME record for", domain);
        // Always return false in this demo to simulate unverified records
        // In production, this would check if the CNAME points to custom.pingpanda.io
        return false;
      };
      
      const mockCheckTXT = async () => {
        console.log("Checking TXT record for", domain);
        // Always return false in this demo to simulate unverified records
        // In production, this would check if the TXT record contains the correct verification string
        return false;
      };
      
      // Check both DNS records
      const cnameVerified = await mockCheckCNAME();
      const txtVerified = await mockCheckTXT();
      
      // Domain is only verified if both records are correct
      const isVerified = cnameVerified && txtVerified;
      
      setVerificationStatus(isVerified ? "success" : "failed");
      
      // In a real implementation, we would also store the verification status in the database
      // and update the user's account to mark the domain as verified
    } catch (error) {
      setVerificationStatus("failed");
      console.error("Error verifying domain:", error);
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <Card className="p-6 max-w-xl w-full">
      <h3 className="text-lg font-medium mb-4">Domain Verification</h3>
      
      {!domain && (
        <Alert className="mb-4 bg-gray-50 border-gray-200">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-600"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
          <AlertTitle className="text-gray-800">No Domain Entered</AlertTitle>
          <AlertDescription className="text-gray-700">
            Please enter a custom domain in the field above to begin the verification process.
          </AlertDescription>
        </Alert>
      )}
      
      <div className="space-y-4">
        <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
          <h4 className="font-medium mb-2">DNS Configuration</h4>
          <p className="text-sm text-gray-600 mb-4">
            To use <strong>{domain}</strong> with PingPanda, follow these steps to configure your DNS records:
          </p>
          
          <div className="space-y-5">
            <div>
              <h5 className="text-sm font-medium mb-2">Step 1: Add a CNAME Record</h5>
              <div className="bg-blue-50 p-3 rounded-md border border-blue-100 mb-2">
                <p className="text-xs text-blue-700 mb-1">This record directs traffic from your domain to our servers.</p>
              </div>
              <div className="grid grid-cols-3 gap-2 text-sm">
                <div className="font-medium">Type</div>
                <div className="font-medium">Name/Host</div>
                <div className="font-medium">Value/Target</div>
              </div>
              <div className="grid grid-cols-3 gap-2 text-sm bg-white p-2 rounded border border-gray-200">
                <div>CNAME</div>
                <div>{domain.split('.')[0]}</div>
                <div>custom.pingpanda.io</div>
              </div>
              <p className="text-xs text-gray-500 mt-1">Example: If your domain is <code>app.example.com</code>, set <code>app</code> as the Name/Host.</p>
            </div>
            
            <div>
              <h5 className="text-sm font-medium mb-2">Step 2: Add a TXT Record for Verification</h5>
              <div className="bg-blue-50 p-3 rounded-md border border-blue-100 mb-2">
                <p className="text-xs text-blue-700 mb-1">This record proves you own the domain.</p>
              </div>
              <div className="grid grid-cols-3 gap-2 text-sm">
                <div className="font-medium">Type</div>
                <div className="font-medium">Name/Host</div>
                <div className="font-medium">Value/Content</div>
              </div>
              <div className="grid grid-cols-3 gap-2 text-sm bg-white p-2 rounded border border-gray-200">
                <div>TXT</div>
                <div>_pingpanda-verification.{domain}</div>
                <div className="break-all">pingpanda-domain-verification={domain}</div>
              </div>
              <p className="text-xs text-gray-500 mt-1">Example: For <code>app.example.com</code>, set <code>_pingpanda-verification.app.example.com</code> as the Name/Host.</p>
            </div>
          </div>
          
          <div className="mt-4">
            <h5 className="text-sm font-medium mb-2">Example DNS Configuration</h5>
            <div className="border border-gray-200 rounded-md overflow-hidden">
              <div className="bg-gray-100 p-2 border-b border-gray-200 flex items-center">
                <div className="w-4 h-4 rounded-full bg-red-500 mr-1.5"></div>
                <div className="w-4 h-4 rounded-full bg-yellow-500 mr-1.5"></div>
                <div className="w-4 h-4 rounded-full bg-green-500 mr-1.5"></div>
                <div className="text-xs text-gray-600 ml-2 flex-1 text-center">Example Domain Registrar - DNS Management</div>
              </div>
              <div className="p-3 bg-white">
                <div className="text-xs mb-3 text-gray-500">Here's how your DNS configuration might look in your domain registrar's dashboard:</div>
                <table className="w-full text-xs border-collapse">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="p-1.5 text-left border border-gray-200">Type</th>
                      <th className="p-1.5 text-left border border-gray-200">Name/Host</th>
                      <th className="p-1.5 text-left border border-gray-200">Value/Target</th>
                      <th className="p-1.5 text-left border border-gray-200">TTL</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="p-1.5 border border-gray-200 font-mono">CNAME</td>
                      <td className="p-1.5 border border-gray-200 font-mono">{domain ? domain.split('.')[0] : 'app'}</td>
                      <td className="p-1.5 border border-gray-200 font-mono">custom.pingpanda.io</td>
                      <td className="p-1.5 border border-gray-200">Auto</td>
                    </tr>
                    <tr>
                      <td className="p-1.5 border border-gray-200 font-mono">TXT</td>
                      <td className="p-1.5 border border-gray-200 font-mono">_pingpanda-verification{domain ? '.' + domain : '.example.com'}</td>
                      <td className="p-1.5 border border-gray-200 font-mono break-all">pingpanda-domain-verification={domain || 'example.com'}</td>
                      <td className="p-1.5 border border-gray-200">Auto</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="mt-4 bg-amber-50 p-3 rounded-md border border-amber-100">
            <h5 className="text-sm font-medium flex items-center gap-1 mb-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-600"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
              Important Notes
            </h5>
            <ul className="text-xs text-amber-700 list-disc pl-4 space-y-1">
              <li>DNS changes can take up to 48 hours to propagate across the internet.</li>
              <li>The exact steps to add DNS records vary depending on your domain registrar (GoDaddy, Namecheap, etc.).</li>
              <li>Some registrars may require you to enter the full domain in the Name/Host field, while others expect only the subdomain part.</li>
              <li>If you're unsure, check your domain registrar's documentation or contact their support.</li>
            </ul>
          </div>
          
          <p className="text-xs text-gray-500 mt-4">
            Once you've added these records, click "Verify Domain" below to check if your configuration is correct.
          </p>
          
          <div className="mt-4 border border-gray-200 rounded-md overflow-hidden">
            <button 
              className="w-full p-2 bg-gray-50 text-left text-sm font-medium flex justify-between items-center" 
              onClick={() => setShowHelp(!showHelp)}
            >
              <span className="flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-600"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                Need Help with DNS Configuration?
              </span>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform ${showHelp ? 'rotate-180' : ''}`}><polyline points="6 9 12 15 18 9"></polyline></svg>
            </button>
            
            {showHelp && (
              <div className="p-3 bg-white border-t border-gray-200">
                <div className="space-y-3">
                  <div>
                    <h6 className="text-sm font-medium mb-1">What if my registrar doesn't allow underscores in record names?</h6>
                    <p className="text-xs text-gray-600">Some registrars don't allow underscores in DNS record names. In this case, you can use <code>pingpanda-verification.{domain || 'example.com'}</code> instead of <code>_pingpanda-verification.{domain || 'example.com'}</code>.</p>
                  </div>
                  
                  <div>
                    <h6 className="text-sm font-medium mb-1">How long does verification take?</h6>
                    <p className="text-xs text-gray-600">The verification check itself is instant, but DNS changes can take up to 48 hours to propagate across the internet. If verification fails, wait a few hours and try again.</p>
                  </div>
                  
                  <div>
                    <h6 className="text-sm font-medium mb-1">Do I need to include 'https://' in my domain?</h6>
                    <p className="text-xs text-gray-600">No, just enter the domain name (e.g., <code>app.example.com</code>) without the protocol.</p>
                  </div>
                  
                  <div>
                    <h6 className="text-sm font-medium mb-1">Can I use a root domain?</h6>
                    <p className="text-xs text-gray-600">We recommend using a subdomain (like <code>app.yourdomain.com</code>) rather than a root domain for better flexibility. If you must use a root domain, you'll need to set up an A record instead of a CNAME.</p>
                  </div>
                  
                  <div>
                    <h6 className="text-sm font-medium mb-1">Where can I get more help?</h6>
                    <p className="text-xs text-gray-600">If you're still having trouble, please <a href="#" className="text-blue-600 hover:underline">contact our support team</a> with details about your domain and the steps you've taken.</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {verificationStatus === "success" && (
          <Alert className="bg-green-50 border-green-200">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertTitle className="text-green-800">Domain Verified</AlertTitle>
            <AlertDescription className="text-green-700">
              <p className="mb-2">Your domain has been successfully verified and is now active!</p>
              <div className="flex flex-col gap-2">
                <p>Users can access your branded experience at: <a href={`https://${domain}`} target="_blank" rel="noopener noreferrer" className="underline font-medium flex items-center gap-1 inline-flex">https://{domain} <ExternalLink className="h-3 w-3" /></a></p>
                <p className="text-xs">Note: It may take a few minutes for your custom domain to become fully active across all regions.</p>
              </div>
            </AlertDescription>
          </Alert>
        )}
        
        {verificationStatus === "failed" && (
          <Alert className="bg-red-50 border-red-200">
            <XCircle className="h-4 w-4 text-red-600" />
            <AlertTitle className="text-red-800">Verification Failed</AlertTitle>
            <AlertDescription className="text-red-700">
              <p className="mb-2">We couldn't verify your domain. Here are some common issues to check:</p>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                <li>DNS records may not have propagated yet (can take up to 48 hours)</li>
                <li>The CNAME record might be pointing to the wrong target</li>
                <li>The TXT record might have incorrect formatting</li>
                <li>Your domain registrar might require different formatting for the record names</li>
              </ul>
              <p className="mt-2 text-sm">After making any corrections, click "Verify Domain" again. If you continue to have issues, please <a href="#" className="underline font-medium">contact support</a>.</p>
            </AlertDescription>
          </Alert>
        )}
        
        {verificationStatus === "pending" && (
          <Alert className="bg-blue-50 border-blue-200">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
            <AlertTitle className="text-blue-800">Verification Pending</AlertTitle>
            <AlertDescription className="text-blue-700">
              <p>Add the DNS records shown above, then click "Verify Domain" to check your configuration.</p>
            </AlertDescription>
          </Alert>
        )}
        
        <div className="flex justify-end">
          <Button 
            onClick={checkDomainVerification} 
            disabled={isChecking || !domain}
            className="flex items-center gap-2 px-4"
            variant={domain ? "default" : "outline"}
          >
            {isChecking && <RefreshCw className="h-4 w-4 animate-spin mr-1" />}
            {!isChecking && verificationStatus === "pending" && <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>}
            {!isChecking && verificationStatus === "failed" && <RefreshCw className="h-4 w-4 mr-1" />}
            {!isChecking && verificationStatus === "success" && <CheckCircle className="h-4 w-4 mr-1" />}
            {!domain && "Enter Domain Above"}
            {domain && verificationStatus === "pending" && "Verify Domain"}
            {domain && verificationStatus === "failed" && "Try Again"}
            {domain && verificationStatus === "success" && "Verified"}
          </Button>
        </div>
      </div>
    </Card>
  );
}