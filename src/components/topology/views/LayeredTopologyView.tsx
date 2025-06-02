
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

interface LayeredTopologyViewProps {
  nodes: Node<NodeData>[];
  edges: Edge[];
  onNodeClick: (event: React.MouseEvent, node: Node<NodeData>) => void;
  nodeTypes: any;
}

const LayeredTopologyView: React.FC<LayeredTopologyViewProps> = ({
  nodes,
  edges,
  onNodeClick,
  nodeTypes
}) => {
  const layeredNodes = useMemo(() => {
    // Create layered isometric-style layout
    const typeOrder = ['cloud', 'service', 'device', 'application'];
    const layerSpacing = 200;
    const perspectiveOffset = 50;
    
    return nodes.map((node, index) => {
      const typeIndex = typeOrder.indexOf(node.data.type);
      const layer = typeIndex >= 0 ? typeIndex : 0;
      
      // Create isometric effect
      const baseX = (index % 4) * 180 + 100;
      const baseY = Math.floor(index / 4) * 120 + 100;
      
      return {
        ...node,
        position: {
          x: baseX + layer * perspectiveOffset,
          y: baseY + layer * layerSpacing
        },
        style: {
          ...node.style,
          zIndex: 10 - layer,
          transform: `scale(${1 - layer * 0.1})`,
          filter: `brightness(${100 - layer * 15}%)`
        }
      };
    });
  }, [nodes]);

  const [reactFlowNodes, setNodes, onNodesChange] = useNodesState(layeredNodes);
  const [reactFlowEdges, setEdges, onEdgesChange] = useEdgesState(edges);

  React.useEffect(() => {
    setNodes(layeredNodes);
    setEdges(edges);
  }, [layeredNodes, edges, setNodes, setEdges]);

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
      <Background color="#334155" gap={30} size={1.5} />
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

export default LayeredTopologyView;
