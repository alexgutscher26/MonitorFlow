'use client';

import { useState, useEffect, SetStateAction } from 'react';
import { Button } from './ui/button';
import { toast } from 'sonner';
import { Switch } from './ui/switch';
import { AlertCircle } from 'lucide-react';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from './ui/dialog';
import { Textarea } from './ui/textarea';
import { Checkbox } from './ui/checkbox';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';

interface DataExportRequest {
  email: string;
  dataTypes: string[];
}

interface DataDeletionRequest {
  email: string;
  reason?: string;
  confirmDelete: boolean;
}

interface PrivacyPreference {
  id: string;
  label: string;
  description: string;
  value: boolean;
}

const DataPrivacyManager = () => {
  const [loading, setLoading] = useState<{[key: string]: boolean}>({ 
    export: false, 
    delete: false, 
    preferences: false 
  });
  const [email, setEmail] = useState('');
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [deleteReason, setDeleteReason] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [exportDataTypes, setExportDataTypes] = useState<{[key: string]: boolean}>({
    profile: true,
    preferences: true,
    usage: false,
    monitoring: false
  });
  
  const [preferences, setPreferences] = useState<PrivacyPreference[]>([
    { 
      id: 'marketing', 
      label: 'Marketing Communications', 
      description: 'Receive updates about new features and promotional offers',
      value: false 
    },
    { 
      id: 'analytics', 
      label: 'Analytics & Performance', 
      description: 'Allow us to collect usage data to improve our services',
      value: true 
    },
    { 
      id: 'thirdParty', 
      label: 'Third-Party Sharing', 
      description: 'Allow sharing your data with trusted partners',
      value: false 
    },
    { 
      id: 'cookies', 
      label: 'Essential Cookies Only', 
      description: 'Limit cookie usage to essential functionality only',
      value: false 
    }
  ]);

  useEffect(() => {
    // Simulate fetching user email from session
    setEmail('user@example.com');
    
    // Simulate fetching user preferences
    // In a real app, you would fetch these from your API
  }, []);

  const handleDataExport = async () => {
    setLoading({...loading, export: true});
    
    try {
      const selectedTypes = Object.entries(exportDataTypes)
        .filter(([_, selected]) => selected)
        .map(([type]) => type);
      
      if (selectedTypes.length === 0) {
        toast.error('Please select at least one data type to export');
        return;
      }
      
      // Here you would implement the actual data export logic
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success('Data export request received. You will receive an email with your data shortly.');
      setShowExportDialog(false);
    } catch (error) {
      toast.error('Failed to process data export request. Please try again.');
    } finally {
      setLoading({...loading, export: false});
    }
  };

  const handleDataDeletion = async () => {
    if (!confirmDelete) {
      toast.error('Please confirm that you understand this action cannot be undone');
      return;
    }
    
    setLoading({...loading, delete: true});
    
    try {
      const request: DataDeletionRequest = { 
        email, 
        reason: deleteReason,
        confirmDelete 
      };
      
      // Here you would implement the actual data deletion logic
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success('Data deletion request received. We will process your request within 30 days.');
      setShowDeleteDialog(false);
      setDeleteReason('');
      setConfirmDelete(false);
    } catch (error) {
      toast.error('Failed to process data deletion request. Please try again.');
    } finally {
      setLoading({...loading, delete: false});
    }
  };

  const updatePreference = (id: string, value: boolean) => {
    const updatedPreferences = preferences.map(pref => 
      pref.id === id ? {...pref, value} : pref
    );
    
    setPreferences(updatedPreferences);
    
    // Save the preference immediately
    handlePreferencesUpdate({ [id]: value });
  };

  const handlePreferencesUpdate = async (preference: Record<string, boolean>) => {
    setLoading({...loading, preferences: true});
    
    try {
      // Here you would implement the actual preferences update logic
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const prefName = Object.keys(preference)[0];
      const prefValue = preference[prefName];
      const prefLabel = preferences.find(p => p.id === prefName)?.label || prefName;
      
      toast.success(`${prefLabel} preference ${prefValue ? 'enabled' : 'disabled'}`);
    } catch (error) {
      toast.error('Failed to update privacy preferences. Please try again.');
      
      // Revert the UI change on error
      if (Object.keys(preference).length === 1) {
        const key = Object.keys(preference)[0];
        setPreferences(preferences.map(pref => 
          pref.id === key ? {...pref, value: !preference[key]} : pref
        ));
      }
    } finally {
      setLoading({...loading, preferences: false});
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-4">Data Privacy Management</h2>
        <p className="text-gray-600 dark:text-gray-300">
          Manage your data privacy preferences and exercise your data rights under GDPR and CCPA.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Export Your Data</CardTitle>
            <CardDescription>
              Request a copy of your personal data. We will email you a downloadable archive.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Dialog open={showExportDialog} onOpenChange={setShowExportDialog}>
              <DialogTrigger asChild>
                <Button variant="outline">Request Data Export</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Export Your Data</DialogTitle>
                  <DialogDescription>
                    Select which types of data you would like to export. The data will be sent to {email}.
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4 py-4">
                  {Object.entries(exportDataTypes).map(([type, checked]) => (
                    <div key={type} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`export-${type}`} 
                        checked={checked}
                        onCheckedChange={(checked: any) => 
                          setExportDataTypes({...exportDataTypes, [type]: !!checked})
                        }
                      />
                      <Label htmlFor={`export-${type}`} className="capitalize">
                        {type} Data
                      </Label>
                    </div>
                  ))}
                </div>
                
                <DialogFooter>
                  <Button 
                    onClick={handleDataExport} 
                    disabled={loading.export}
                  >
                    {loading.export ? 'Processing...' : 'Confirm Export'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Delete Your Data</CardTitle>
            <CardDescription>
              Request deletion of your personal data. This action cannot be undone.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
              <DialogTrigger asChild>
                <Button variant="destructive">Request Data Deletion</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Delete Your Data</DialogTitle>
                  <DialogDescription>
                    This will permanently remove all your personal data from our systems.
                    This action cannot be undone.
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4 py-4">
                  <div>
                    <Label htmlFor="delete-reason">Reason for deletion (optional)</Label>
                    <Textarea 
                      id="delete-reason"
                      placeholder="Please let us know why you're deleting your data"
                      value={deleteReason}
                      onChange={(e: { target: { value: SetStateAction<string>; }; }) => setDeleteReason(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="confirm-delete" 
                      checked={confirmDelete}
                      onCheckedChange={(checked: any) => setConfirmDelete(!!checked)}
                    />
                    <Label htmlFor="confirm-delete" className="text-sm">
                      I understand that this action cannot be undone and all my data will be permanently deleted
                    </Label>
                  </div>
                </div>
                
                <DialogFooter>
                  <Button 
                    onClick={handleDataDeletion} 
                    variant="destructive"
                    disabled={loading.delete}
                  >
                    {loading.delete ? 'Processing...' : 'Confirm Deletion'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardFooter>
        </Card>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Privacy Preferences</CardTitle>
          <CardDescription>
            Update your privacy preferences and consent settings.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {preferences.map((preference) => (
              <div key={preference.id} className="flex items-center justify-between">
                <div>
                  <Label className="text-base font-medium">{preference.label}</Label>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {preference.description}
                  </p>
                </div>
                <Switch
                  checked={preference.value}
                  onCheckedChange={(checked: boolean) => updatePreference(preference.id, checked)}
                  disabled={loading.preferences}
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex items-start space-x-2 text-sm text-gray-500 dark:text-gray-400">
        <AlertCircle className="h-5 w-5 flex-shrink-0" />
        <p>
          For more information about how we handle your data, please read our{' '}
          <a href="/privacy-policy" className="text-blue-600 hover:underline dark:text-blue-400">
            Privacy Policy
          </a>.
        </p>
      </div>
    </div>
  );
};

export default DataPrivacyManager;