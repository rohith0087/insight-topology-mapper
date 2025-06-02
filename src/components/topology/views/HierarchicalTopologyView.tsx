
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

interface HierarchicalTopologyViewProps {
  nodes: Node<NodeData>[];
  edges: Edge[];
  onNodeClick: (event: React.MouseEvent, node: Node<NodeData>) => void;
  nodeTypes: any;
}

const HierarchicalTopologyView: React.FC<HierarchicalTopologyViewProps> = ({
  nodes,
  edges,
  onNodeClick,
  nodeTypes
}) => {
  const hierarchicalNodes = useMemo(() => {
    // Group nodes by type for hierarchical layout
    const nodesByType = nodes.reduce((acc, node) => {
      const type = node.data.type;
      if (!acc[type]) acc[type] = [];
      acc[type].push(node);
      return acc;
    }, {} as Record<string, Node<NodeData>[]>);

    const typeOrder = ['cloud', 'device', 'service', 'application'];
    const levelSpacing = 200;
    const nodeSpacing = 180;
    
    let layoutNodes: Node<NodeData>[] = [];
    
    typeOrder.forEach((type, levelIndex) => {
      const nodesOfType = nodesByType[type] || [];
      const y = levelIndex * levelSpacing + 100;
      
      nodesOfType.forEach((node, nodeIndex) => {
        const totalWidth = (nodesOfType.length - 1) * nodeSpacing;
        const startX = 400 - totalWidth / 2;
        
        layoutNodes.push({
          ...node,
          position: {
            x: startX + nodeIndex * nodeSpacing,
            y: y
          }
        });
      });
    });
    
    return layoutNodes;
  }, [nodes]);

  const [reactFlowNodes, setNodes, onNodesChange] = useNodesState(hierarchicalNodes);
  const [reactFlowEdges, setEdges, onEdgesChange] = useEdgesState(edges);

  React.useEffect(() => {
    setNodes(hierarchicalNodes);
    setEdges(edges);
  }, [hierarchicalNodes, edges, setNodes, setEdges]);

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
      <Background color="#334155" gap={16} />
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

export default HierarchicalTopologyView;
