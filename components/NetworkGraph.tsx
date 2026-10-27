
import React, { useMemo } from 'react';
import ReactFlow, { 
  Background, 
  Handle, 
  Position, 
  NodeProps, 
  Edge, 
  Node,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Agent, DataStoreItem, EgressSinkItem, GuardrailDecision } from '../types';
import { 
  Shield, 
  Database, 
  User, 
  Eye, 
  Globe, 
  Send, 
  Terminal, 
  AlertTriangle, 
  ShieldAlert, 
  ShieldCheck,
  Flame,
  Radio
} from 'lucide-react';

// ==========================================
// CUSTOM NODES
// ==========================================

const DataStoreNode = ({ data }: NodeProps<{ ds: DataStoreItem; isActive: boolean }>) => {
  const { ds, isActive } = data;
  const isUntrusted = ds.sourceTrust === 'untrusted';

  return (
    <div className={`p-2.5 rounded-lg border transition-all duration-300 w-[170px] ${
      isActive 
        ? isUntrusted
          ? 'bg-rose-950/40 border-rose-400 shadow-[0_0_18px_rgba(244,63,94,0.5)]'
          : 'bg-cyan-950/40 border-cyan-400 shadow-[0_0_18px_rgba(6,182,212,0.4)]'
        : 'bg-gray-950/90 border-white/10 opacity-75'
    } ${ds.isExfiltrated ? 'border-red-500 bg-red-950/30' : ''}`}>
      <Handle type="source" position={Position.Right} className="!bg-cyan-500 !w-2 !h-2 !border-0" />
      
      <div className="flex items-start justify-between gap-1.5 mb-1.5">
        <div className="flex items-center gap-1.5">
          <div className={isUntrusted ? 'text-amber-400' : 'text-cyan-400'}>
            {isUntrusted ? <Flame size={13} className="animate-pulse text-rose-400" /> : <Database size={13} />}
          </div>
          <span className="text-[10px] font-black text-gray-200 tracking-tight truncate max-w-[100px]">
            {ds.name}
          </span>
        </div>
        <span className={`text-[7px] font-mono px-1 py-0.5 rounded uppercase font-black ${
          isUntrusted ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' : 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
        }`}>
          {ds.sourceTrust}
        </span>
      </div>

      <div className="flex items-center justify-between text-[8px] font-mono text-gray-500">
        <span className="uppercase tracking-tighter">[{ds.sensitivity}]</span>
        {ds.hasInjectionPayload && (
          <span className="text-amber-400 flex items-center gap-0.5 font-bold animate-pulse">
            <AlertTriangle size={9} /> POISONED
          </span>
        )}
      </div>
    </div>
  );
};

const AgentNode = ({ data }: NodeProps<{ agent: Agent; isActive: boolean }>) => {
  const { agent, isActive } = data;
  const isTainted = agent.taintStatus === 'tainted';
  const isAdversary = agent.role === 'adversary';

  return (
    <div className={`p-2.5 rounded-lg border transition-all duration-300 w-[170px] ${
      isActive 
        ? isTainted || isAdversary
          ? 'bg-rose-950/50 border-rose-500 shadow-[0_0_20px_rgba(244,63,94,0.6)]'
          : 'bg-cyan-950/50 border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.5)]'
        : 'bg-gray-950/90 border-white/10 opacity-80'
    } ${isTainted ? 'ring-1 ring-amber-500/60' : ''}`}>
      <Handle type="target" position={Position.Left} className="!bg-cyan-500 !w-2 !h-2 !border-0" />
      <Handle type="source" position={Position.Right} className="!bg-purple-500 !w-2 !h-2 !border-0" />

      <div className="flex items-center justify-between gap-1.5 mb-1.5">
        <div className="flex items-center gap-1.5 truncate">
          <div className={isAdversary ? 'text-red-400' : isTainted ? 'text-amber-400' : 'text-cyan-400'}>
            {isAdversary ? <AlertTriangle size={13} /> : agent.role === 'auditor' ? <Eye size={13} /> : <User size={13} />}
          </div>
          <span className="text-[10px] font-black text-gray-200 tracking-tight truncate max-w-[90px]">
            {agent.name}
          </span>
        </div>
        <span className={`text-[7px] font-mono px-1 py-0.5 rounded font-black uppercase ${
          isAdversary ? 'bg-red-500/20 text-red-300' : 'bg-white/5 text-gray-400'
        }`}>
          {agent.role}
        </span>
      </div>

      <div className="flex items-center justify-between text-[8px] font-mono">
        <span className="text-gray-500">Risk: {(agent.riskPropensity * 100).toFixed(0)}%</span>
        <span className={`font-black ${isTainted ? 'text-amber-400 animate-pulse' : 'text-emerald-400'}`}>
          {isTainted ? '☣️ TAINTED' : 'CLEAN'}
        </span>
      </div>
    </div>
  );
};

