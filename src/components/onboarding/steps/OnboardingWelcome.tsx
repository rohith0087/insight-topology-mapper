
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Network, Shield, BarChart3, Brain, ArrowRight } from 'lucide-react';

interface OnboardingWelcomeProps {
  onNext: () => void;
}

const OnboardingWelcome: React.FC<OnboardingWelcomeProps> = ({ onNext }) => {
  const features = [
    {
      icon: <Network className="w-8 h-8 text-cyan-400" />,
      title: "Network Visualization",
      description: "Interactive topology views with real-time monitoring"
    },
    {
      icon: <Shield className="w-8 h-8 text-green-400" />,
      title: "Security Operations",
      description: "Comprehensive security monitoring and threat detection"
    },
    {
      icon: <BarChart3 className="w-8 h-8 text-blue-400" />,
      title: "Executive Dashboard",
      description: "Business-focused metrics and KPI tracking"
    },
    {
      icon: <Brain className="w-8 h-8 text-purple-400" />,
      title: "AI-Powered Insights",
      description: "Natural language queries and intelligent analysis"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-20 h-20 bg-cyan-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <Network className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-slate-200 mb-2">
          Welcome to LumenNet
        </h2>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto">
          Your AI-powered Security Operations Center visualization platform. 
          Let's get you set up in just a few minutes.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {features.map((feature, index) => (
          <Card key={index} className="bg-slate-900 border-slate-600">
            <CardContent className="p-4">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">{feature.icon}</div>
                <div>
                  <h3 className="font-semibold text-slate-200 mb-1">{feature.title}</h3>
                  <p className="text-sm text-slate-400">{feature.description}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="bg-slate-900 rounded-lg p-6 border border-slate-600">
        <h3 className="text-lg font-semibold text-slate-200 mb-3">What's Next?</h3>
        <div className="space-y-2 text-sm text-slate-400">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
            <span>Connect your first data source (5 minutes)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
            <span>Take a quick tour of the network topology</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
            <span>Configure monitoring and alerts (optional)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
            <span>Customize your dashboard (optional)</span>
          </div>
        </div>
      </div>

      <div className="text-center">
        <Button 
          onClick={onNext}
          size="lg"
          className="bg-cyan-600 hover:bg-cyan-700 text-white px-8"
        >
          Get Started
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};

export default OnboardingWelcome;
