import React, { useCallback } from 'react';
import ReactFlow, {
  addEdge,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  Node,
  Edge,
  Connection // <-- add this import
} from 'react-flow-renderer';
import { Box, Paper } from '@mui/material';

const initialNodes: Node[] = [
  {
    id: 'start-1',
    type: 'input',
    data: { label: 'Welcome', message: 'Hello! How can I help you today?' },
    position: { x: 100, y: 100 }
  },
  {
    id: 'condition-1',
    type: 'default',
    data: {
      label: 'Check User Type',
      conditions: [
        { variable: 'userType', operator: '==', value: 'new' },
        { variable: 'userType', operator: '==', value: 'returning' }
      ]
    },
    position: { x: 300, y: 100 }
  }
];

const initialEdges: Edge[] = [
  { id: 'edge-1', source: 'start-1', target: 'condition-1' }
];

export default function FlowEditor() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  return (
    <Box sx={{ height: '600px', width: '100%' }}>
      <Paper elevation={3} sx={{ height: '100%' }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          fitView
        >
          <MiniMap />
          <Controls />
          <Background />
        </ReactFlow>
      </Paper>
    </Box>
  );
}
