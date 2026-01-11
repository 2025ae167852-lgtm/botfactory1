import { useCallback, useState, useRef } from "react";
import { useParams, Link } from "wouter";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  ReactFlowProvider,
  Handle,
  Position,
  Node,
} from "reactflow";
import "reactflow/dist/style.css";
import { useBot, useUpdateBot } from "@/hooks/use-bots";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save, MessageSquare, Play, Zap, Clock, GripVertical } from "lucide-react";
import { cn } from "@/lib/utils";
import { GlassCard } from "@/components/ui/glass-card";

// --- Custom Nodes ---

function MessageNode({ data }: any) {
  return (
    <div className="bg-card border border-border rounded-lg shadow-lg w-64 overflow-hidden">
      <div className="bg-primary/10 px-4 py-2 border-b border-border flex items-center gap-2">
        <MessageSquare className="w-4 h-4 text-primary" />
        <span className="font-semibold text-sm">Send Message</span>
      </div>
      <div className="p-4 text-sm text-muted-foreground">
        {data.label || "Enter message..."}
      </div>
      <Handle type="target" position={Position.Top} className="w-3 h-3 bg-muted-foreground" />
      <Handle type="source" position={Position.Bottom} className="w-3 h-3 bg-primary" />
    </div>
  );
}

function StartNode({ data }: any) {
  return (
    <div className="bg-card border-2 border-primary/50 rounded-full w-16 h-16 shadow-lg flex items-center justify-center relative shadow-primary/20">
      <Play className="w-6 h-6 text-primary ml-1" />
      <Handle type="source" position={Position.Bottom} className="w-3 h-3 bg-primary" />
      <div className="absolute -bottom-8 text-xs font-bold uppercase tracking-wider text-muted-foreground">Start</div>
    </div>
  );
}

function ActionNode({ data }: any) {
  return (
    <div className="bg-card border border-border rounded-lg shadow-lg w-64 overflow-hidden">
      <div className="bg-blue-500/10 px-4 py-2 border-b border-border flex items-center gap-2">
        <Zap className="w-4 h-4 text-blue-500" />
        <span className="font-semibold text-sm">Action</span>
      </div>
      <div className="p-4 text-sm text-muted-foreground">
        {data.label || "Perform action..."}
      </div>
      <Handle type="target" position={Position.Top} className="w-3 h-3 bg-muted-foreground" />
      <Handle type="source" position={Position.Bottom} className="w-3 h-3 bg-blue-500" />
    </div>
  );
}

const nodeTypes = {
  message: MessageNode,
  start: StartNode,
  action: ActionNode,
};

// --- Sidebar ---

function EditorSidebar({ onDragStart }: { onDragStart: (event: React.DragEvent, nodeType: string) => void }) {
  return (
    <aside className="w-64 bg-card border-r border-border h-full flex flex-col">
      <div className="p-4 border-b border-border">
        <h2 className="font-bold text-lg">Nodes</h2>
        <p className="text-xs text-muted-foreground">Drag nodes to canvas</p>
      </div>
      <div className="p-4 space-y-3">
        <div
          className="bg-muted/50 p-3 rounded-lg border border-border cursor-grab hover:border-primary/50 transition-colors flex items-center gap-3"
          onDragStart={(event) => onDragStart(event, 'message')}
          draggable
        >
          <MessageSquare className="w-5 h-5 text-primary" />
          <div className="text-sm font-medium">Message</div>
        </div>
        
        <div
          className="bg-muted/50 p-3 rounded-lg border border-border cursor-grab hover:border-primary/50 transition-colors flex items-center gap-3"
          onDragStart={(event) => onDragStart(event, 'action')}
          draggable
        >
          <Zap className="w-5 h-5 text-blue-500" />
          <div className="text-sm font-medium">Action API</div>
        </div>

        <div
          className="bg-muted/50 p-3 rounded-lg border border-border cursor-grab hover:border-primary/50 transition-colors flex items-center gap-3"
          onDragStart={(event) => onDragStart(event, 'delay')}
          draggable
        >
          <Clock className="w-5 h-5 text-orange-500" />
          <div className="text-sm font-medium">Delay</div>
        </div>
      </div>
    </aside>
  );
}

// --- Main Editor Component ---

export default function BotEditor() {
  const { id } = useParams();
  const botId = parseInt(id || "0");
  const { data: bot, isLoading } = useBot(botId);
  const updateBot = useUpdateBot();

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);

  // Initialize nodes when bot loads
  useState(() => {
    if (bot?.flow) {
      // @ts-ignore
      setNodes(bot.flow.nodes || []);
      // @ts-ignore
      setEdges(bot.flow.edges || []);
    } else {
       // Default start node if empty
       setNodes([{ 
         id: 'start', 
         type: 'start', 
         position: { x: 250, y: 50 }, 
         data: { label: 'Start' } 
       }]);
    }
  });

  const onConnect = useCallback((params: Connection | Edge) => {
    setEdges((eds) => addEdge(params, eds));
  }, [setEdges]);

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow');
      if (typeof type === 'undefined' || !type) {
        return;
      }

      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newNode: Node = {
        id: `node-${Date.now()}`,
        type,
        position,
        data: { label: `New ${type}` },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance, setNodes],
  );

  const onSave = () => {
    if (!bot) return;
    
    // Convert to simple JSON object for storage
    const flowData = {
      nodes: nodes,
      edges: edges,
    };

    updateBot.mutate({
      id: botId,
      updates: { flow: flowData },
    });
  };

  if (isLoading) return <div className="h-screen flex items-center justify-center">Loading editor...</div>;

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="h-14 border-b border-border flex items-center justify-between px-4 bg-card">
        <div className="flex items-center gap-4">
          <Link href="/bots">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div className="flex flex-col">
            <h1 className="text-sm font-bold">{bot?.name}</h1>
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <span className={`w-1.5 h-1.5 rounded-full ${bot?.isActive ? 'bg-green-500' : 'bg-gray-500'}`} />
              {bot?.isActive ? 'Active' : 'Inactive'}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            onClick={onSave} 
            disabled={updateBot.isPending}
            className="bg-primary hover:bg-primary/90 gap-2"
          >
            <Save className="w-4 h-4" />
            {updateBot.isPending ? "Saving..." : "Save Flow"}
          </Button>
        </div>
      </header>

      {/* Editor Body */}
      <div className="flex-1 flex overflow-hidden">
        <ReactFlowProvider>
          <EditorSidebar onDragStart={(event, nodeType) => {
            event.dataTransfer.setData('application/reactflow', nodeType);
            event.dataTransfer.effectAllowed = 'move';
          }} />
          
          <div className="flex-1 h-full relative" ref={reactFlowWrapper}>
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onInit={setReactFlowInstance}
              onDrop={onDrop}
              onDragOver={onDragOver}
              nodeTypes={nodeTypes}
              fitView
              className="bg-background"
            >
              <Background gap={12} size={1} />
              <Controls />
              <MiniMap 
                nodeStrokeColor={(n) => {
                  if (n.type === 'start') return 'var(--primary)';
                  if (n.type === 'message') return 'var(--muted-foreground)';
                  return '#eee';
                }}
                nodeColor={(n) => {
                  if (n.type === 'start') return 'var(--primary)';
                  return 'var(--card)';
                }}
              />
            </ReactFlow>
          </div>
        </ReactFlowProvider>
      </div>
    </div>
  );
}
