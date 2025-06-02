
import React, { useMemo, useEffect, useRef } from 'react';
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

interface ForceTopologyViewProps {
  nodes: Node<NodeData>[];
  edges: Edge[];
  onNodeClick: (event: React.MouseEvent, node: Node<NodeData>) => void;
  nodeTypes: any;
}

// Simple force simulation implementation
class ForceSimulation {
  nodes: any[];
  edges: any[];
  width: number;
  height: number;

  constructor(nodes: any[], edges: any[], width = 800, height = 600) {
    this.nodes = nodes.map(node => ({
      ...node,
      vx: 0,
      vy: 0,
      fx: null,
      fy: null
    }));
    this.edges = edges;
    this.width = width;
    this.height = height;
  }

  tick() {
    const alpha = 0.3;
    const centerForce = 0.01;
    const repelForce = 1000;
    const linkForce = 0.1;
    const linkDistance = 100;

    // Reset forces
    this.nodes.forEach(node => {
      node.fx = 0;
      node.fy = 0;
    });

    // Center force
    const centerX = this.width / 2;
    const centerY = this.height / 2;
    this.nodes.forEach(node => {
      node.fx += (centerX - node.position.x) * centerForce;
      node.fy += (centerY - node.position.y) * centerForce;
    });

    // Repulsion between nodes
    for (let i = 0; i < this.nodes.length; i++) {
      for (let j = i + 1; j < this.nodes.length; j++) {
        const nodeA = this.nodes[i];
        const nodeB = this.nodes[j];
        const dx = nodeB.position.x - nodeA.position.x;
        const dy = nodeB.position.y - nodeA.position.y;
        const distance = Math.sqrt(dx * dx + dy * dy) || 1;
        const force = repelForce / (distance * distance);
        const fx = (dx / distance) * force;
        const fy = (dy / distance) * force;
        
        nodeA.fx -= fx;
        nodeA.fy -= fy;
        nodeB.fx += fx;
        nodeB.fy += fy;
      }
    }

    // Link forces
    this.edges.forEach(edge => {
      const source = this.nodes.find(n => n.id === edge.source);
      const target = this.nodes.find(n => n.id === edge.target);
      if (source && target) {
        const dx = target.position.x - source.position.x;
        const dy = target.position.y - source.position.y;
        const distance = Math.sqrt(dx * dx + dy * dy) || 1;
        const force = (distance - linkDistance) * linkForce;
        const fx = (dx / distance) * force;
        const fy = (dy / distance) * force;
        
        source.fx += fx;
        source.fy += fy;
        target.fx -= fx;
        target.fy -= fy;
      }
    });

    // Apply forces
    this.nodes.forEach(node => {
      node.vx = (node.vx + node.fx) * 0.9; // Damping
      node.vy = (node.vy + node.fy) * 0.9;
      node.position.x += node.vx * alpha;
      node.position.y += node.vy * alpha;
    });

    return this.nodes;
  }
}

const ForceTopologyView: React.FC<ForceTopologyViewProps> = ({
  nodes,
  edges,
  onNodeClick,
  nodeTypes
}) => {
  const simulationRef = useRef<ForceSimulation | null>(null);
  const animationRef = useRef<number>();

  const initialForceNodes = useMemo(() => {
    // Initialize nodes with random positions
    return nodes.map(node => ({
      ...node,
      position: {
        x: Math.random() * 600 + 100,
        y: Math.random() * 400 + 100
      }
    }));
  }, [nodes]);

  const [reactFlowNodes, setNodes, onNodesChange] = useNodesState(initialForceNodes);
  const [reactFlowEdges, setEdges, onEdgesChange] = useEdgesState(edges);

  useEffect(() => {
    simulationRef.current = new ForceSimulation(initialForceNodes, edges);
    
    let iterations = 0;
    const maxIterations = 300;

    const animate = () => {
      if (simulationRef.current && iterations < maxIterations) {
        const updatedNodes = simulationRef.current.tick();
        setNodes(updatedNodes.map(node => ({
          ...node,
          position: { ...node.position }
        })));
        iterations++;
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [initialForceNodes, edges, setNodes]);

  useEffect(() => {
    setEdges(edges);
  }, [edges, setEdges]);

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
      <Background color="#334155" gap={25} size={2} />
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

export default ForceTopologyView;
