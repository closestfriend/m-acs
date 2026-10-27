# m-acs

Interactive multi-agent access-control and runtime guardrail simulator built with React 19, ReactFlow, and the Gemini API.

Models four adversarial failure classes across a multi-agent topology:
1. **Indirect Prompt Injection**: Untrusted external payloads hijacking downstream tool calls.
2. **Untrusted-to-Action (U2A) Escalation**: Low-privilege context triggering high-privilege state mutations.
3. **Confused Deputy**: Delegate agents tricked into exercising authority on behalf of an unauthorized caller.
4. **Secret Exfiltration**: Sensitive store values leaking across agent message boundaries.

## Quickstart

```bash
npm install
# Create .env.local with GEMINI_API_KEY=your_key
npm run dev
```

## Structure

- `components/NetworkGraph.tsx`: ReactFlow topology of active agents, trust zones, and message edges.
- `components/SimulationDashboard.tsx`: Scenario runner and runtime policy toggle controls.
- `components/DataStore.tsx` & `LogPanel.tsx`: Live audit log of blocked vs. permitted access attempts.
- `services/geminiService.ts`: Agent turn execution and guardrail evaluation calls.
