
import React from 'react';
import type { Agent } from '../types';

interface AgentCardProps {
  agent: Agent;
}

const getStatusColor = (status: Agent['status']) => {
  switch (status) {
    case 'success': return 'border-green-500';
    case 'denied': return 'border-yellow-500';
    case 'requesting': return 'border-cyan-500 animate-pulse';
    default: return 'border-gray-700';
  }
};

const AgentCard: React.FC<AgentCardProps> = ({ agent }) => {
  return (
    <div className={`p-4 rounded-lg bg-gray-900 border ${getStatusColor(agent.status)} transition-all duration-300`}>
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-lg text-white">{agent.name}</h3>
        <span className="px-2 py-1 text-xs font-semibold text-cyan-200 bg-cyan-900/50 rounded-full">{agent.role}</span>
      </div>
      <div className="mt-2 text-sm text-gray-400 space-y-1">
        <p><strong>Status:</strong> <span className="capitalize">{agent.status}</span></p>
        <p className="truncate" title={agent.currentAction || 'No action'}><strong>Action:</strong> {agent.currentAction || 'N/A'}</p>
      </div>
    </div>
  );
};

export default AgentCard;
