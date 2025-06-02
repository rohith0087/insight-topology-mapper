
import React, { useMemo } from 'react';
import { Node, Edge } from 'reactflow';
import { NodeData } from '@/types/networkTypes';

interface ConnectionMatrixViewProps {
  nodes: Node<NodeData>[];
  edges: Edge[];
  onNodeClick: (event: React.MouseEvent, node: Node<NodeData>) => void;
}

const ConnectionMatrixView: React.FC<ConnectionMatrixViewProps> = ({
  nodes,
  edges,
  onNodeClick
}) => {
  const matrixData = useMemo(() => {
    const nodeMap = new Map(nodes.map(node => [node.id, node]));
    const connections = new Map<string, Set<string>>();
    
    // Initialize connections map
    nodes.forEach(node => {
      connections.set(node.id, new Set());
    });
    
    // Build connections from edges
    edges.forEach(edge => {
      const sourceConnections = connections.get(edge.source);
      const targetConnections = connections.get(edge.target);
      
      if (sourceConnections) sourceConnections.add(edge.target);
      if (targetConnections) targetConnections.add(edge.source);
    });
    
    return { nodeMap, connections };
  }, [nodes, edges]);

  const getNodeTypeColor = (type: string) => {
    switch (type) {
      case 'device': return 'bg-cyan-500';
      case 'service': return 'bg-green-500';
      case 'application': return 'bg-purple-500';
      case 'cloud': return 'bg-yellow-500';
      default: return 'bg-slate-500';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'border-green-400';
      case 'warning': return 'border-yellow-400';
      case 'critical': return 'border-red-400';
      default: return 'border-slate-400';
    }
  };

  return (
    <div className="w-full h-full bg-slate-900 p-6 overflow-auto">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-cyan-400 mb-2">Connection Matrix View</h3>
        <p className="text-sm text-slate-400">Visual representation of node connections in matrix format</p>
      </div>
      
      <div className="bg-slate-800 rounded-lg p-4 overflow-auto">
        <div className="grid gap-1" style={{ gridTemplateColumns: `auto repeat(${nodes.length}, 1fr)` }}>
          {/* Header row */}
          <div className="p-2"></div>
          {nodes.map(node => (
            <div 
              key={`header-${node.id}`} 
              className="p-2 text-xs text-slate-300 text-center transform -rotate-45 origin-bottom-left"
              style={{ minWidth: '40px', height: '60px' }}
            >
              {node.data.label}
            </div>
          ))}
          
          {/* Matrix rows */}
          {nodes.map(sourceNode => (
            <React.Fragment key={`row-${sourceNode.id}`}>
              {/* Row header */}
              <div 
                className={`
                  p-2 text-xs text-white font-medium border-l-4 cursor-pointer
                  hover:bg-slate-700 transition-colors
                  ${getStatusColor(sourceNode.data.status)}
                  ${getNodeTypeColor(sourceNode.data.type)}
                `}
                onClick={(e) => onNodeClick(e, sourceNode)}
                title={`${sourceNode.data.label} (${sourceNode.data.type})`}
              >
                {sourceNode.data.label}
              </div>
              
              {/* Matrix cells */}
              {nodes.map(targetNode => {
                const hasConnection = matrixData.connections.get(sourceNode.id)?.has(targetNode.id);
                const isSelf = sourceNode.id === targetNode.id;
                
                return (
                  <div 
                    key={`cell-${sourceNode.id}-${targetNode.id}`}
                    className={`
                      w-8 h-8 border border-slate-600 flex items-center justify-center text-xs
                      ${isSelf 
                        ? 'bg-slate-600' 
                        : hasConnection 
                          ? 'bg-cyan-500 hover:bg-cyan-400 cursor-pointer' 
                          : 'bg-slate-700 hover:bg-slate-600'
                      }
                      transition-colors
                    `}
                    title={
                      isSelf 
                        ? 'Self reference' 
                        : hasConnection 
                          ? `Connection: ${sourceNode.data.label} ↔ ${targetNode.data.label}`
                          : 'No connection'
                    }
                  >
                    {isSelf ? '●' : hasConnection ? '✓' : ''}
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>
        
        <div className="mt-4 flex items-center space-x-4 text-xs text-slate-400">
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-cyan-500 rounded"></div>
            <span>Connected</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-slate-700 border border-slate-600 rounded"></div>
            <span>No connection</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-slate-600 rounded"></div>
            <span>Self reference</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConnectionMatrixView;
