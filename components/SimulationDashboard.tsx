
import React, { useState, useEffect, useRef, useCallback } from 'react';
import type { Agent, DataStoreItem, LogEntry, Metrics, LogType } from '../types';
import { INITIAL_AGENTS, INITIAL_DATA_STORES, SIMULATION_SPEED_MS } from '../constants';
import { getAccessDecision } from '../services/geminiService';
import AgentCard from './AgentCard';
import DataStore from './DataStore';
import LogPanel from './LogPanel';
import MetricsDisplay from './MetricsDisplay';
import NetworkGraph from './NetworkGraph';

const SimulationDashboard: React.FC = () => {
  const [agents, setAgents] = useState<Agent[]>(INITIAL_AGENTS);
  const [dataStores, setDataStores] = useState<DataStoreItem[]>(INITIAL_DATA_STORES);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [metrics, setMetrics] = useState<Metrics>({
    interactions: 0,
    success: 0,
    denied: 0,
    leaks: 0,
    decryptionFailures: 0,
  });
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [activeInteraction, setActiveInteraction] = useState<{ agentId: string, dataStoreId: string } | undefined>();
  
  const logCounter = useRef(0);

  const addLog = useCallback((message: string, type: LogType) => {
    setLogs(prev => [...prev.slice(-100), {
      id: logCounter.current++,
      timestamp: new Date().toLocaleTimeString(),
      message,
      type
    }]);
  }, []);

  const runSimulationStep = useCallback(async () => {
    // 1. Pick a random agent and data store
    const agent = agents[Math.floor(Math.random() * agents.length)];
    const dataStore = dataStores[Math.floor(Math.random() * dataStores.length)];

    const actionDescription = `Requesting access to "${dataStore.name}"`;
    setActiveInteraction({ agentId: agent.id, dataStoreId: dataStore.id });
    setAgents(prev => prev.map(a => a.id === agent.id ? { ...a, status: 'requesting', currentAction: actionDescription } : { ...a, status: 'idle', currentAction: undefined }));
    addLog(`Agent "${agent.name}" is requesting access to "${dataStore.name}".`, 'info');

    // 2. Get decision from Gemini
    const decision = await getAccessDecision(agent, dataStore);

    // 3. Update state based on decision
    setMetrics(prev => ({ ...prev, interactions: prev.interactions + 1 }));

    if (decision.action === 'grant') {
        if (decision.decryptionSuccess) {
            setAgents(prev => prev.map(a => a.id === agent.id ? { ...a, status: 'success' } : a));
            setMetrics(prev => ({ ...prev, success: prev.success + 1 }));
            addLog(`✅ Access GRANTED for "${agent.name}" to "${dataStore.name}". Reason: ${decision.reasoning}`, 'success');
            
            if (decision.isLeak) {
                setMetrics(prev => ({ ...prev, leaks: prev.leaks + 1 }));
                setDataStores(prev => prev.map(ds => ds.id === dataStore.id ? { ...ds, isLeaked: true } : ds));
                addLog(`🚨 DATA LEAK! "${agent.name}" exfiltrated "${dataStore.name}".`, 'leak');
            }
        } else {
            setAgents(prev => prev.map(a => a.id === agent.id ? { ...a, status: 'denied' } : a));
            setMetrics(prev => ({ ...prev, decryptionFailures: prev.decryptionFailures + 1 }));
            addLog(`🔐 Decryption FAILED for "${agent.name}" on "${dataStore.name}". Reason: ${decision.reasoning}`, 'decrypt-fail');
        }
    } else { // Deny
      setAgents(prev => prev.map(a => a.id === agent.id ? { ...a, status: 'denied' } : a));
      setMetrics(prev => ({ ...prev, denied: prev.denied + 1 }));
      addLog(`❌ Access DENIED for "${agent.name}" to "${dataStore.name}". Reason: ${decision.reasoning}`, 'denied');
    }
  }, [agents, dataStores, addLog]);


  useEffect(() => {
    if (isRunning) {
      const interval = setInterval(() => {
        runSimulationStep();
      }, SIMULATION_SPEED_MS);
      return () => clearInterval(interval);
    }
  }, [isRunning, runSimulationStep]);
  
  const handleReset = () => {
    setIsRunning(false);
    setAgents(INITIAL_AGENTS);
    setDataStores(INITIAL_DATA_STORES);
    setLogs([]);
    setMetrics({ interactions: 0, success: 0, denied: 0, leaks: 0, decryptionFailures: 0 });
    setActiveInteraction(undefined);
    logCounter.current = 0;
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <h2 className="text-xl font-semibold text-white">Simulation Control</h2>
        <div className="flex gap-4">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className={`px-6 py-2 rounded-md font-bold text-white transition-colors ${isRunning ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-cyan-600 hover:bg-cyan-700'}`}
          >
            {isRunning ? 'Pause Simulation' : 'Start Simulation'}
          </button>
          <button
            onClick={handleReset}
            className="px-6 py-2 rounded-md font-bold bg-gray-700 hover:bg-gray-600 text-white transition-colors"
          >
            Reset
          </button>
        </div>
      </div>

      <MetricsDisplay metrics={metrics} />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
            <div>
              <h3 className="text-xl font-semibold text-white mb-4">Agents</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {agents.map(agent => <AgentCard key={agent.id} agent={agent} />)}
              </div>
            </div>
             <div>
              <h3 className="text-xl font-semibold text-white mb-4">Data Stores</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                {dataStores.map(ds => <DataStore key={ds.id} dataStore={ds} isTargeted={activeInteraction?.dataStoreId === ds.id} />)}
              </div>
            </div>
            <NetworkGraph agents={agents} dataStores={dataStores} activeInteraction={activeInteraction} />
        </div>
        <div className="lg:col-span-1">
          <LogPanel logs={logs} />
        </div>
      </div>
    </div>
  );
};

export default SimulationDashboard;
