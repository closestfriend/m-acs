
import React, { useRef, useEffect } from 'react';
import { LogEntry } from '../types';
import { Terminal, ShieldCheck, ShieldAlert, Info, AlertTriangle, Radio, Flame, Trash2 } from 'lucide-react';

const LogPanel: React.FC<{ logs: LogEntry[] }> = ({ logs }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  const getLogStyles = (type: string) => {
    switch (type) {
      case 'compliant': 
        return 'border-emerald-500/20 bg-emerald-500/5 text-emerald-300';
      case 'blocked': 
        return 'border-purple-500/30 bg-purple-500/10 text-purple-300 ring-1 ring-purple-500/30';
      case 'exfiltration': 
        return 'border-rose-500 bg-rose-950/40 text-rose-300 font-bold ring-1 ring-rose-500/60';
      case 'u2a': 
        return 'border-amber-500 bg-amber-950/40 text-amber-300 font-bold ring-1 ring-amber-500/60';
      case 'confused_deputy': 
        return 'border-yellow-500/30 bg-yellow-500/10 text-yellow-300';
      case 'tampering': 
        return 'border-orange-500/30 bg-orange-500/10 text-orange-300';
      default: 
        return 'border-gray-800 bg-gray-900/40 text-gray-400';
    }
  };

  const getLogIcon = (type: string) => {
    switch (type) {
      case 'compliant': return <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />;
      case 'blocked': return <ShieldAlert className="w-3.5 h-3.5 text-purple-400" />;
      case 'exfiltration': return <Radio className="w-3.5 h-3.5 text-rose-400 animate-pulse" />;
      case 'u2a': return <Flame className="w-3.5 h-3.5 text-amber-400 animate-pulse" />;
      case 'confused_deputy': return <AlertTriangle className="w-3.5 h-3.5 text-yellow-400" />;
      case 'tampering': return <Trash2 className="w-3.5 h-3.5 text-orange-400" />;
      default: return <Info className="w-3.5 h-3.5 text-cyan-400" />;
    }
  };

  const getLogBadge = (log: LogEntry) => {
    if (log.predicate) {
      const sevColor = log.severity === 5 
        ? 'bg-rose-500/20 text-rose-300 border-rose-500/40' 
        : log.severity === 4 
          ? 'bg-orange-500/20 text-orange-300 border-orange-500/40'
          : log.severity === 3 
            ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40'
            : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';

      return (
        <span className={`text-[7px] font-mono px-1 py-0.2 rounded border uppercase font-black ${sevColor}`}>
          {log.predicate} {log.severity ? `[SEV ${log.severity}]` : ''}
        </span>
      );
    }
    return (
      <span className="text-[7px] font-mono opacity-50 uppercase tracking-tighter">
        {log.type}
      </span>
    );
  };

  return (
    <div className="flex flex-col h-full bg-black/40 border-l border-white/5 backdrop-blur-md">
      <div className="p-3.5 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-cyan-500" />
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-white/70">
            Runtime_Guardrail_Audit_Stream
          </h3>
        </div>
        <span className="text-[10px] font-mono text-gray-500">{logs.length} TRACES</span>
      </div>
      
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-3.5 space-y-2 font-mono scrollbar-hide"
      >
        {logs.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-gray-600 opacity-40">
            <Terminal size={32} />
            <p className="mt-3 text-[10px] uppercase tracking-widest text-center">
              Listening for Agent Tool Invocations...
            </p>
          </div>
        )}
        {logs.map((log) => (
          <div 
            key={log.id} 
            className={`p-2 rounded border transition-all duration-300 ${getLogStyles(log.type)}`}
          >
            <div className="flex items-start gap-2.5">
              <div className="shrink-0 mt-0.5">{getLogIcon(log.type)}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                  {getLogBadge(log)}
                  <span className="text-[8px] opacity-40 font-mono">{log.timestamp}</span>
                </div>
                <p className="text-[10px] leading-relaxed break-words font-mono">{log.message}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="p-2.5 bg-black/60 border-t border-white/5 flex items-center justify-between text-[8px] font-mono text-gray-500">
        <span className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          GUARDRAIL_INTERCEPTOR: ACTIVE
        </span>
        <span>JED_SPEC: v3.1</span>
      </div>
    </div>
  );
};

export default LogPanel;
