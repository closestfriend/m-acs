
import React from 'react';
import { DataStoreItem } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { Database, AlertTriangle, ShieldCheck, Flame } from 'lucide-react';

interface DataStoreProps {
  dataStore: DataStoreItem;
  isTargeted: boolean;
}

const DataStore: React.FC<DataStoreProps> = ({ dataStore, isTargeted }) => {
  const isUntrusted = dataStore.sourceTrust === 'untrusted';

  return (
    <div className="relative group perspective-1000">
      <motion.div 
        animate={{ 
          rotateX: isTargeted ? 4 : 0,
          scale: isTargeted ? 1.02 : 1,
          borderColor: dataStore.isExfiltrated 
            ? '#ef4444' 
            : isTargeted 
              ? '#22d3ee' 
              : isUntrusted 
                ? 'rgba(244,63,94,0.3)' 
                : 'rgba(255,255,255,0.08)'
        }}
        className={`relative p-3.5 bg-black/60 border-t-2 border-r-2 font-mono overflow-hidden transition-all duration-300 rounded-tr-lg ${
          isUntrusted ? 'ring-1 ring-rose-500/20' : ''
        }`}
      >
        {/* Aesthetic corner marks */}
        <div className="absolute top-1 right-1 w-1 h-1 bg-white/20 rounded-full" />
        <div className="absolute bottom-1 left-1 w-1 h-1 bg-white/20 rounded-full" />

        {/* Header: Title and Sensitivity */}
        <div className="flex justify-between items-start mb-2">
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5 mb-0.5">
              <span className="text-[8px] text-purple-400 font-black uppercase tracking-widest leading-none">
                Ingress_Resource
              </span>
              {isUntrusted && (
                <span className="px-1 py-0.2 bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[7px] font-bold rounded flex items-center gap-0.5">
                  <Flame size={8} /> UNTRUSTED
                </span>
              )}
            </div>
            <span className="text-[11px] text-gray-100 font-bold uppercase tracking-tight truncate max-w-[150px]">
              {dataStore.name}
            </span>
          </div>
          
          <div className={`text-[8px] font-black px-1.5 py-0.5 rounded border uppercase tracking-wider ${
            dataStore.sensitivity === 'restricted'
              ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
              : dataStore.sensitivity === 'confidential'
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                : 'bg-white/5 text-gray-400 border-white/10'
          }`}>
            {dataStore.sensitivity}
          </div>
        </div>

        {/* Micro-Telemetry Visualizer */}
        <div className="flex items-end gap-[2px] h-4 mb-2 opacity-40 group-hover:opacity-100 transition-opacity">
          {[...Array(14)].map((_, i) => (
            <motion.div 
              key={i}
              animate={{ height: isTargeted ? [3, 14, 3] : [2, 5, 2] }}
              transition={{ repeat: Infinity, duration: 1.4, delay: i * 0.08 }}
              className={`w-1 rounded-sm ${isUntrusted ? 'bg-rose-500/60' : 'bg-cyan-500/60'}`}
            />
          ))}
        </div>

        {/* Prompt Injection Alert Details */}
        {dataStore.hasInjectionPayload ? (
          <div className="p-1.5 bg-rose-950/40 border border-rose-500/30 rounded text-[7px] font-mono text-rose-200">
            <div className="flex items-center gap-1 text-rose-400 font-bold mb-0.5">
              <AlertTriangle size={9} />
              <span>INDIRECT PROMPT INJECTION PAYLOAD</span>
            </div>
            <p className="line-clamp-2 text-rose-300/80 italic">
              "{dataStore.injectionSnippet}"
            </p>
          </div>
        ) : (
          <div className="text-[8px] text-gray-500 flex justify-between uppercase">
            <span className="flex items-center gap-1 text-emerald-400/80">
              <ShieldCheck size={10} /> Verified Content
            </span>
            <span>Provenance: Clean</span>
          </div>
        )}

        {/* Compromise / Exfiltrated Overlay */}
        <AnimatePresence>
          {dataStore.isExfiltrated && (
            <motion.div 
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute inset-0 z-20 bg-red-950/80 flex flex-col items-center justify-center backdrop-blur-[2px]"
            >
              <div className="border border-red-500 px-2 py-1 rotate-[-8deg] text-red-400 text-[9px] font-black tracking-widest bg-black/90 shadow-[0_0_15px_rgba(239,68,68,0.5)]">
                EXFILTRATED_SEV5
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {isTargeted && (
          <div className="absolute top-0 right-0 w-6 h-6 pointer-events-none">
            <div className="absolute top-0 right-0 w-2 h-[2px] bg-cyan-400" />
            <div className="absolute top-0 right-0 w-[2px] h-2 bg-cyan-400" />
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default DataStore;
