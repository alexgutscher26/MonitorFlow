"use client";

import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Integration } from "./integration-marketplace";
import { useState, useRef, useEffect, KeyboardEvent } from "react";
import Image from "next/image";
import { useToast } from "./ui/use-toast";
import { Loader2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "./ui/alert";

interface ValidationRule {
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  message: string;
}

interface ConfigField {
  key: string;
  label: string;
  type: "text" | "password" | "url" | "select";
  placeholder?: string;
  options?: { label: string; value: string }[];
  required?: boolean;
  description?: string;
  validation?: ValidationRule;
}

const INTEGRATION_CONFIGS: Record<string, ConfigField[]> = {
  // Automation Tools
  zapier: [
    {
      key: "apiKey",
      label: "API Key",
      type: "password",
      placeholder: "Enter your Zapier API Key",
      required: true,
      description: "Found in your Zapier account settings",
      validation: {
        pattern: /^zap_[a-zA-Z0-9]{32}$/,
        message: "Zapier API keys should start with 'zap_' followed by 32 characters"
      }
    },
    {
      key: "webhookUrl",
      label: "Webhook URL",
      type: "url",
      placeholder: "https://hooks.zapier.com/...",
      required: true,
      description: "The webhook URL from your Zapier trigger",
      validation: {
        pattern: /^https:\/\/hooks\.zapier\.com\/.+/,
        message: "Please enter a valid Zapier webhook URL"
      }
    }
  ],
  make: [
    {
      key: "apiKey",
      label: "API Key",
      type: "password",
      required: true,
      description: "Found in your Make.com account settings",
      validation: {
        minLength: 64,
        maxLength: 64,
        message: "Make.com API keys should be exactly 64 characters long"
      }
    },
    {
      key: "organizationId",
      label: "Organization ID",
      type: "text",
      required: true,
      description: "Your Make.com organization identifier"
    }
  ],
  n8n: [
    {
      key: "webhookUrl",
      label: "Webhook URL",
      type: "url",
      required: true,
      description: "The webhook URL from your n8n workflow"
    }
  ],

  // Notification Systems
  slack: [
    {
      key: "webhookUrl",
      label: "Webhook URL",
      type: "url",
      placeholder: "https://hooks.slack.com/...",
      required: true,
      description: "Create this in your Slack workspace settings",
      validation: {
        pattern: /^https:\/\/hooks\.slack\.com\/services\/T[A-Z0-9]+\/B[A-Z0-9]+\/[a-zA-Z0-9]+$/,
        message: "Please enter a valid Slack webhook URL"
      }
    },
    {
      key: "channel",
      label: "Default Channel",
      type: "text",
      placeholder: "#alerts",
      required: true,
      description: "The channel where alerts will be sent"
    }
  ],
  discord: [
    {
      key: "webhookUrl",
      label: "Webhook URL",
      type: "url",
      required: true,
      description: "Create this in your Discord server settings",
      validation: {
        pattern: /^https:\/\/discord\.com\/api\/webhooks\/\d+\/.+$/,
        message: "Please enter a valid Discord webhook URL"
      }
    },
    {
      key: "mentionRole",
      label: "Mention Role",
      type: "text",
      placeholder: "@oncall",
      description: "Optional role to mention in alerts"
    }
  ],
  teams: [
    {
      key: "webhookUrl",
      label: "Webhook URL",
      type: "url",
      required: true,
      description: "Create this in your Microsoft Teams channel"
    }
  ],

  // Monitoring Tools
  datadog: [
    {
      key: "apiKey",
      label: "API Key",
      type: "password",
      required: true,
      description: "Found in your Datadog account settings",
      validation: {
        pattern: /^[a-f0-9]{32}$/,
        message: "Datadog API keys should be 32 characters long and contain only hexadecimal characters"
      }
    },
    {
      key: "applicationKey",
      label: "Application Key",
      type: "password",
      required: true,
      description: "Found in your Datadog account settings",
      validation: {
        pattern: /^[a-f0-9]{40}$/,
        message: "Datadog application keys should be 40 characters long and contain only hexadecimal characters"
      }
    },
    {
      key: "site",
      label: "Datadog Site",
      type: "select",
      options: [
        { label: "US", value: "datadoghq.com" },
        { label: "EU", value: "datadoghq.eu" },
      ],
      required: true
    }
  ],
  grafana: [
    {
      key: "apiUrl",
      label: "Grafana URL",
      type: "url",
      required: true,
      description: "Your Grafana instance URL"
    },
    {
      key: "apiToken",
      label: "API Token",
      type: "password",
      required: true,
      description: "Create this in your Grafana settings",
      validation: {
        pattern: /^glc_[A-Za-z0-9+/=]{32,}$/,
        message: "Grafana API tokens should start with 'glc_' followed by at least 32 characters"
      }
    }
  ],
  prometheus: [
    {
      key: "url",
      label: "Prometheus URL",
      type: "url",
      required: true,
      description: "Your Prometheus instance URL"
    },
    {
      key: "basicAuth",
      label: "Basic Auth Token",
      type: "password",
      description: "Optional: Basic auth credentials if required"
    }
  ],

  // Alerting Systems
  pagerduty: [
    {
      key: "apiToken",
      label: "API Token",
      type: "password",
      required: true,
      description: "Found in your PagerDuty account settings"
    },
    {
      key: "serviceId",
      label: "Service ID",
      type: "text",
      required: true,
      description: "The ID of the PagerDuty service to create incidents in"
    }
  ],
  opsgenie: [
    {
      key: "apiKey",
      label: "API Key",
      type: "password",
      required: true,
      description: "Found in your Opsgenie settings"
    },
    {
      key: "team",
      label: "Team Name",
      type: "text",
      required: true,
      description: "The Opsgenie team to route alerts to"
    }
  ],
  victorops: [
    {
      key: "apiKey",
      label: "API Key",
      type: "password",
      required: true,
      description: "Found in your VictorOps settings"
    },
    {
      key: "routingKey",
      label: "Routing Key",
      type: "text",
      required: true,
      description: "The routing key for your VictorOps team"
    }
  ],

  // Development Tools
  github: [
    {
      key: "accessToken",
      label: "Access Token",
      type: "password",
      required: true,
      description: "Create a GitHub Personal Access Token",
      validation: {
        pattern: /^ghp_[a-zA-Z0-9]{36}$/,
        message: "GitHub personal access tokens should start with 'ghp_' followed by 36 characters"
      }
    },
    {
      key: "repository",
      label: "Repository",
      type: "text",
      placeholder: "owner/repo",
      required: true,
      description: "The repository to create issues in"
    },
    {
      key: "labels",
      label: "Issue Labels",
      type: "text",
      placeholder: "incident, outage",
      description: "Comma-separated list of labels to add"
    }
  ],
  gitlab: [
    {
      key: "accessToken",
      label: "Access Token",
      type: "password",
      required: true,
      description: "Create a GitLab Personal Access Token",
      validation: {
        pattern: /^glpat-[A-Za-z0-9_-]{20}$/,
        message: "GitLab personal access tokens should start with 'glpat-' followed by 20 characters"
      }
    },
    {
      key: "projectId",
      label: "Project ID",
      type: "text",
      required: true,
      description: "The ID of your GitLab project"
    }
  ],
  jira: [
    {
      key: "domain",
      label: "Jira Domain",
      type: "url",
      placeholder: "https://your-domain.atlassian.net",
      required: true
    },
    {
      key: "email",
      label: "Email",
      type: "text",
      required: true,
      description: "Your Jira account email"
    },
    {
      key: "apiToken",
      label: "API Token",
      type: "password",
      required: true,
      description: "Create this in your Atlassian account settings",
      validation: {
        pattern: /^[A-Za-z0-9]{24}$/,
        message: "Jira API tokens should be 24 characters long"
      }
    },
    {
      key: "projectKey",
      label: "Project Key",
      type: "text",
      required: true,
      description: "The key of the Jira project"
    }
  ],

  // Analytics
  "google-analytics": [
    {
      key: "measurementId",
      label: "Measurement ID",
      type: "text",
      placeholder: "G-XXXXXXXXXX",
      required: true,
      description: "Found in your GA4 property settings",
      validation: {
        pattern: /^G-[A-Z0-9]{10}$/,
        message: "GA4 Measurement IDs should start with 'G-' followed by 10 characters"
      }
    },
    {
      key: "apiSecret",
      label: "API Secret",
      type: "password",
      required: true,
      description: "Create this in your GA4 property settings"
    }
  ],
  mixpanel: [
    {
      key: "projectToken",
      label: "Project Token",
      type: "password",
      required: true,
      description: "Found in your Mixpanel project settings",
      validation: {
        pattern: /^[a-f0-9]{32}$/,
        message: "Mixpanel project tokens should be 32 characters long and contain only hexadecimal characters"
      }
    },
    {
      key: "apiSecret",
      label: "API Secret",
      type: "password",
      required: true,
      description: "Found in your Mixpanel project settings"
    }
  ]
};

interface IntegrationConfigModalProps {
  integration: Integration | null;
  isOpen: boolean;
  onClose: () => void;
}

export function IntegrationConfigModal({ integration, isOpen, onClose }: IntegrationConfigModalProps) {
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [focusedFieldIndex, setFocusedFieldIndex] = useState(0);
  const { toast } = useToast();

  const formRef = useRef<HTMLFormElement>(null);
  const fieldRefs = useRef<(HTMLInputElement | HTMLSelectElement | null)[]>([]);
  const debounceTimerRef = useRef<NodeJS.Timeout>();

  // Focus management
  useEffect(() => {
    if (isOpen && integration) {
      setFocusedFieldIndex(0);
      setTimeout(() => {
        fieldRefs.current[0]?.focus();
      }, 100);
    }
    // Cleanup any pending debounce timers when modal closes
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [isOpen, integration]);

  if (!integration) return null;

  const configFields = INTEGRATION_CONFIGS[integration.id] || [];

  const focusField = (index: number) => {
    if (index >= 0 && index < configFields.length) {
      fieldRefs.current[index]?.focus();
      setFocusedFieldIndex(index);
    }
  };

  const handleFieldKeyDown = (e: KeyboardEvent<HTMLInputElement | HTMLSelectElement>, index: number) => {
    switch (e.key) {
      case "ArrowUp":
        e.preventDefault();
        focusField(index - 1);
        break;
      case "ArrowDown":
        e.preventDefault();
        focusField(index + 1);
        break;
      case "Escape":
        e.preventDefault();
        handleClose();
        break;
      case "Enter":
        if (e.ctrlKey || e.metaKey) {
          e.preventDefault();
          formRef.current?.requestSubmit();
        }
        break;
    }
  };

  const validateField = (field: ConfigField, value: string): string | null => {
    if (field.required && !value?.trim()) {
      return `${field.label} is required`;
    }

    if (field.validation && value) {
      const { minLength, maxLength, pattern, message } = field.validation;

      if (minLength && value.length < minLength) {
        return `${field.label} should be at least ${minLength} characters`;
      }

      if (maxLength && value.length > maxLength) {
        return `${field.label} should not exceed ${maxLength} characters`;
      }

      if (pattern && !pattern.test(value)) {
        return message;
      }
    }

    if (field.type === "url" && value) {
      try {
        new URL(value);
      } catch {
        return `Please enter a valid URL for ${field.label}`;
      }
    }

    return null;
  };

  const validateForm = () => {
    const errors: string[] = [];

    for (const field of configFields) {
      const value = formData[field.key] || "";
      const error = validateField(field, value);
      if (error) {
        errors.push(error);
      }
    }

    if (errors.length > 0) {
      setError(errors[0]);
      toast({
        title: "Validation Error",
        description: errors[0],
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleFieldChange = (field: ConfigField, value: string) => {
    setFormData(prev => ({ ...prev, [field.key]: value }));
    setError(null);

    // Clear any pending debounce timer
    useEffect(() => {
      const timerRef = debounceTimerRef.current;
      return () => {
        clearTimeout(timerRef);
      };
    });
    // Only validate without showing toast
    const error = validateField(field, value);
    if (error) {
      setError(error);
    }
  };

  const handleFieldBlur = (field: ConfigField) => {
    const value = formData[field.key] || "";
    const error = validateField(field, value);
    
    // Show toast only when field loses focus and has an error
    if (error) {
      toast({
        title: "Validation Error",
        description: error,
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call with random success/failure
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          Math.random() > 0.3 ? resolve(true) : reject(new Error("Connection failed"));
        }, 2000);
      });
      
      // TODO: Replace with actual API call to save configuration
      console.log("Submitting config:", formData);
      
      toast({
        title: "Integration Connected",
        description: `Successfully connected ${integration.name} to PingPanda.`,
        variant: "success",
      });
      
      setFormData({});
      onClose();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to connect the integration";
      setError(errorMessage);
      toast({
        title: "Connection Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({});
    setError(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent 
        className="sm:max-w-[500px]"
        onKeyDown={(e) => {
          if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
            e.preventDefault();
            formRef.current?.requestSubmit();
          }
        }}
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="relative w-6 h-6">
              <Image
                src={integration.icon}
                alt={`${integration.name} logo`}
                fill
                className="object-contain"
              />
            </div>
            Configure {integration.name}
          </DialogTitle>
          <DialogDescription>
            Fill in the required information to connect with {integration.name}
          </DialogDescription>
        </DialogHeader>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
          {configFields.map((field, index) => (
            <div key={field.key} className="space-y-2">
              <Label htmlFor={field.key}>
                {field.label}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </Label>
              {field.type === "select" ? (
                <select
                  id={field.key}
                  ref={(el) => {
                    fieldRefs.current[index] = el;
                  }}
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-brand-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                  value={formData[field.key] || ""}
                  onChange={(e) => handleFieldChange(field, e.target.value)}
                  onBlur={() => handleFieldBlur(field)}
                  onKeyDown={(e) => handleFieldKeyDown(e, index)}
                  required={field.required}
                  disabled={isSubmitting}
                  aria-invalid={error && field.required && !formData[field.key] ? "true" : undefined}
                  aria-describedby={field.description ? `${field.key}-description` : undefined}
                >
                  <option value="">Select an option</option>
                  {field.options?.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              ) : (
                <Input
                  id={field.key}
                  ref={(el) => {
                    fieldRefs.current[index] = el;
                  }}
                  type={field.type}
                  placeholder={field.placeholder}
                  value={formData[field.key] || ""}
                  onChange={(e) => handleFieldChange(field, e.target.value)}
                  onBlur={() => handleFieldBlur(field)}
                  onKeyDown={(e) => handleFieldKeyDown(e, index)}
                  required={field.required}
                  disabled={isSubmitting}
                  className={field.type === "password" ? "font-mono" : ""}
                  aria-invalid={error && field.required && !formData[field.key] ? "true" : undefined}
                  aria-describedby={field.description ? `${field.key}-description` : undefined}
                />
              )}
              {error && formData[field.key] && (
                <p className="text-sm text-red-500 mt-1">{error}</p>
              )}
              {field.description && (
                <p 
                  id={`${field.key}-description`}
                  className="text-sm text-zinc-500"
                >
                  {field.description}
                  {field.validation?.message && (
                    <span className="block mt-1 text-xs text-zinc-400">
                      Format: {field.validation.message}
                    </span>
                  )}
                </p>
              )}
            </div>
          ))}

          <DialogFooter>
            <div className="flex justify-between w-full items-center">
              <div className="text-sm text-zinc-500">
                <kbd className="px-2 py-1 text-xs rounded bg-zinc-100">↑/↓</kbd> to navigate
                {" • "}
                <kbd className="px-2 py-1 text-xs rounded bg-zinc-100">⌘/Ctrl + ↵</kbd> to submit
              </div>
              <div className="flex gap-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={handleClose}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="min-w-[120px]"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Connecting...
                    </span>
                  ) : (
                    "Save Configuration"
                  )}
                </Button>
              </div>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}