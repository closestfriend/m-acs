
export type AgentRole = 'admin' | 'assistant' | 'auditor' | 'crawler' | 'adversary';

export type PredicateType = 
  | 'EXFILTRATION'         // Sev 5: Leaking credentials/secrets to external egress
  | 'UNTRUSTED_TO_ACTION' // Sev 5: Untrusted web/email content steering sensitive tool
  | 'CONFUSED_DEPUTY'     // Sev 3: Tool misuse without verified user intent
  | 'DESTRUCTIVE_WRITE'   // Sev 4: Deleting or overwriting critical files
  | 'COMPLIANT';          // Benign, verified safe tool execution

export type SeverityLevel = 1 | 2 | 3 | 4 | 5;

export type ToolSideEffect = 'READ' | 'WRITE' | 'EXEC' | 'SHARE';

export type SourceTrust = 'trusted' | 'untrusted';

export type TaintStatus = 'clean' | 'tainted';

export interface AgentMemory {
  interactionId: string;
  timestamp: string;
  tool: string;
  target: string;
  sideEffect: ToolSideEffect;
  verdict: 'grant' | 'block';
  predicate: PredicateType;
  severity: SeverityLevel;
  reasoning: string;
}

export interface Agent {
  id: string;
  name: string;
  role: AgentRole;
  permissions: string[];
  currentAction?: string;
  status: 'idle' | 'requesting' | 'blocked' | 'success' | 'hijacked';
  objectives: string[];
  memory: AgentMemory[];
  riskPropensity: number; // 0.0 to 1.0 (maliciousness/boldness)
  taintStatus: TaintStatus;
  injectedPrompt?: string;
}

export type DataSensitivity = 'public' | 'internal' | 'confidential' | 'restricted';

export interface DataStoreItem {
  id: string;
  name: string;
  sensitivity: DataSensitivity;
  sourceTrust: SourceTrust;
  hasInjectionPayload: boolean;
  injectionSnippet?: string;
  isExfiltrated: boolean;
}

export interface EgressSinkItem {
  id: string;
  name: string;
  protocol: 'http.post' | 'email.send' | 'fs.delete' | 'system.exec';
  riskLevel: 'critical' | 'high' | 'medium';
  description: string;
}

export type LogType = 
  | 'info' 
  | 'compliant' 
  | 'blocked' 
  | 'exfiltration' 
  | 'u2a' 
  | 'confused_deputy' 
  | 'tampering';

export interface LogEntry {
  id: number;
  timestamp: string;
  message: string;
  type: LogType;
  predicate?: PredicateType;
  severity?: SeverityLevel;
  agentName?: string;
  targetName?: string;
}

export interface Metrics {
  interactions: number;
  compliant: number;
  blocked: number;
  exfiltrations: number;      // Sev 5
  u2a: number;                // Sev 5 (Untrusted to Action)
  confusedDeputy: number;     // Sev 3
  destructiveWrite: number;   // Sev 4
}

export interface GuardrailDecision {
  verdict: 'grant' | 'block';
  triggeredPredicate: PredicateType;
  severity: SeverityLevel;
  sideEffect: ToolSideEffect;
  sourceTrust: SourceTrust;
  guardrailReasoning: string;
  thoughtProcess: string;
  alertLevel: 'low' | 'medium' | 'high' | 'critical';
}

export interface AgentActionRequest {
  tool: string;
  params: {
    resourceId: string;
    method: string;
    egressSinkId?: string;
    payloadData?: string;
  };
  sideEffect: ToolSideEffect;
  internalThought: string;
  isExploitedByInjection?: boolean;
}