const GuardrailBarrierNode = ({ data }: NodeProps<{ status: 'idle' | 'blocking' | 'granting'; reasoning?: string }>) => {
  const { status, reasoning } = data;
  return (
    <div className={`p-3 rounded-xl border flex flex-col items-center justify-center text-center transition-all duration-300 w-[130px] ${
      status === 'blocking'
        ? 'bg-rose-950/80 border-rose-500 shadow-[0_0_25px_rgba(244,63,94,0.7)] animate-pulse'
        : status === 'granting'
          ? 'bg-emerald-950/60 border-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.5)]'
          : 'bg-black/80 border-purple-500/40 text-purple-400'
    }`}>
      <Handle type="target" position={Position.Left} className="!bg-purple-500 !w-2 !h-2 !border-0" />
      <Handle type="source" position={Position.Right} className="!bg-purple-500 !w-2 !h-2 !border-0" />

      <div className="mb-1">
        {status === 'blocking' ? (
          <ShieldAlert size={20} className="text-rose-400 animate-bounce" />
        ) : status === 'granting' ? (
          <ShieldCheck size={20} className="text-emerald-400" />
        ) : (
          <Shield size={20} className="text-purple-400" />
        )}
      </div>
      <span className="text-[9px] font-black uppercase tracking-widest text-white leading-none">
        Guardrail
      </span>
      <span className="text-[7px] text-gray-400 uppercase font-mono mt-0.5">
        Policy_Barrier
      </span>
    </div>
  );
};

const EgressSinkNode = ({ data }: NodeProps<{ sink: EgressSinkItem; isActive: boolean; isBlocked?: boolean }>) => {
  const { sink, isActive, isBlocked } = data;

  return (
    <div className={`p-2.5 rounded-lg border transition-all duration-300 w-[170px] ${
      isActive
        ? isBlocked
          ? 'bg-rose-950/30 border-rose-500/50 opacity-60'
          : 'bg-emerald-950/40 border-emerald-400 shadow-[0_0_18px_rgba(16,185,129,0.5)]'
        : 'bg-gray-950/90 border-white/10 opacity-75'
    }`}>
      <Handle type="target" position={Position.Left} className="!bg-purple-500 !w-2 !h-2 !border-0" />

      <div className="flex items-center justify-between gap-1.5 mb-1.5">
        <div className="flex items-center gap-1.5">
          <div className="text-purple-400">
            {sink.protocol === 'http.post' ? <Radio size={13} /> : sink.protocol === 'email.send' ? <Send size={13} /> : <Terminal size={13} />}
          </div>
          <span className="text-[10px] font-black text-gray-200 tracking-tight truncate max-w-[100px]">
            {sink.name}
          </span>
        </div>
        <span className="text-[7px] font-mono px-1 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/20 font-black">
          {sink.protocol}
        </span>
      </div>

      <div className="text-[8px] font-mono text-gray-500 truncate">
        {sink.description}
      </div>
    </div>
  );
};

const nodeTypes = {
  dataStore: DataStoreNode,
  agent: AgentNode,
  guardrail: GuardrailBarrierNode,
  egressSink: EgressSinkNode
};

interface NetworkGraphProps {
  agents: Agent[];
  dataStores: DataStoreItem[];
  egressSinks: EgressSinkItem[];
  activeInteraction?: {
    agentId: string;
    resourceId?: string;
    sinkId?: string;
    isBlocked?: boolean;
    predicate?: string;
  };
  lastDecision?: GuardrailDecision;
}

