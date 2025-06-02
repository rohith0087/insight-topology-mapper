
import React, { useCallback } from 'react';
import ReactFlow, {
  Node,
  Edge,
  addEdge,
  Connection,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  MiniMap,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { NodeData } from '@/types/networkTypes';

interface NetworkFlowViewProps {
  nodes: Node<NodeData>[];
  edges: Edge[];
  onNodeClick: (event: React.MouseEvent, node: Node<NodeData>) => void;
  nodeTypes?: any;
}

const NetworkFlowView: React.FC<NetworkFlowViewProps> = ({
  nodes,
  edges,
  onNodeClick,
  nodeTypes
}) => {
  const [flowNodes, setNodes, onNodesChange] = useNodesState(nodes);
  const [flowEdges, setEdges, onEdgesChange] = useEdgesState(edges);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  // Update nodes when props change
  React.useEffect(() => {
    setNodes(nodes);
  }, [nodes, setNodes]);

  // Update edges when props change
  React.useEffect(() => {
    setEdges(edges);
  }, [edges, setEdges]);

  return (
    <div className="w-full h-full bg-slate-900">
      <ReactFlow
        nodes={flowNodes}
        edges={flowEdges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        nodeTypes={nodeTypes}
        fitView
        className="bg-slate-900"
      >
        <Controls className="bg-slate-800 border-slate-600" />
        <MiniMap 
          className="bg-slate-800 border border-slate-600" 
          nodeColor={(node) => {
            switch (node.data?.status) {
              case 'healthy': return '#10b981';
              case 'warning': return '#f59e0b';
              case 'critical': return '#ef4444';
              default: return '#6b7280';
            }
          }}
        />
        <Background color="#334155" gap={20} />
      </ReactFlow>
    </div>
  );
};

export default NetworkFlowView;
