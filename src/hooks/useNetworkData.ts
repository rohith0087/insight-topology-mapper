
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { NodeData } from '../types/networkTypes';
import { Node, Edge } from 'reactflow';

interface NetworkNode {
  id: string;
  external_id: string;
  source_system: string;
  node_type: 'device' | 'service' | 'application' | 'cloud';
  label: string;
  status: 'healthy' | 'warning' | 'critical' | 'unknown';
  metadata: any;
  last_seen: string;
}

interface NetworkConnection {
  id: string;
  source_node_id: string;
  target_node_id: string;
  connection_type: string;
  protocol?: string;
  port?: number;
}

const transformNodeToReactFlow = (node: NetworkNode, index: number): Node<NodeData> => {
  // Position nodes in a grid layout
  const cols = 5;
  const x = (index % cols) * 200 + 100;
  const y = Math.floor(index / cols) * 150 + 100;

  return {
    id: node.id,
    type: node.node_type,
    position: { x, y },
    data: {
      label: node.label,
      type: node.node_type,
      status: node.status === 'unknown' ? 'warning' : node.status,
      metadata: node.metadata
    }
  };
};

const transformConnectionToReactFlow = (connection: NetworkConnection): Edge => ({
  id: connection.id,
  source: connection.source_node_id,
  target: connection.target_node_id,
  type: 'smoothstep',
  style: { 
    stroke: connection.connection_type === 'network' ? '#06b6d4' : '#10b981' 
  }
});

export const useNetworkData = () => {
  return useQuery({
    queryKey: ['network-topology'],
    queryFn: async () => {
      // Fetch nodes
      const { data: nodes, error: nodesError } = await supabase
        .from('network_nodes')
        .select('*')
        .order('created_at', { ascending: false });

      if (nodesError) throw nodesError;

      // Fetch connections
      const { data: connections, error: connectionsError } = await supabase
        .from('network_connections')
        .select('*');

      if (connectionsError) throw connectionsError;

      // Transform to ReactFlow format
      const reactFlowNodes = (nodes || []).map(transformNodeToReactFlow);
      const reactFlowEdges = (connections || []).map(transformConnectionToReactFlow);

      return {
        nodes: reactFlowNodes,
        edges: reactFlowEdges
      };
    },
    refetchInterval: 30000, // Refetch every 30 seconds
  });
};
