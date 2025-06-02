
import React from 'react';
import NmapConfigForm from './NmapConfigForm';
import AwsConfigForm from './AwsConfigForm';
import SplunkConfigForm from './SplunkConfigForm';
import AzureConfigForm from './AzureConfigForm';
import SnmpConfigForm from './SnmpConfigForm';
import CustomApiConfigForm from './CustomApiConfigForm';
import SentinelOneConfigForm from './SentinelOneConfigForm';
import QRadarConfigForm from './QRadarConfigForm';
import DataDogConfigForm from './DataDogConfigForm';
import MicrosoftSentinelConfigForm from './MicrosoftSentinelConfigForm';
import { ConfigFormProps } from '../../types/dataSourceTypes';

interface DataSourceConfigFormProps extends ConfigFormProps {
  type: string;
}

const DataSourceConfigForm: React.FC<DataSourceConfigFormProps> = ({ type, config, onChange }) => {
  switch (type) {
    case 'nmap':
      return <NmapConfigForm config={config} onChange={onChange} />;
    case 'aws':
      return <AwsConfigForm config={config} onChange={onChange} />;
    case 'splunk':
      return <SplunkConfigForm config={config} onChange={onChange} />;
    case 'azure':
      return <AzureConfigForm config={config} onChange={onChange} />;
    case 'snmp':
      return <SnmpConfigForm config={config} onChange={onChange} />;
    case 'sentinelone':
      return <SentinelOneConfigForm config={config} onChange={onChange} />;
    case 'qradar':
      return <QRadarConfigForm config={config} onChange={onChange} />;
    case 'datadog':
      return <DataDogConfigForm config={config} onChange={onChange} />;
    case 'microsoft-sentinel':
      return <MicrosoftSentinelConfigForm config={config} onChange={onChange} />;
    default:
      return <CustomApiConfigForm config={config} onChange={onChange} />;
  }
};

export default DataSourceConfigForm;
