
import React from 'react';
import SimulationDashboard from './components/SimulationDashboard';
import { Shield, Cpu, Activity, Terminal, ShieldAlert } from 'lucide-react';

function App() {
  return (
    <div className="min-h-screen bg-[#050505] text-gray-300 font-mono selection:bg-cyan-500/30 selection:text-cyan-200 overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Synthetic Scanlines */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.02),rgba(0,255,0,0.01),rgba(0,0,255,0.02))] z-50 bg-[length:100%_2px,3px_100%] pointer-events-none" />
        
        {/* Subtle radial depth */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.85)_100%)] z-40" />
        
        {/* Grid Floor */}
        <div className="absolute bottom-0 left-0 right-0 h-[30%] bg-[linear-gradient(to_bottom,transparent,rgba(6,182,212,0.05))] [mask-image:linear-gradient(to_top,black,transparent)]" />
      </div>

      <header className="relative z-50 border-b border-white/10 bg-black/70 backdrop-blur-md">
        <div className="container mx-auto px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex flex-col">
              <div className="flex items-center gap-2.5">
                <ShieldAlert className="w-4 h-4 text-cyan-400" />
                <h1 className="text-sm font-black text-white uppercase tracking-[0.35em]">
                  Agent_Security_<span className="text-cyan-400">Simulation</span>
                </h1>
                <span className="text-[8px] font-mono px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 font-bold uppercase">
                  Runtime_Guardrail_v3.1
                </span>
              </div>
              <div className="flex items-center gap-4 mt-1">
                <div className="flex items-center gap-1.5 text-[9px] text-gray-400 font-bold uppercase tracking-tight">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Policy_Engine: [ARMED]
                </div>
                <div className="h-2 w-px bg-white/10" />
                <div className="text-[9px] text-gray-500 font-mono">
                  Benchmark: JED_AGENT_SECURITY_SPEC
                </div>
                <div className="h-2 w-px bg-white/10" />
                <div className="text-[9px] text-gray-500 font-mono hidden md:block">
                  Threats: Indirect Injection, U2A, Confused Deputy, Exfiltration
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="hidden lg:flex flex-col items-end opacity-60 hover:opacity-100 transition-opacity">
              <span className="text-[8px] text-cyan-400 font-black uppercase tracking-widest">Architecture</span>
              <span className="text-[10px] font-bold text-gray-200">IN-LINE_TOOL_GUARDRAIL</span>
            </div>
            <div className="relative p-2 bg-white/[0.03] border border-white/10 rounded-lg overflow-hidden group">
              <div className="absolute inset-0 bg-cyan-500/10 -translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
              <Cpu className="w-4 h-4 text-cyan-400 relative z-10" />
            </div>
          </div>
        </div>
      </header>

      <main className="relative z-10 container mx-auto px-6 pt-6 pb-4">
        <SimulationDashboard />
      </main>

      {/* Global Aesthetics */}
      <style dangerouslySetInnerHTML={{ __html: `
        @font-face {
            font-family: 'JetBrains Mono';
            src: url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700;800&display=swap');
        }
        body {
            font-family: 'JetBrains Mono', monospace;
            cursor: crosshair;
        }
        @keyframes loading {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(400%); }
        }
        .perspective-1000 {
            perspective: 1000px;
        }
      `}} />
    </div>
  );
}

export default App;
