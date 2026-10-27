
import React from 'react';
import { Agent } from '../types';
import { motion } from 'framer-motion';
import { Shield, User, Eye, AlertTriangle, Flame, Terminal } from 'lucide-react';

const AgentCard: React.FC<{ agent: Agent }> = ({ agent }) => {
  const isActive = agent.status === 'requesting';
  const isBlocked = agent.status === 'blocked';
  const isSuccess = agent.status === 'success';
  const isTainted = agent.taintStatus === 'tainted';
  const isAdversary = agent.role === 'adversary';

  const getRoleIcon = () => {
    switch (agent.role) {
      case 'admin': return <Shield size={12} className="text-cyan-400" />;
      case 'auditor': return <Eye size={12} className="text-purple-400" />;
      case 'adversary': return <AlertTriangle size={12} className="text-rose-400" />;
      case 'crawler': return <Terminal size={12} className="text-emerald-400" />;
      default: return <User size={12} className="text-blue-400" />;
    }
  };

  return (
    <motion.div 
      initial={false}
      animate={{ 
        borderColor: isActive 
          ? '#22d3ee' 
          : isBlocked 
            ? '#f43f5e' 
            : isSuccess 
              ? '#10b981' 
              : isTainted 
                ? 'rgba(251,191,36,0.4)' 
                : 'rgba(255,255,255,0.08)',
        backgroundColor: isActive 
          ? 'rgba(6,182,212,0.08)' 
          : isTainted 
            ? 'rgba(245,158,11,0.05)' 
            : 'rgba(0,0,0,0.5)'
      }}
      className={`relative p-3 border-l-4 font-mono overflow-hidden transition-all duration-300 rounded-r-lg ${
        isTainted ? 'ring-1 ring-amber-500/30' : ''
      }`}
    >
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[length:10px_10px] bg-[linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)]" />

      {/* Header: ID & Role */}
      <div className="flex justify-between items-start mb-2">
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            {getRoleIcon()}
            <span className="text-[11px] text-white font-black truncate max-w-[110px]">{agent.name}</span>
          </div>
          <span className="text-[8px] text-gray-500 uppercase tracking-widest mt-0.5">{agent.role}</span>
        </div>
        
        <div className={`text-[8px] font-mono px-1.5 py-0.5 rounded font-bold uppercase tracking-wider ${
          isTainted 
            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse' 
            : isAdversary 
              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
              : 'bg-white/5 text-gray-400 border border-white/10'
        }`}>
          {isTainted ? '☣️ TAINTED' : agent.taintStatus}
        </div>
      </div>

      {/* Risk / Attack Propensity Meter */}
      <div className="mb-2">
        <div className="flex justify-between items-center text-[7px] font-mono uppercase text-gray-500 mb-1">
          <span>Adversarial Risk</span>
          <span className={agent.riskPropensity > 0.6 ? 'text-rose-400 font-bold' : 'text-cyan-400'}>
            {(agent.riskPropensity * 100).toFixed(0)}%
          </span>
        </div>
        <div className="relative h-1 w-full bg-white/5 rounded-full overflow-hidden">
          <motion.div 
            className={`absolute h-full rounded-full ${
              agent.riskPropensity > 0.6 
                ? 'bg-rose-500 shadow-[0_0_8px_#f43f5e]' 
                : 'bg-cyan-500 shadow-[0_0_8px_#06b6d4]'
            }`}
            animate={{ width: `${agent.riskPropensity * 100}%` }}
          />
        </div>
      </div>

      {/* Tool Permissions & Memory Counters */}
      <div className="flex flex-wrap gap-1 mb-2">
        {agent.permissions.slice(0, 3).map((perm, i) => (
          <span key={i} className="text-[7px] font-mono px-1 py-0.2 bg-white/5 text-gray-400 rounded border border-white/5">
            {perm}
          </span>
        ))}
        {agent.permissions.length > 3 && (
          <span className="text-[7px] font-mono px-1 text-gray-600">+{agent.permissions.length - 3}</span>
        )}
      </div>

      {/* Active Thought / Action Snippet */}
      {agent.currentAction && (
        <div className="mt-1 p-1.5 bg-black/50 border border-white/5 rounded text-[8px] text-gray-400 font-mono truncate">
          <span className="text-cyan-400 font-bold mr-1">&gt;</span>
          {agent.currentAction}
        </div>
      )}

      {/* Injected payload banner if tainted */}
      {isTainted && agent.injectedPrompt && (
        <div className="mt-1 p-1 bg-amber-500/10 border border-amber-500/30 rounded text-[7px] text-amber-300 font-mono truncate flex items-center gap-1">
          <Flame size={9} className="shrink-0 text-amber-400" />
          <span className="truncate">Injected: {agent.injectedPrompt}</span>
        </div>
      )}
    </motion.div>
  );
};

export default AgentCard;
