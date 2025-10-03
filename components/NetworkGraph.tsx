
import React from 'react';
import type { Agent, DataStoreItem } from '../types';

interface NetworkGraphProps {
  agents: Agent[];
  dataStores: DataStoreItem[];
  activeInteraction?: { agentId: string; dataStoreId: string };
}

const NetworkGraph: React.FC<NetworkGraphProps> = ({ agents, dataStores, activeInteraction }) => {
  const allNodes = [...agents, ...dataStores];
  const width = Math.max(800, agents.length * 150 + 50);
  const height = 250;

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 overflow-x-auto">
      <h3 className="text-lg font-bold text-white mb-4">System Overview</h3>
      <svg viewBox={`0 0 ${width} ${height}`} style={{ minWidth: `${width}px`}}>
        {/* Agent Nodes */}
        {agents.map((agent, i) => (
          <g key={agent.id} transform={`translate(${100 + i * 150}, 50)`}>
            <circle cx="0" cy="0" r="25" fill="#111827" stroke="#0891b2" strokeWidth="2" />
            <text x="0" y="5" fill="#e5e7eb" textAnchor="middle" fontSize="10">{agent.role}</text>
            <text x="0" y="45" fill="#9ca3af" textAnchor="middle" fontSize="12" className="truncate">{agent.name}</text>
          </g>
        ))}
        
        {/* Data Store Nodes */}
        {dataStores.map((ds, i) => (
          <g key={ds.id} transform={`translate(${100 + i * 150}, 180)`}>
             <rect x="-35" y="-15" width="70" height="30" fill="#1f2937" stroke="#374151" strokeWidth="2" rx="5" />
             <text x="0" y="0" dy=".3em" fill="#e5e7eb" textAnchor="middle" fontSize="10">{ds.name}</text>
             <text x="0" y="35" fill="#9ca3af" textAnchor="middle" fontSize="10">{ds.sensitivity}</text>
          </g>
        ))}

        {/* Interaction Line */}
        {activeInteraction && (() => {
          const agentIndex = agents.findIndex(a => a.id === activeInteraction.agentId);
          const dsIndex = dataStores.findIndex(d => d.id === activeInteraction.dataStoreId);
          if (agentIndex === -1 || dsIndex === -1) return null;

          const x1 = 100 + agentIndex * 150;
          const y1 = 50;
          const x2 = 100 + dsIndex * 150;
          const y2 = 180;
          
          const agentStatus = agents[agentIndex].status;
          let strokeColor = '#06b6d4'; // requesting
          if (agentStatus === 'success') strokeColor = '#22c55e';
          if (agentStatus === 'denied') strokeColor = '#eab308';
          
          return (
            <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={strokeColor} strokeWidth="2" strokeDasharray="5,5">
              <animate attributeName="stroke-dashoffset" from="10" to="0" dur="0.5s" repeatCount="indefinite" />
            </line>
          )
        })()}
      </svg>
    </div>
  );
};

export default NetworkGraph;
