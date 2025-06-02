
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Network, 
  Grid3X3, 
  Layers, 
  CircleDot, 
  TreePine, 
  Zap,
  BarChart3,
  Box
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
  return (
    <div className="bg-slate-800 border border-slate-600 rounded-lg p-4">
      <div className="flex items-center space-x-2 mb-3">
        <Network className="w-4 h-4 text-cyan-400" />
        <h3 className="text-sm font-medium text-cyan-400">Visualization Mode</h3>
        <Badge variant="outline" className="text-xs border-slate-500 text-slate-300">
          {viewOptions.find(v => v.id === currentView)?.name}
        </Badge>
      </div>
      
      <div className="grid grid-cols-2 gap-2">
        {viewOptions.map((view) => {
          const Icon = view.icon;
          const isActive = currentView === view.id;
          
          return (
            <Button
              key={view.id}
              onClick={() => onViewChange(view.id)}
              variant={isActive ? "default" : "outline"}
              size="sm"
              className={`
                h-auto p-3 flex flex-col items-center space-y-1 text-xs
                ${isActive 
                  ? 'bg-cyan-600 hover:bg-cyan-700 text-white border-cyan-500' 
                  : 'border-slate-600 bg-slate-700 hover:bg-slate-600 text-slate-300'
                }
              `}
              title={view.description}
            >
              <Icon className="w-4 h-4" />
              <span className="leading-tight text-center">{view.name}</span>
            </Button>
          );
        })}
      </div>
    </div>
  );
};

export default TopologyViewSelector;
