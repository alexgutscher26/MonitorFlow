'use client';

import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { toast } from 'sonner';
import { Switch } from './ui/switch';
import { Info, ChevronDown, ChevronUp } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@clerk/nextjs';
import axios from 'axios';

interface ConsentCategory {
  id: keyof ConsentPreferences;
  label: string;
  description: string;
  required?: boolean;
}

interface ConsentPreferences {
  analytics: boolean;
  marketing: boolean;
  functional: boolean;
  necessary: boolean;
}

const PrivacyConsentBanner = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [preferences, setPreferences] = useState<ConsentPreferences>({
    analytics: false,
    marketing: false,
    functional: false,
    necessary: true, // Always required
  });

  const consentCategories: ConsentCategory[] = [
    {
      id: 'necessary',
      label: 'Necessary (Required)',
      description: 'Essential cookies for the website to function properly. These cannot be disabled.',
      required: true
    },
    {
      id: 'functional',
      label: 'Functional',
      description: 'Cookies that enable personalized features and remember your preferences.'
    },
    {
      id: 'analytics',
      label: 'Analytics',
      description: 'Cookies that help us understand how you interact with our website to improve performance.'
    },
    {
      id: 'marketing',
      label: 'Marketing',
      description: 'Cookies used to deliver advertisements relevant to you and your interests.'
    }
  ];

  const { userId } = useAuth();

  useEffect(() => {
    const fetchConsent = async () => {
      try {
        // Try to get consent from database first if user is logged in
        if (userId) {
          const response = await axios.get('/api/user/consent');
          const dbConsent = response.data;
          if (dbConsent) {
            setPreferences(dbConsent);
            return;
          }
        }

        // Fallback to local storage if no database consent or user not logged in
        const storedConsent = localStorage.getItem('privacyConsent');
        if (storedConsent) {
          try {
            const savedPreferences = JSON.parse(storedConsent);
            setPreferences({
              ...preferences,
              ...savedPreferences
            });
          } catch (e) {
            setShowBanner(true);
          }
        } else {
          setShowBanner(true);
        }
      } catch (error) {
        console.error('Error fetching consent:', error);
        setShowBanner(true);
      }
    };

    // Show after a short delay to avoid layout shifts during page load
    const timer = setTimeout(() => {
      fetchConsent();
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [userId]);

  const handlePreferenceChange = (category: keyof ConsentPreferences) => {
    if (category === 'necessary') return; // Cannot change necessary cookies
    setPreferences(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  const handleAcceptAll = () => {
    const allConsent: ConsentPreferences = {
      analytics: true,
      marketing: true,
      functional: true,
      necessary: true
    };
    setPreferences(allConsent);
    saveConsent(allConsent);
  };
  
  const handleRejectAll = () => {
    const minimalConsent: ConsentPreferences = {
      analytics: false,
      marketing: false,
      functional: false,
      necessary: true
    };
    setPreferences(minimalConsent);
    saveConsent(minimalConsent);
  };

  const handleSavePreferences = () => {
    saveConsent(preferences);
  };

  const saveConsent = async (consentPreferences: ConsentPreferences) => {
    try {
      // Save to local storage
      localStorage.setItem('privacyConsent', JSON.stringify(consentPreferences));

      // Save to database if user is logged in
      if (userId) {
        await axios.post('/api/user/consent', consentPreferences);
      }

      setShowBanner(false);
      toast.success('Privacy preferences saved', {
        description: 'Your cookie settings have been updated',
        duration: 3000
      });

      // Here you would typically trigger any necessary analytics or tracking updates
      // based on the user's preferences
    } catch (error) {
      console.error('Error saving consent:', error);
      toast.error('Failed to save preferences', {
        description: 'Please try again later',
        duration: 3000
      });
    }
  };

  if (!showBanner) return null;

  return (
    <TooltipProvider>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 shadow-lg border-t border-gray-200 dark:border-gray-700 z-50"
      >
        <div className="max-w-7xl mx-auto p-4">
          <div className="flex flex-col space-y-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold">Privacy Preferences</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 max-w-3xl">
                  We use cookies and similar technologies to personalize content, analyze traffic, and provide a better experience.
                </p>
              </div>
              
              <div className="flex items-center gap-3 mt-2 md:mt-0">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowDetails(!showDetails)}
                  className="text-sm flex items-center gap-1"
                >
                  {showDetails ? 'Hide Details' : 'Customize'} 
                  {showDetails ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRejectAll}
                  className="text-sm"
                >
                  Reject All
                </Button>
                
                <Button
                  variant="default"
                  size="sm"
                  onClick={handleAcceptAll}
                  className="text-sm"
                >
                  Accept All
                </Button>
              </div>
            </div>

            <AnimatePresence>
              {showDetails && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="border-t pt-4 mt-2">
                    <div className="space-y-4">
                      {consentCategories.map((category) => (
                        <div key={category.id} className="flex items-center justify-between bg-gray-50 dark:bg-gray-900 p-3 rounded-lg">
                          <div className="flex-grow">
                            <div className="flex items-center">
                              <span className="text-sm font-medium">{category.label}</span>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Info className="h-4 w-4 ml-1 text-gray-400 cursor-help" />
                                </TooltipTrigger>
                                <TooltipContent className="max-w-xs">
                                  <p>{category.description}</p>
                                </TooltipContent>
                              </Tooltip>
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 max-w-md">
                              {category.description}
                            </p>
                          </div>
                          
                          <Switch
                            checked={preferences[category.id]}
                            disabled={category.required}
                            onCheckedChange={() => handlePreferenceChange(category.id)}
                            className="ml-4"
                          />
                        </div>
                      ))}
                    </div>
                    
                    <div className="flex justify-end mt-4">
                      <Button 
                        onClick={handleSavePreferences}
                        className="text-sm"
                      >
                        Save Preferences
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            
            <div className="text-xs text-gray-500 dark:text-gray-400 text-center pt-2 border-t">
              You can change your preferences anytime in our{' '}
              <a href="/privacy-policy" className="underline hover:text-gray-800 dark:hover:text-gray-200">
                Privacy Policy
              </a>
            </div>
          </div>
        </div>
      </motion.div>
    </TooltipProvider>
  );
};

export default PrivacyConsentBanner;