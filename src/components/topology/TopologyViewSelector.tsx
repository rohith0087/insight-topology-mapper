
import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Network, 
  Grid3X3, 
  Layers, 
  CircleDot, 
  TreePine, 
  Zap,
  BarChart3,
  Box,
  ChevronDown
} from 'lucide-react';

export type TopologyView = 'network' | 'grid' | 'hierarchical' | 'radial' | 'tree' | 'force' | 'matrix' | 'layered';

interface TopologyViewSelectorProps {
  currentView: TopologyView;
  onViewChange: (view: TopologyView) => void;
}

const viewOptions = [
  {
    id: 'network' as TopologyView,
    name: 'Network Flow',
    icon: Network,
    description: 'Traditional network diagram'
  },
  {
    id: 'grid' as TopologyView,
    name: 'Grid Layout',
    icon: Grid3X3,
    description: 'Organized grid view'
  },
  {
    id: 'hierarchical' as TopologyView,
    name: 'Hierarchical',
    icon: Layers,
    description: 'Top-down hierarchy'
  },
  {
    id: 'radial' as TopologyView,
    name: 'Radial',
    icon: CircleDot,
    description: 'Circular node arrangement'
  },
  {
    id: 'tree' as TopologyView,
    name: 'Tree View',
    icon: TreePine,
    description: 'Tree-like structure'
  },
  {
    id: 'force' as TopologyView,
    name: 'Force Layout',
    icon: Zap,
    description: 'Physics-based positioning'
  },
  {
    id: 'layered' as TopologyView,
    name: 'Layered View',
    icon: Box,
    description: 'Isometric layer view'
  },
  {
    id: 'matrix' as TopologyView,
    name: 'Connection Matrix',
    icon: BarChart3,
    description: 'Matrix visualization'
  }
];

const TopologyViewSelector: React.FC<TopologyViewSelectorProps> = ({
  currentView,
  onViewChange
}) => {
  const currentViewOption = viewOptions.find(v => v.id === currentView);
  const CurrentIcon = currentViewOption?.icon || Network;

  return (
    <div className="bg-slate-800/90 backdrop-blur-sm border border-slate-600 rounded-lg p-3 min-w-[200px]">
      <div className="flex items-center space-x-2 mb-2">
        <Network className="w-4 h-4 text-cyan-400" />
        <span className="text-sm font-medium text-cyan-400">Visualization Mode</span>
      </div>
      
      <Select value={currentView} onValueChange={onViewChange}>
        <SelectTrigger className="w-full bg-slate-700 border-slate-600 text-slate-200 hover:bg-slate-600">
          <div className="flex items-center space-x-2">
            <CurrentIcon className="w-4 h-4" />
            <SelectValue placeholder="Select view" />
          </div>
        </SelectTrigger>
        <SelectContent className="bg-slate-800 border-slate-600">
          {viewOptions.map((view) => {
            const Icon = view.icon;
            return (
              <SelectItem 
                key={view.id} 
                value={view.id}
                className="text-slate-200 hover:bg-slate-700 focus:bg-slate-700"
              >
                <div className="flex items-center space-x-2">
                  <Icon className="w-4 h-4" />
                  <div className="flex flex-col">
                    <span>{view.name}</span>
                    <span className="text-xs text-slate-400">{view.description}</span>
                  </div>
                </div>
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
    </div>
  );
};

export default TopologyViewSelector;
