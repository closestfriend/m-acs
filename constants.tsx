
import { Agent, DataStoreItem } from './types';

export const AGENT_ROLES = ['admin', 'user', 'auditor', 'guest'];
export const DATA_SENSITIVITY_LEVELS = ['public', 'internal', 'confidential', 'restricted'];

export const INITIAL_AGENTS: Agent[] = [
  { id: 'agent-1', name: 'Admin Alice', role: 'admin', permissions: ['read:all', 'write:all', 'delete:all'], status: 'idle' },
  { id: 'agent-2', name: 'User Bob', role: 'user', permissions: ['read:internal', 'read:public', 'write:internal'], status: 'idle' },
  { id: 'agent-3', name: 'Auditor Charlie', role: 'auditor', permissions: ['read:all'], status: 'idle' },
  { id: 'agent-4', name: 'Guest Dave', role: 'guest', permissions: ['read:public'], status: 'idle' },
  { id: 'agent-5', name: 'Insider Eve (Malicious)', role: 'user', permissions: ['read:internal', 'read:public', 'write:internal'], status: 'idle' },
];

export const INITIAL_DATA_STORES: DataStoreItem[] = [
  { id: 'data-1', name: 'Public Announcements', sensitivity: 'public', encryptionKeyId: 'key-public', isLeaked: false },
  { id: 'data-2', name: 'Internal Memos', sensitivity: 'internal', encryptionKeyId: 'key-internal', isLeaked: false },
  { id: 'data-3', name: 'Employee Records', sensitivity: 'confidential', encryptionKeyId: 'key-confidential', isLeaked: false },
  { id: 'data-4', name: 'Trade Secrets', sensitivity: 'restricted', encryptionKeyId: 'key-restricted', isLeaked: false },
];

export const SIMULATION_SPEED_MS = 3000; // 3 seconds per tick
