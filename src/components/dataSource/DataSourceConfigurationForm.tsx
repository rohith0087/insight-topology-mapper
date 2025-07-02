
import React, { useState } from 'react';
import { DataSourceFormFields } from './DataSourceFormFields';
import { SecureCredentialInput } from './SecureCredentialInput';
import { TestConnectionComponent } from './TestConnectionComponent';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Separator } from '../ui/separator';
import { DataSourceConfig } from '../../types/dataSourceTypes';

interface DataSourceConfigurationFormProps {
  formData: DataSourceConfig;
  onFormDataChange: (data: DataSourceConfig) => void;
  onSave: () => void;
  onCancel: () => void;
  isEditing?: boolean;
}

const getCredentialFields = (sourceType: string) => {
  switch (sourceType) {
    case 'aws':
      return [
        { key: 'access_key_id', label: 'Access Key ID', type: 'text' as const, required: true },
        { key: 'secret_access_key', label: 'Secret Access Key', type: 'password' as const, required: true }
      ];
    case 'azure':
      return [
        { key: 'client_id', label: 'Client ID', type: 'text' as const, required: true },
        { key: 'client_secret', label: 'Client Secret', type: 'password' as const, required: true },
        { key: 'tenant_id', label: 'Tenant ID', type: 'text' as const, required: true }
      ];
    case 'splunk':
      return [
        { key: 'username', label: 'Username', type: 'text' as const, required: true },
        { key: 'password', label: 'Password', type: 'password' as const, required: true }
      ];
    case 'sentinelone':
      return [
        { key: 'api_token', label: 'API Token', type: 'password' as const, required: true }
      ];
    case 'qradar':
      return [
        { key: 'username', label: 'Username', type: 'text' as const, required: false },
        { key: 'password', label: 'Password', type: 'password' as const, required: false },
        { key: 'auth_token', label: 'Auth Token', type: 'password' as const, required: false }
      ];
    case 'datadog':
      return [
        { key: 'api_key', label: 'API Key', type: 'password' as const, required: true },
        { key: 'app_key', label: 'Application Key', type: 'password' as const, required: true }
      ];
    case 'microsoft-sentinel':
      return [
        { key: 'client_id', label: 'Client ID', type: 'text' as const, required: true },
        { key: 'client_secret', label: 'Client Secret', type: 'password' as const, required: true },
        { key: 'tenant_id', label: 'Tenant ID', type: 'text' as const, required: true }
      ];
    default:
      return [];
  }
};

const DataSourceConfigurationForm: React.FC<DataSourceConfigurationFormProps> = ({
  formData,
  onFormDataChange,
  onSave,
  onCancel,
  isEditing = false
}) => {
  const [credentialId, setCredentialId] = useState<string | undefined>(formData.credentialId);

  const credentialFields = getCredentialFields(formData.type);
  const needsCredentials = credentialFields.length > 0;

  const handleCredentialStored = (newCredentialId: string) => {
    setCredentialId(newCredentialId);
    onFormDataChange({
      ...formData,
      credentialId: newCredentialId
    });
  };

  const handleSave = () => {
    if (needsCredentials && !credentialId) {
      alert('Please configure credentials before saving');
      return;
    }
    onSave();
  };

  return (
    <div className="space-y-6">
      <DataSourceFormFields 
        formData={formData} 
        onFormDataChange={onFormDataChange} 
      />

      <Separator />

      {/* Configuration fields (non-sensitive) */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Configuration</h3>
        
        {formData.type === 'aws' && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="regions">Regions</Label>
              <Input
                id="regions"
                placeholder="us-east-1,us-west-2"
                value={formData.config.regions || ''}
                onChange={(e) => onFormDataChange({
                  ...formData,
                  config: { ...formData.config, regions: e.target.value }
                })}
              />
            </div>
            <div>
              <Label htmlFor="services">Services</Label>
              <Input
                id="services"
                placeholder="EC2,RDS,VPC"
                value={formData.config.services || ''}
                onChange={(e) => onFormDataChange({
                  ...formData,
                  config: { ...formData.config, services: e.target.value }
                })}
              />
            </div>
          </div>
        )}

        {formData.type === 'nmap' && (
          <div>
            <Label htmlFor="target_ranges">Target IP Ranges</Label>
            <Input
              id="target_ranges"
              placeholder="192.168.1.0/24,10.0.0.0/8"
              value={formData.config.target_ranges || ''}
              onChange={(e) => onFormDataChange({
                ...formData,
                config: { ...formData.config, target_ranges: e.target.value }
              })}
            />
          </div>
        )}

        {formData.type === 'splunk' && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="endpoint">Splunk Endpoint</Label>
              <Input
                id="endpoint"
                placeholder="https://splunk.company.com:8089"
                value={formData.config.endpoint || ''}
                onChange={(e) => onFormDataChange({
                  ...formData,
                  config: { ...formData.config, endpoint: e.target.value }
                })}
              />
            </div>
            <div>
              <Label htmlFor="index">Index</Label>
              <Input
                id="index"
                placeholder="main"
                value={formData.config.index || ''}
                onChange={(e) => onFormDataChange({
                  ...formData,
                  config: { ...formData.config, index: e.target.value }
                })}
              />
            </div>
          </div>
        )}
      </div>

      {needsCredentials && (
        <>
          <Separator />
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Security Credentials</h3>
            <SecureCredentialInput
              credentialName={`${formData.name}-credentials`}
              credentialType={formData.type === 'qradar' ? 'username_password' : 'api_key'}
              fields={credentialFields}
              existingCredentialId={credentialId}
              onCredentialStored={handleCredentialStored}
            />
          </div>
        </>
      )}

      <Separator />

      <TestConnectionComponent 
        sourceType={formData.type}
        config={formData.config}
        credentialId={credentialId}
      />

      <div className="flex justify-end space-x-2">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={handleSave}>
          {isEditing ? 'Update Data Source' : 'Create Data Source'}
        </Button>
      </div>
    </div>
  );
};

export default DataSourceConfigurationForm;
