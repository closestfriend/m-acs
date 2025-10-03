
import React from 'react';
import type { DataStoreItem, DataSensitivity } from '../types';

interface DataStoreProps {
  dataStore: DataStoreItem;
  isTargeted: boolean;
}

const getSensitivityStyles = (sensitivity: DataSensitivity): { border: string; bg: string; text: string } => {
  switch (sensitivity) {
    case 'public':
      return { border: 'border-green-500/50', bg: 'bg-green-500/10', text: 'text-green-400' };
    case 'internal':
      return { border: 'border-blue-500/50', bg: 'bg-blue-500/10', text: 'text-blue-400' };
    case 'confidential':
      return { border: 'border-yellow-500/50', bg: 'bg-yellow-500/10', text: 'text-yellow-400' };
    case 'restricted':
      return { border: 'border-red-500/50', bg: 'bg-red-500/10', text: 'text-red-400' };
    default:
      return { border: 'border-gray-600', bg: 'bg-gray-800', text: 'text-gray-400' };
  }
};

const DataStore: React.FC<DataStoreProps> = ({ dataStore, isTargeted }) => {
  const styles = getSensitivityStyles(dataStore.sensitivity);

  return (
    <div className={`p-4 rounded-lg bg-gray-900 border-2 transition-all duration-300 ${isTargeted ? 'border-cyan-400 scale-105' : styles.border} ${dataStore.isLeaked ? 'animate-pulse border-red-500' : ''}`}>
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-white truncate">{dataStore.name}</h3>
        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${styles.bg} ${styles.text}`}>
          {dataStore.sensitivity}
        </span>
      </div>
       {dataStore.isLeaked && (
         <p className="mt-2 text-sm text-red-400 font-bold">DATA LEAKED!</p>
       )}
    </div>
  );
};

export default DataStore;
