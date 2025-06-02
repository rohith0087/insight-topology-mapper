
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Network, 
  Search, 
  Filter, 
  Eye, 
  RotateCcw, 
  ZoomIn, 
  MousePointer,
  ArrowRight,
  Play
} from 'lucide-react';

interface OnboardingTopologyTourProps {
  onNext: () => void;
}

const OnboardingTopologyTour: React.FC<OnboardingTopologyTourProps> = ({ onNext }) => {
  const [currentTourStep, setCurrentTourStep] = useState(0);

  const tourSteps = [
    {
      title: "Network Topology Views",
      description: "Switch between different visualization layouts",
      icon: <Network className="w-6 h-6 text-cyan-400" />,
      tips: [
        "Grid view for organized layouts",
        "Radial view for hierarchical networks", 
        "Force-directed for automatic positioning"
      ]
    },
    {
      title: "Search & Filtering",
      description: "Find specific nodes and connections quickly",
      icon: <Search className="w-6 h-6 text-green-400" />,
      tips: [
        "Use AI search with natural language",
        "Filter by device type or status",
        "Search by IP address or hostname"
      ]
    },
    {
      title: "Node Interaction",
      description: "Click nodes to see detailed information",
      icon: <MousePointer className="w-6 h-6 text-purple-400" />,
      tips: [
        "Click any node for details",
        "Right-click for context menu",
        "Drag nodes to reposition them"
      ]
    },
    {
      title: "Zoom & Navigation",
      description: "Navigate large networks efficiently",
      icon: <ZoomIn className="w-6 h-6 text-blue-400" />,
      tips: [
        "Mouse wheel to zoom in/out",
        "Drag background to pan",
        "Use mini-map for overview"
      ]
    }
  ];

  const currentStep = tourSteps[currentTourStep];

  const handleNextStep = () => {
    if (currentTourStep < tourSteps.length - 1) {
      setCurrentTourStep(currentTourStep + 1);
    } else {
      onNext();
    }
  };

  const handlePrevStep = () => {
    if (currentTourStep > 0) {
      setCurrentTourStep(currentTourStep - 1);
    }
  };

  const handleStartInteractiveTour = () => {
    // In real implementation, this would start an interactive guided tour
    onNext();
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-bold text-slate-200 mb-2">
          Explore Network Topology
        </h2>
        <p className="text-slate-400">
          Learn how to navigate and interact with your network visualization
        </p>
      </div>

      {/* Tour Progress */}
      <div className="flex justify-center space-x-2">
        {tourSteps.map((_, index) => (
          <div
            key={index}
            className={`w-3 h-3 rounded-full transition-colors ${
              index === currentTourStep 
                ? 'bg-cyan-400' 
                : index < currentTourStep 
                ? 'bg-green-400' 
                : 'bg-slate-600'
            }`}
          />
        ))}
      </div>

      {/* Current Step */}
      <Card className="bg-slate-900 border-slate-600">
        <CardContent className="p-6">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              {currentStep.icon}
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-slate-200 mb-2">
                {currentStep.title}
              </h3>
              <p className="text-slate-400 mb-4">
                {currentStep.description}
              </p>
              <div className="space-y-2">
                {currentStep.tips.map((tip, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full flex-shrink-0"></div>
                    <span className="text-sm text-slate-300">{tip}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions Preview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card className="bg-slate-800 border-slate-600 p-4">
          <div className="text-center">
            <Filter className="w-6 h-6 text-slate-400 mx-auto mb-2" />
            <p className="text-xs text-slate-400">Filter Nodes</p>
          </div>
        </Card>
        <Card className="bg-slate-800 border-slate-600 p-4">
          <div className="text-center">
            <Eye className="w-6 h-6 text-slate-400 mx-auto mb-2" />
            <p className="text-xs text-slate-400">Toggle Views</p>
          </div>
        </Card>
        <Card className="bg-slate-800 border-slate-600 p-4">
          <div className="text-center">
            <RotateCcw className="w-6 h-6 text-slate-400 mx-auto mb-2" />
            <p className="text-xs text-slate-400">Reset Layout</p>
          </div>
        </Card>
        <Card className="bg-slate-800 border-slate-600 p-4">
          <div className="text-center">
            <ZoomIn className="w-6 h-6 text-slate-400 mx-auto mb-2" />
            <p className="text-xs text-slate-400">Zoom Controls</p>
          </div>
        </Card>
      </div>

      {/* Interactive Tour Option */}
      <Card className="bg-gradient-to-r from-cyan-950 to-blue-950 border-cyan-600">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Play className="w-6 h-6 text-cyan-400" />
              <div>
                <h3 className="font-semibold text-slate-200">Take Interactive Tour</h3>
                <p className="text-sm text-slate-400">
                  Learn by doing with guided highlights and tooltips
                </p>
              </div>
            </div>
            <Button 
              onClick={handleStartInteractiveTour}
              className="bg-cyan-600 hover:bg-cyan-700"
            >
              Start Tour
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={handlePrevStep}
          disabled={currentTourStep === 0}
          className="border-slate-600 hover:bg-slate-700"
        >
          Previous
        </Button>
        <div className="flex space-x-2">
          <Button 
            variant="ghost" 
            onClick={() => onNext()}
            className="text-slate-400 hover:text-white"
          >
            Skip Tour
          </Button>
          <Button 
            onClick={handleNextStep}
            className="bg-cyan-600 hover:bg-cyan-700"
          >
            {currentTourStep === tourSteps.length - 1 ? 'Complete' : 'Next'}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OnboardingTopologyTour;
