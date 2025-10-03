
import React, { useRef, useEffect } from 'react';
import type { LogEntry, LogType } from '../types';

interface LogPanelProps {
  logs: LogEntry[];
}

const getLogTypeStyles = (type: LogType) => {
  switch (type) {
    case 'success': return 'text-green-400';
    case 'denied': return 'text-yellow-400';
    case 'leak': return 'text-red-400 font-bold';
    case 'error': return 'text-red-600';
    case 'decrypt-fail': return 'text-orange-400';
    case 'info': return 'text-gray-400';
    default: return 'text-gray-400';
  }
};

const LogPanel: React.FC<LogPanelProps> = ({ logs }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 h-96 flex flex-col">
      <h3 className="text-lg font-bold text-white mb-4">Activity Log</h3>
      <div ref={scrollRef} className="flex-grow overflow-y-auto pr-2">
        <ul className="space-y-2">
          {logs.map((log) => (
            <li key={log.id} className={`text-sm font-mono ${getLogTypeStyles(log.type)}`}>
              <span className="text-gray-500 mr-2">{log.timestamp}</span>
              {log.message}
            </li>
          ))}
          {logs.length === 0 && <li className="text-gray-500">Simulation not started.</li>}
        </ul>
      </div>
    </div>
  );
};

export default LogPanel;
