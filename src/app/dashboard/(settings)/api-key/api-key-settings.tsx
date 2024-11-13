"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckIcon, ClipboardIcon, EyeIcon, EyeOffIcon } from "lucide-react";
import { useState } from "react";

interface ApiKeySettingsProps {
  apiKey: string;
}

export const ApiKeySettings = ({ apiKey }: ApiKeySettingsProps) => {
  const [copySuccess, setCopySuccess] = useState(false);
  const [isApiKeyVisible, setIsApiKeyVisible] = useState(false);

  const copyApiKey = () => {
    navigator.clipboard.writeText(apiKey);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const toggleApiKeyVisibility = () => {
    setIsApiKeyVisible((prev) => !prev);
  };

  return (
    <Card className="max-w-xl w-full">
      <div>
        <Label>Your API Key</Label>
        <div className="mt-1 relative">
          <Input
            type={isApiKeyVisible ? "text" : "password"}
            value={apiKey}
            readOnly
            aria-label="API Key"
          />
          <div className="absolute space-x-0.5 inset-y-0 right-0 flex items-center">
            <Button
              variant="ghost"
              onClick={toggleApiKeyVisibility}
              className="p-1 w-10 focus:outline-none"
              aria-label={isApiKeyVisible ? "Hide API Key" : "Show API Key"}
            >
              {isApiKeyVisible ? (
                <EyeOffIcon className="size-4 text-brand-900" />
              ) : (
                <EyeIcon className="size-4 text-brand-900" />
              )}
            </Button>

            <Button
              variant="ghost"
              onClick={copyApiKey}
              className="p-1 w-10 focus:outline-none focus:ring-2 focus:ring-brand-500"
              aria-label="Copy API Key"
            >
              {copySuccess ? (
                <CheckIcon className="size-4 text-brand-900" />
              ) : (
                <ClipboardIcon className="size-4 text-brand-900" />
              )}
            </Button>
          </div>
        </div>

        <p className="mt-2 text-sm/6 text-gray-600">
          Keep your key secret and do not share it with others.
        </p>
        <div
          aria-live="polite"
          aria-atomic="true"
          className="sr-only"
        >
          {copySuccess && "API key copied to clipboard."}
        </div>
      </div>
    </Card>
  );
};
