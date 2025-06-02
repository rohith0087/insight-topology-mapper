
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Database, Cloud, Server, Shield, ArrowRight, ExternalLink } from 'lucide-react';

interface OnboardingDataSourceProps {
  onNext: () => void;
}

const OnboardingDataSource: React.FC<OnboardingDataSourceProps> = ({ onNext }) => {
  const [selectedSource, setSelectedSource] = useState<string | null>(null);

  const dataSources = [
    {
      id: 'nmap',
      name: 'Network Mapper (Nmap)',
      description: 'Discover devices and services on your network',
      icon: <Server className="w-6 h-6 text-blue-400" />,
      difficulty: 'Easy',
      setupTime: '2 min',
      popular: true
    },
    {
      id: 'aws',
      name: 'Amazon Web Services',
      description: 'Import AWS infrastructure and resources',
      icon: <Cloud className="w-6 h-6 text-orange-400" />,
      difficulty: 'Medium',
      setupTime: '5 min',
      popular: true
    },
    {
      id: 'snmp',
      name: 'SNMP Monitoring',
      description: 'Monitor network devices via SNMP protocol',
      icon: <Database className="w-6 h-6 text-green-400" />,
      difficulty: 'Medium',
      setupTime: '3 min',
      popular: false
    },
    {
      id: 'splunk',
      name: 'Splunk',
      description: 'Security information and event management',
      icon: <Shield className="w-6 h-6 text-purple-400" />,
      difficulty: 'Advanced',
      setupTime: '10 min',
      popular: false
    }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy':
        return 'bg-green-600';
      case 'Medium':
        return 'bg-yellow-600';
      case 'Advanced':
        return 'bg-red-600';
      default:
        return 'bg-slate-600';
    }
  };

  const handleContinueWithoutSource = () => {
    onNext();
  };

  const handleSetupLater = () => {
    onNext();
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-bold text-slate-200 mb-2">
          Connect Your First Data Source
        </h2>
        <p className="text-slate-400">
          Choose a data source to start discovering and visualizing your network infrastructure.
          Don't worry, you can add more sources later.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {dataSources.map((source) => (
          <Card 
            key={source.id}
            className={`cursor-pointer transition-all border-2 ${
              selectedSource === source.id 
                ? 'border-cyan-500 bg-cyan-950/20' 
                : 'border-slate-600 bg-slate-800 hover:border-slate-500'
            }`}
            onClick={() => setSelectedSource(source.id)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {source.icon}
                  <div>
                    <CardTitle className="text-lg text-slate-200">{source.name}</CardTitle>
                    {source.popular && (
                      <Badge className="bg-cyan-600 text-white text-xs mt-1">Popular</Badge>
                    )}
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-sm text-slate-400 mb-3">{source.description}</p>
              <div className="flex items-center justify-between">
                <div className="flex space-x-2">
                  <Badge className={`${getDifficultyColor(source.difficulty)} text-white text-xs`}>
                    {source.difficulty}
                  </Badge>
                  <Badge variant="outline" className="border-slate-500 text-slate-300 text-xs">
                    {source.setupTime}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedSource && (
        <Card className="bg-slate-900 border-slate-600">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-slate-200 mb-1">Ready to set up {selectedSource.toUpperCase()}?</h3>
                <p className="text-sm text-slate-400">
                  This will open the data source configuration wizard.
                </p>
              </div>
              <Button 
                className="bg-cyan-600 hover:bg-cyan-700"
                onClick={() => {
                  // In real implementation, this would open the data source wizard
                  onNext();
                }}
              >
                Configure Now
                <ExternalLink className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="bg-slate-900 rounded-lg p-4 border border-slate-600">
        <div className="flex items-center space-x-3">
          <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
          <div className="flex-1">
            <p className="text-sm text-slate-300 mb-1">
              <strong>Pro Tip:</strong> Start with Nmap for quick network discovery
            </p>
            <p className="text-xs text-slate-400">
              Nmap can quickly scan your network and discover devices, giving you an immediate view of your infrastructure.
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={handleSetupLater}
          className="border-slate-600 hover:bg-slate-700"
        >
          Skip for Now
        </Button>
        <Button 
          onClick={handleContinueWithoutSource}
          className="bg-cyan-600 hover:bg-cyan-700"
          disabled={!selectedSource}
        >
          Continue with Setup
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};

export default OnboardingDataSource;
