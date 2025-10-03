import React from 'react';
import type { Metrics } from '../types';

interface MetricsDisplayProps {
  metrics: Metrics;
}

// Fix: Replaced `JSX.Element` with `React.ReactElement` to fix 'Cannot find namespace \'JSX\'' error.
const StatCard: React.FC<{ title: string; value: string | number; className?: string; icon: React.ReactElement }> = ({ title, value, className, icon }) => (
  <div className={`p-4 rounded-lg bg-gray-900 border border-gray-800 flex items-start gap-4 ${className}`}>
    <div className="p-2 bg-gray-800 rounded-md">{icon}</div>
    <div>
        <p className="text-sm font-medium text-gray-400">{title}</p>
        <p className="text-3xl font-bold">{value}</p>
    </div>
  </div>
);

const LeakIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-red-400" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>;
const SuccessIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-green-400" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>;
const DeniedIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-yellow-400" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM4 12c0-4.42 3.58-8 8-8s8 3.58 8 8-3.58 8-8 8-8-3.58-8-8zm11 0c0 .55-.45 1-1 1H8c-.55 0-1-.45-1-1s.45-1 1-1h6c.55 0 1 .45 1 1z"/></svg>;
const DecryptFailIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-orange-400" viewBox="0 0 24 24" fill="currentColor"><path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM9 6c0-1.66 1.34-3 3-3s3 1.34 3 3v2H9V6zm4.12 9.47L12 18l-1.12-2.53L8.35 14.4l2.53-1.12L12 10.75l1.12 2.53 2.53 1.12-2.53 1.07z"/></svg>;
const TotalIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-cyan-400" viewBox="0 0 24 24" fill="currentColor"><path d="M3 3h18v2H3V3zm0 4h18v2H3V7zm0 4h18v2H3v-2zm0 4h18v2H3v-2zm0 4h18v2H3v-2z"/></svg>;


const MetricsDisplay: React.FC<MetricsDisplayProps> = ({ metrics }) => {
  const leakRate = metrics.interactions > 0 ? ((metrics.leaks / metrics.interactions) * 100).toFixed(1) : '0.0';
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      <StatCard title="Leak Rate" value={`${leakRate}%`} icon={<LeakIcon/>} className="text-red-400" />
      <StatCard title="Successful Access" value={metrics.success} icon={<SuccessIcon/>} className="text-green-400" />
      <StatCard title="Access Denied" value={metrics.denied} icon={<DeniedIcon/>} className="text-yellow-400" />
      <StatCard title="Decryption Failures" value={metrics.decryptionFailures} icon={<DecryptFailIcon/>} className="text-orange-400" />
      <StatCard title="Total Interactions" value={metrics.interactions} icon={<TotalIcon/>} className="text-cyan-400" />
    </div>
  );
};

export default MetricsDisplay;
