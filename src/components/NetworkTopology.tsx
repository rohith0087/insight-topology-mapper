import React, { useCallback, useMemo, useEffect, useState } from 'react';
import {
  ReactFlow,
  Node,
  Edge,
  addEdge,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  Connection,
  ConnectionMode,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { useNetworkData } from '../hooks/useNetworkData';
import CustomDeviceNode from './nodes/CustomDeviceNode';
import CustomServiceNode from './nodes/CustomServiceNode';
import CustomApplicationNode from './nodes/CustomApplicationNode';
import CustomCloudNode from './nodes/CustomCloudNode';
import TopologyViewSelector, { TopologyView } from './topology/TopologyViewSelector';
import GridTopologyView from './topology/views/GridTopologyView';
import RadialTopologyView from './topology/views/RadialTopologyView';
import HierarchicalTopologyView from './topology/views/HierarchicalTopologyView';
import ConnectionMatrixView from './topology/views/ConnectionMatrixView';
import TreeTopologyView from './topology/views/TreeTopologyView';
import ForceTopologyView from './topology/views/ForceTopologyView';
import LayeredTopologyView from './topology/views/LayeredTopologyView';
import { NodeData } from '../types/networkTypes';
import { generateMockTopologyData } from '../utils/mockData';
import { Alert, AlertDescription } from './ui/alert';
import { Info } from 'lucide-react';

const nodeTypes = {
  device: CustomDeviceNode,
  service: CustomServiceNode,
  application: CustomApplicationNode,
  cloud: CustomCloudNode,
};

interface NetworkTopologyProps {
  selectedNode: any;
  setSelectedNode: (node: any) => void;
  filterSettings: any;
}

const NetworkTopology: React.FC<NetworkTopologyProps> = ({
  selectedNode,
  setSelectedNode,
  filterSettings
}) => {
  const { data: networkData, isLoading, error } = useNetworkData();
  const [currentView, setCurrentView] = useState<TopologyView>('network');
  
  // Use static data if no data is available from the database
  const actualData = useMemo(() => {
    if (networkData && (networkData.nodes.length > 0 || networkData.edges.length > 0)) {
      return { ...networkData, isStatic: false };
    }
    const mockData = generateMockTopologyData();
    return { ...mockData, isStatic: true };
  }, [networkData]);
  
  const [nodes, setNodes, onNodesChange] = useNodesState<NodeData>(actualData.nodes || []);
  const [edges, setEdges, onEdgesChange] = useEdgesState(actualData.edges || []);

  // Update nodes and edges when data changes
  useEffect(() => {
    if (actualData) {
      setNodes(actualData.nodes);
      setEdges(actualData.edges);
    }
  }, [actualData, setNodes, setEdges]);

  const onConnect = useCallback(
    (params: Edge | Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onNodeClick = useCallback((event: React.MouseEvent, node: Node<NodeData>) => {
    setSelectedNode(node.data);
  }, [setSelectedNode]);

  // Filter nodes based on settings
  const filteredNodes = useMemo(() => {
    return nodes.filter(node => {
      const nodeType = node.data.type;
      switch (nodeType) {
        case 'device':
          return filterSettings.showDevices;
        case 'service':
          return filterSettings.showServices;
        case 'application':
          return filterSettings.showApplications;
        case 'cloud':
          return filterSettings.showCloudResources;
        default:
          return true;
      }
    });
  }, [nodes, filterSettings]);

  if (isLoading) {
    return (
      <div className="w-full h-full bg-slate-900 flex items-center justify-center">
        <div className="text-white text-lg">Loading network topology...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-full bg-slate-900 flex items-center justify-center">
        <div className="text-red-400 text-lg">Error loading network data: {error.message}</div>
      </div>
    );
  }

  const renderTopologyView = () => {
    const commonProps = {
      nodes: filteredNodes,
      edges,
      onNodeClick,
      nodeTypes
    };

    switch (currentView) {
      case 'grid':
        return <GridTopologyView {...commonProps} />;
      case 'radial':
        return <RadialTopologyView {...commonProps} />;
      case 'hierarchical':
        return <HierarchicalTopologyView {...commonProps} />;
      case 'tree':
        return <TreeTopologyView {...commonProps} />;
      case 'force':
        return <ForceTopologyView {...commonProps} />;
      case 'layered':
        return <LayeredTopologyView {...commonProps} />;
      case 'matrix':
        return <ConnectionMatrixView {...commonProps} />;
      default:
        return (
          <ReactFlow
            nodes={filteredNodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={onNodeClick}
            nodeTypes={nodeTypes}
            connectionMode={ConnectionMode.Loose}
            fitView
            className="bg-slate-900"
          >
            <Background color="#334155" gap={20} />
            <Controls className="bg-slate-800 border border-slate-600" />
            <MiniMap 
              nodeColor={(node) => {
                switch (node.data.type) {
                  case 'device': return '#06b6d4';
                  case 'service': return '#10b981';
                  case 'application': return '#8b5cf6';
                  case 'cloud': return '#f59e0b';
                  default: return '#64748b';
                }
              }}
              className="bg-slate-800 border border-slate-600"
            />
          </ReactFlow>
        );
    }
  };

  return (
    <div className="w-full h-full bg-slate-900 relative">
      {actualData.isStatic && (
        <div className="absolute top-4 left-4 z-10 max-w-md">
          <Alert className="border-cyan-500/50 bg-cyan-950/50 text-cyan-100">
            <Info className="h-4 w-4 text-cyan-400" />
            <AlertDescription className="text-sm">
              <strong>Static Demo Data:</strong> No live data sources connected. Showing sample network topology for demonstration purposes.
            </AlertDescription>
          </Alert>
        </div>
      )}

      {/* View Selector */}
      <div className="absolute top-4 right-4 z-10">
        <TopologyViewSelector 
          currentView={currentView}
          onViewChange={setCurrentView}
        />
      </div>
      
      {renderTopologyView()}
    </div>
  );
};

export default NetworkTopology;
