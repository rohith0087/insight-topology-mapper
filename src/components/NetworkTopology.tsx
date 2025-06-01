
import React, { useCallback, useMemo } from 'react';
import ReactFlow, {
  Node,
  Edge,
  addEdge,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  OnNodesChange,
  OnEdgesChange,
  Connection,
  ConnectionMode,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { generateMockTopologyData } from '../utils/mockData';
import CustomDeviceNode from './nodes/CustomDeviceNode';
import CustomServiceNode from './nodes/CustomServiceNode';
import CustomApplicationNode from './nodes/CustomApplicationNode';
import CustomCloudNode from './nodes/CustomCloudNode';

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
  const mockData = useMemo(() => generateMockTopologyData(), []);
  
  const [nodes, setNodes, onNodesChange] = useNodesState(mockData.nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(mockData.edges);

  const onConnect = useCallback(
    (params: Edge | Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
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

  return (
    <div className="w-full h-full bg-slate-900">
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
    </div>
  );
};

export default NetworkTopology;
