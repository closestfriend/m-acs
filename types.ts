
export type AgentRole = 'admin' | 'user' | 'auditor' | 'guest';

export interface Agent {
  id: string;
  name: string;
  role: AgentRole;
  permissions: string[];
  currentAction?: string;
  status: 'idle' | 'requesting' | 'denied' | 'success';
}

export type DataSensitivity = 'public' | 'internal' | 'confidential' | 'restricted';

export interface DataStoreItem {
  id: string;
  name: string;
  sensitivity: DataSensitivity;
  encryptionKeyId: string;
  isLeaked: boolean;
}

export type LogType = 'info' | 'success' | 'denied' | 'leak' | 'error' | 'decrypt-fail';

export interface LogEntry {
  id: number;
  timestamp: string;
  message: string;
  type: LogType;
}

export interface Metrics {
  interactions: number;
  success: number;
  denied: number;
  leaks: number;
  decryptionFailures: number;
}

export interface AccessDecision {
  reasoning: string;
  action: 'grant' | 'deny';
  isLeak: boolean;
  decryptionSuccess: boolean;
}
