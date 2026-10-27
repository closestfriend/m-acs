
import React from 'react';
import { Metrics } from '../types';
import { Activity, ShieldCheck, ShieldAlert, AlertTriangle, Radio, Flame, Trash2 } from 'lucide-react';

const MetricsDisplay: React.FC<{ metrics: Metrics }> = ({ metrics }) => {
  const items = [
    { 
      label: 'Invocations', 
      value: metrics.interactions, 
      icon: <Activity size={12} className="text-cyan-400" />,
      tag: 'TOTAL'
    },
    { 
      label: 'Compliant', 
      value: metrics.compliant, 
      icon: <ShieldCheck size={12} className="text-emerald-400" />,
      tag: 'SAFE'
    },
    { 
      label: 'Guardrail Blocks', 
      value: metrics.blocked, 
      icon: <ShieldAlert size={12} className="text-purple-400" />,
      tag: 'MITIGATED'
    },
    { 
      label: 'Exfiltration (Sev 5)', 
      value: metrics.exfiltrations, 
      icon: <Radio size={12} className="text-rose-400" />,
      tag: 'SEV 5'
    },
    { 
      label: 'U2A Hijacks (Sev 5)', 
      value: metrics.u2a, 
      icon: <Flame size={12} className="text-amber-400" />,
      tag: 'SEV 5'
    },
    { 
      label: 'Confused Deputy (Sev 3)', 
      value: metrics.confusedDeputy, 
      icon: <AlertTriangle size={12} className="text-yellow-400" />,
      tag: 'SEV 3'
    },
    { 
      label: 'Tampering (Sev 4)', 
      value: metrics.destructiveWrite, 
      icon: <Trash2 size={12} className="text-orange-400" />,
      tag: 'SEV 4'
    },
  ];

  return (
    <div className="flex items-center gap-3 xl:gap-5 flex-wrap">
      {items.map((item, i) => (
        <div key={i} className="flex items-center gap-2 group bg-white/[0.02] px-2.5 py-1 rounded border border-white/5 hover:border-white/10 transition-colors">
          <div className="p-1 bg-black/40 rounded">
            {item.icon}
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-[13px] font-black text-white font-mono leading-none">{item.value}</span>
              <span className="text-[7px] font-mono px-1 rounded bg-white/5 text-gray-400">{item.tag}</span>
            </div>
            <span className="text-[8px] uppercase tracking-tighter text-gray-400 font-bold mt-0.5">{item.label}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MetricsDisplay;
