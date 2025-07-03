
import React from 'react';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Alert, AlertDescription } from '../ui/alert';
import { Info } from 'lucide-react';
import { ConfigFormProps } from '../../types/dataSourceTypes';

const AwsConfigForm: React.FC<ConfigFormProps> = ({ config, onChange }) => {
  const defaultRegions = 'us-east-1,us-west-2,eu-west-1';
  const defaultServices = 'ec2,rds,vpc';

  return (
    <div className="space-y-4">
      <Alert className="border-blue-200 bg-blue-50">
        <Info className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-800">
          <strong>Real AWS Integration:</strong> This will make actual AWS API calls to discover your infrastructure. 
          Ensure your AWS credentials have the necessary permissions (EC2:Describe*, RDS:Describe*, etc.).
        </AlertDescription>
      </Alert>

      <div className="grid gap-4">
        <div>
          <Label htmlFor="regions" className="text-slate-300">AWS Regions *</Label>
          <Input
            id="regions"
            placeholder={defaultRegions}
            value={config.regions || ''}
            onChange={(e) => onChange({ ...config, regions: e.target.value })}
            className="bg-slate-900 border-slate-600 text-white placeholder-slate-400 focus:border-cyan-500 focus:ring-cyan-500"
          />
          <p className="text-xs text-slate-400 mt-1">
            Comma-separated list of AWS regions to scan (e.g., us-east-1,us-west-2,eu-west-1)
          </p>
        </div>

        <div>
          <Label htmlFor="services" className="text-slate-300">Services to Discover *</Label>
          <Textarea
            id="services"
            placeholder={defaultServices}
            value={config.services || ''}
            onChange={(e) => onChange({ ...config, services: e.target.value })}
            className="bg-slate-900 border-slate-600 text-white placeholder-slate-400 focus:border-cyan-500 focus:ring-cyan-500"
            rows={3}
          />
          <p className="text-xs text-slate-400 mt-1">
            Comma-separated list of AWS services (ec2, rds, vpc). Supported services:
            <br />
            • <strong>ec2</strong> - EC2 instances, security groups, and related resources
            <br />
            • <strong>rds</strong> - RDS database instances and clusters
            <br />
            • <strong>vpc</strong> - VPCs, subnets, and networking resources
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="rate_limit" className="text-slate-300">API Rate Limit (req/sec)</Label>
            <Input
              id="rate_limit"
              type="number"
              placeholder="10"
              value={config.rate_limit || ''}
              onChange={(e) => onChange({ ...config, rate_limit: parseInt(e.target.value) || 10 })}
              className="bg-slate-900 border-slate-600 text-white placeholder-slate-400 focus:border-cyan-500 focus:ring-cyan-500"
              min="1"
              max="100"
            />
            <p className="text-xs text-slate-400 mt-1">
              Requests per second to AWS APIs (default: 10)
            </p>
          </div>

          <div>
            <Label htmlFor="retry_attempts" className="text-slate-300">Retry Attempts</Label>
            <Input
              id="retry_attempts"
              type="number"
              placeholder="3"
              value={config.retry_attempts || ''}
              onChange={(e) => onChange({ ...config, retry_attempts: parseInt(e.target.value) || 3 })}
              className="bg-slate-900 border-slate-600 text-white placeholder-slate-400 focus:border-cyan-500 focus:ring-cyan-500"
              min="1"
              max="10"
            />
            <p className="text-xs text-slate-400 mt-1">
              Number of retry attempts for failed API calls (default: 3)
            </p>
          </div>
        </div>

        <div>
          <Label htmlFor="include_tags" className="text-slate-300">Include Resource Tags</Label>
          <div className="flex items-center space-x-2 mt-2">
            <input
              type="checkbox"
              id="include_tags"
              checked={config.include_tags !== false}
              onChange={(e) => onChange({ ...config, include_tags: e.target.checked })}
              className="rounded border-slate-600 bg-slate-900 text-cyan-500 focus:ring-cyan-500 focus:ring-offset-slate-800"
            />
            <Label htmlFor="include_tags" className="text-slate-300 font-normal">
              Discover and include AWS resource tags in metadata
            </Label>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Resource tags will be included in the discovered node metadata for better organization and filtering.
          </p>
        </div>

        <Alert className="border-yellow-200 bg-yellow-50">
          <Info className="h-4 w-4 text-yellow-600" />
          <AlertDescription className="text-yellow-800">
            <strong>Required AWS Permissions:</strong>
            <br />
            • EC2: DescribeInstances, DescribeVpcs, DescribeSubnets, DescribeSecurityGroups, DescribeRegions
            <br />
            • RDS: DescribeDBInstances, DescribeDBClusters
            <br />
            • General: ListRegions (for region validation)
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
};

export default AwsConfigForm;
