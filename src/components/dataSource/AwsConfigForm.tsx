
import React from 'react';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { ConfigFormProps } from '../../types/dataSourceTypes';

const AwsConfigForm: React.FC<ConfigFormProps> = ({ config, onChange }) => {
  return (
    <div className="grid gap-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="access_key" className="text-slate-300">Access Key ID *</Label>
          <Input
            id="access_key"
            type="password"
            value={config.access_key_id || ''}
            onChange={(e) => onChange({ ...config, access_key_id: e.target.value })}
            className="bg-slate-900 border-slate-600 text-white placeholder-slate-400 focus:border-cyan-500 focus:ring-cyan-500"
          />
        </div>
        <div>
          <Label htmlFor="secret_key" className="text-slate-300">Secret Access Key *</Label>
          <Input
            id="secret_key"
            type="password"
            value={config.secret_access_key || ''}
            onChange={(e) => onChange({ ...config, secret_access_key: e.target.value })}
            className="bg-slate-900 border-slate-600 text-white placeholder-slate-400 focus:border-cyan-500 focus:ring-cyan-500"
          />
        </div>
      </div>
      <div>
        <Label htmlFor="regions" className="text-slate-300">AWS Regions</Label>
        <Input
          id="regions"
          placeholder="us-east-1, us-west-2, eu-west-1"
          value={config.regions || ''}
          onChange={(e) => onChange({ ...config, regions: e.target.value })}
          className="bg-slate-900 border-slate-600 text-white placeholder-slate-400 focus:border-cyan-500 focus:ring-cyan-500"
        />
      </div>
      <div>
        <Label htmlFor="services" className="text-slate-300">Services to Monitor</Label>
        <Textarea
          id="services"
          placeholder="ec2, vpc, rds, lambda, s3"
          value={config.services || ''}
          onChange={(e) => onChange({ ...config, services: e.target.value })}
          className="bg-slate-900 border-slate-600 text-white placeholder-slate-400 focus:border-cyan-500 focus:ring-cyan-500"
        />
      </div>
    </div>
  );
};

export default AwsConfigForm;
