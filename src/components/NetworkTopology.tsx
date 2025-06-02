
import React, { useMemo } from 'react';
import { Node, Edge, NodeProps } from 'reactflow';
import { useNetworkData } from '@/hooks/useNetworkData';
import { NodeData } from '@/types/networkTypes';
import GridTopologyView from './topology/views/GridTopologyView';
import HierarchicalTopologyView from './topology/views/HierarchicalTopologyView';
import RadialTopologyView from './topology/views/RadialTopologyView';
import NetworkFlowView from './topology/views/NetworkFlowView';
import { TopologyView } from './topology/TopologyViewSelector';

const nodeTypes = {
  // default: CustomNode
};

interface NetworkTopologyProps {
  currentView: TopologyView;
  onNodeClick: (event: React.MouseEvent, node: Node<NodeData>) => void;
  filterSettings: {
    showDevices: boolean;
    showServices: boolean;
    showApplications: boolean;
    showCloudResources: boolean;
    showConnections: boolean;
  };
  statusFilter?: string;
  searchTerm?: string;
}

const NetworkTopology: React.FC<NetworkTopologyProps> = ({
  currentView,
  onNodeClick,
  filterSettings,
  statusFilter = 'all',
  searchTerm = ''
}) => {
  const { data: networkData, isLoading, error } = useNetworkData();

  const filteredData = useMemo(() => {
    if (!networkData) return { nodes: [], edges: [] };

    let filteredNodes = networkData.nodes.filter(node => {
      // Type filter
      const typeFilter = 
        (node.data.type === 'device' && filterSettings.showDevices) ||
        (node.data.type === 'service' && filterSettings.showServices) ||
        (node.data.type === 'application' && filterSettings.showApplications) ||
        (node.data.type === 'cloud' && filterSettings.showCloudResources);

      // Status filter
      const statusMatches = statusFilter === 'all' || node.data.status === statusFilter;

      // Search filter
      const searchMatches = searchTerm === '' || 
        node.data.label.toLowerCase().includes(searchTerm.toLowerCase());

      return typeFilter && statusMatches && searchMatches;
    });

    // Filter edges to only show connections between visible nodes
    const visibleNodeIds = new Set(filteredNodes.map(node => node.id));
    let filteredEdges = networkData.edges.filter(edge => 
      visibleNodeIds.has(edge.source) && visibleNodeIds.has(edge.target)
    );

    // Apply connection filter
    if (!filterSettings.showConnections) {
      filteredEdges = [];
    }

    console.log('Filtered data:', { 
      nodes: filteredNodes.length, 
      edges: filteredEdges.length,
      statusFilter,
      searchTerm
    });

    return {
      nodes: filteredNodes,
      edges: filteredEdges
    };
  }, [networkData, filterSettings, statusFilter, searchTerm]);

  if (isLoading) {
    return <div className="w-full h-full flex items-center justify-center text-slate-300">Loading network topology...</div>;
  }

  if (error) {
    return <div className="w-full h-full flex items-center justify-center text-red-400">Error: {error.message}</div>;
  }

  const renderTopologyView = () => {
    const commonProps = {
      nodes: filteredData.nodes,
      edges: filteredData.edges,
      onNodeClick,
      nodeTypes
    };

    switch (currentView) {
      case 'grid':
        return <GridTopologyView {...commonProps} />;
      case 'hierarchical':
        return <HierarchicalTopologyView {...commonProps} />;
      case 'radial':
        return <RadialTopologyView {...commonProps} />;
      case 'network':
      default:
        return <NetworkFlowView {...commonProps} />;
    }
  };

  return (
    <div className="w-full h-full">
      {renderTopologyView()}
    </div>
  );
};

export default NetworkTopology;
