
import { CheckCircle, XCircle, Clock } from 'lucide-react';
import { Badge } from '../ui/badge';

export const getTypeIcon = (type: string) => {
  const iconImages = {
    aws: '/lovable-uploads/e1398d3d-578a-471e-bfde-4096d0238576.png',
    azure: '/lovable-uploads/c8dd797a-375c-47db-991f-ea4bdbf311f1.png',
    datadog: '/lovable-uploads/29d45e0c-b15e-4e77-89ae-28286dda410d.png',
    'microsoft-sentinel': '/lovable-uploads/09db2bdd-5525-47a7-aaa8-e30b98d6901d.png',
    qradar: '/lovable-uploads/88b0bf91-c943-4248-baf0-5e75ef46c244.png',
    sentinelone: '/lovable-uploads/fe727117-4df6-4009-85bb-536a2073baec.png',
    splunk: '/lovable-uploads/0b9997af-4433-4058-bd76-6a42290c5299.png'
  };

  if (iconImages[type]) {
    return <img src={iconImages[type]} alt={type} className="w-8 h-8 object-contain" />;
  }

  const icons = {
    nmap: '🌐',
    snmp: '📡',
    api: '🔌'
  };
  return <span className="text-2xl">{icons[type] || '⚙️'}</span>;
};

export const getStatusIcon = (status: string, enabled: boolean) => {
  if (!enabled) return <XCircle className="w-4 h-4 text-slate-400" />;
  
  switch (status) {
    case 'success':
      return <CheckCircle className="w-4 h-4 text-green-500" />;
    case 'running':
      return <Clock className="w-4 h-4 text-blue-500 animate-pulse" />;
    case 'failed':
      return <XCircle className="w-4 h-4 text-red-500" />;
    default:
      return <Clock className="w-4 h-4 text-yellow-500" />;
  }
};

export const getStatusBadge = (status: string, enabled: boolean) => {
  if (!enabled) {
    return <Badge variant="secondary" className="bg-slate-600">Disabled</Badge>;
  }
  
  switch (status) {
    case 'success':
      return <Badge className="bg-green-600 hover:bg-green-700">Connected</Badge>;
    case 'running':
      return <Badge className="bg-blue-600 hover:bg-blue-700">Running</Badge>;
    case 'failed':
      return <Badge variant="destructive">Failed</Badge>;
    default:
      return <Badge variant="outline" className="border-yellow-500 text-yellow-500">Pending</Badge>;
  }
};
