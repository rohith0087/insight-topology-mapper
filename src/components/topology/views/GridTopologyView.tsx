
import React, { useMemo } from 'react';
import {
  ReactFlow,
  Node,
  Edge,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { NodeData } from '@/types/networkTypes';

interface GridTopologyViewProps {
  nodes: Node<NodeData>[];
  edges: Edge[];
  onNodeClick: (event: React.MouseEvent, node: Node<NodeData>) => void;
  nodeTypes: any;
}

const GridTopologyView: React.FC<GridTopologyViewProps> = ({
  nodes,
  edges,
  onNodeClick,
  nodeTypes
}) => {
  const gridNodes = useMemo(() => {
    const cols = Math.ceil(Math.sqrt(nodes.length));
    const spacing = 200;
    
    return nodes.map((node, index) => ({
      ...node,
      position: {
        x: (index % cols) * spacing + 100,
        y: Math.floor(index / cols) * spacing + 100
      }
    }));
  }, [nodes]);

  const [reactFlowNodes, setNodes, onNodesChange] = useNodesState(gridNodes);
  const [reactFlowEdges, setEdges, onEdgesChange] = useEdgesState(edges);

  React.useEffect(() => {
    setNodes(gridNodes);
    setEdges(edges);
  }, [gridNodes, edges, setNodes, setEdges]);

  return (
    <ReactFlow
      nodes={reactFlowNodes}
      edges={reactFlowEdges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onNodeClick={onNodeClick}
      nodeTypes={nodeTypes}
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
};

export default GridTopologyView;
