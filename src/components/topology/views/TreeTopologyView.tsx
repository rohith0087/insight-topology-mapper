
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

interface TreeTopologyViewProps {
  nodes: Node<NodeData>[];
  edges: Edge[];
  onNodeClick: (event: React.MouseEvent, node: Node<NodeData>) => void;
  nodeTypes: any;
}

const TreeTopologyView: React.FC<TreeTopologyViewProps> = ({
  nodes,
  edges,
  onNodeClick,
  nodeTypes
}) => {
  const treeNodes = useMemo(() => {
    // Build tree structure from edges
    const nodeMap = new Map(nodes.map(node => [node.id, { ...node, children: [] as string[] }]));
    const rootNodes: string[] = [];
    const hasParent = new Set<string>();

    // Identify parent-child relationships
    edges.forEach(edge => {
      const parent = nodeMap.get(edge.source);
      if (parent) {
        parent.children.push(edge.target);
        hasParent.add(edge.target);
      }
    });

    // Find root nodes (nodes without parents)
    nodes.forEach(node => {
      if (!hasParent.has(node.id)) {
        rootNodes.push(node.id);
      }
    });

    // Layout tree using recursive positioning
    const layoutNodes: Node<NodeData>[] = [];
    const levelHeight = 150;
    const minNodeSpacing = 180;
    let currentX = 100;

    const layoutSubtree = (nodeId: string, level: number, parentX?: number): number => {
      const node = nodeMap.get(nodeId);
      if (!node) return currentX;

      const children = node.children || [];
      let subtreeWidth = 0;
      let childrenStartX = currentX;

      if (children.length > 0) {
        // Layout children first to determine subtree width
        children.forEach(childId => {
          subtreeWidth += layoutSubtree(childId, level + 1);
        });
      } else {
        subtreeWidth = minNodeSpacing;
      }

      // Position current node in center of its subtree
      const nodeX = childrenStartX + subtreeWidth / 2 - minNodeSpacing / 2;
      
      layoutNodes.push({
        ...node,
        position: {
          x: nodeX,
          y: level * levelHeight + 50
        }
      });

      currentX += subtreeWidth;
      return subtreeWidth;
    };

    // Layout from each root
    rootNodes.forEach(rootId => {
      layoutSubtree(rootId, 0);
      currentX += 50; // Space between separate trees
    });

    return layoutNodes;
  }, [nodes, edges]);

  const [reactFlowNodes, setNodes, onNodesChange] = useNodesState(treeNodes);
  const [reactFlowEdges, setEdges, onEdgesChange] = useEdgesState(edges);

  React.useEffect(() => {
    setNodes(treeNodes);
    setEdges(edges);
  }, [treeNodes, edges, setNodes, setEdges]);

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
      <Background color="#334155" gap={15} size={1} />
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

export default TreeTopologyView;