const NetworkGraph: React.FC<NetworkGraphProps> = ({ 
  agents, 
  dataStores, 
  egressSinks, 
  activeInteraction,
  lastDecision 
}) => {
  const nodes: Node[] = useMemo(() => {
    // 1. Data Stores (Left Column: x = 20)
    const dsNodes: Node[] = dataStores.map((ds, i) => ({
      id: ds.id,
      type: 'dataStore',
      data: { ds, isActive: activeInteraction?.resourceId === ds.id },
      position: { x: 20, y: i * 72 + 10 },
    }));

    // 2. Agents (Middle Column: x = 270)
    const agentNodes: Node[] = agents.map((agent, i) => ({
      id: agent.id,
      type: 'agent',
      data: { agent, isActive: activeInteraction?.agentId === agent.id },
      position: { x: 260, y: i * 62 + 10 },
    }));

    // 3. Central Guardrail Barrier Node (Center-Right: x = 490)
    const guardrailNode: Node = {
      id: 'guardrail-barrier',
      type: 'guardrail',
      data: {
        status: activeInteraction?.isBlocked ? 'blocking' : activeInteraction ? 'granting' : 'idle',
        reasoning: lastDecision?.guardrailReasoning
      },
      position: { x: 480, y: 120 }
    };

    // 4. Egress Sinks (Right Column: x = 670)
    const sinkNodes: Node[] = egressSinks.map((sink, i) => ({
      id: sink.id,
      type: 'egressSink',
      data: { 
        sink, 
        isActive: activeInteraction?.sinkId === sink.id,
        isBlocked: activeInteraction?.sinkId === sink.id && activeInteraction?.isBlocked
      },
      position: { x: 670, y: i * 85 + 40 },
    }));

    return [...dsNodes, ...agentNodes, guardrailNode, ...sinkNodes];
  }, [agents, dataStores, egressSinks, activeInteraction, lastDecision]);

  const edges: Edge[] = useMemo(() => {
    if (!activeInteraction) return [];

    const activeEdges: Edge[] = [];
    const isBlocked = activeInteraction.isBlocked;

    // Edge 1: Data Store -> Agent (Ingestion / Read)
    if (activeInteraction.resourceId) {
      activeEdges.push({
        id: `edge-ds-${activeInteraction.agentId}`,
        source: activeInteraction.resourceId,
        target: activeInteraction.agentId,
        animated: true,
        style: { stroke: '#06b6d4', strokeWidth: 2.5 },
      });
    }

    // Edge 2: Agent -> Guardrail Barrier
    activeEdges.push({
      id: `edge-agent-guardrail-${activeInteraction.agentId}`,
      source: activeInteraction.agentId,
      target: 'guardrail-barrier',
      animated: true,
      style: { 
        stroke: isBlocked ? '#f43f5e' : '#a855f7', 
        strokeWidth: isBlocked ? 3 : 2,
        strokeDasharray: isBlocked ? '5,5' : undefined 
      },
    });

    // Edge 3: Guardrail -> Egress Sink (if target sink specified)
    if (activeInteraction.sinkId) {
      if (isBlocked) {
        // Blocked: Show severed red dashed line
        activeEdges.push({
          id: `edge-guardrail-sink-blocked`,
          source: 'guardrail-barrier',
          target: activeInteraction.sinkId,
          animated: false,
          style: { stroke: '#f43f5e', strokeWidth: 2, opacity: 0.3, strokeDasharray: '4,4' },
        });
      } else {
        // Permitted: Show clean emerald line to sink
        activeEdges.push({
          id: `edge-guardrail-sink-granted`,
          source: 'guardrail-barrier',
          target: activeInteraction.sinkId,
          animated: true,
          style: { stroke: '#10b981', strokeWidth: 2.5 },
        });
      }
    }

    return activeEdges;
  }, [activeInteraction]);

  return (
    <div className="h-[320px] w-full relative bg-black/40">
      <div className="absolute top-3 left-4 z-10 flex items-center justify-between right-4 pointer-events-none">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          <h3 className="text-[9px] font-black text-white/50 uppercase tracking-[0.3em]">
            Multi-Agent Perimeter Topology // Provenance Flow
          </h3>
        </div>
        <div className="flex items-center gap-4 text-[8px] font-mono text-gray-500">
          <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 bg-cyan-400 rounded-full" /> Ingress / Read</span>
          <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 bg-purple-400 rounded-full" /> Policy Audit</span>
          <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 bg-rose-500 rounded-full" /> Intercepted</span>
        </div>
      </div>
      
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.15 }}
        proOptions={{ hideAttribution: true }}
        draggable={false}
        panOnDrag={false}
        zoomOnScroll={false}
      >
        <Background color="#ffffff" gap={20} size={0.5} style={{ opacity: 0.03 }} />
      </ReactFlow>
    </div>
  );
};

export default NetworkGraph;
