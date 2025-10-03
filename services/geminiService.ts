
import { GoogleGenAI, Type } from "@google/genai";
import type { Agent, DataStoreItem, AccessDecision } from '../types';

// Initialize the GoogleGenAI client with the API key from environment variables.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Define the JSON schema for the expected response from the Gemini model.
const decisionSchema = {
  type: Type.OBJECT,
  properties: {
    reasoning: {
      type: Type.STRING,
      description: "A brief explanation for the access decision, considering the agent's role, permissions, data sensitivity, and potential threats."
    },
    action: {
      type: Type.STRING,
      description: "The access control decision. Must be 'grant' or 'deny'."
    },
    isLeak: {
      type: Type.BOOLEAN,
      description: "Set to true if this access attempt represents a data leak or a malicious exfiltration attempt, otherwise false."
    },
    decryptionSuccess: {
        type: Type.BOOLEAN,
        description: "Set to true if the agent has the correct credentials to decrypt the data, false otherwise. Admins and Auditors can always decrypt."
    }
  },
  required: ["reasoning", "action", "isLeak", "decryptionSuccess"]
};


export async function getAccessDecision(agent: Agent, data: DataStoreItem): Promise<AccessDecision> {
  const prompt = `
    Analyze the following access control scenario and determine the outcome.

    **Scenario:**
    - **Agent:** ${agent.name}
    - **Agent Role:** ${agent.role}
    - **Agent Permissions:** ${agent.permissions.join(', ')}
    - **Requested Data:** ${data.name}
    - **Data Sensitivity:** ${data.sensitivity}

    **Context:**
    This is a security simulation. The goal is to enforce the principle of least privilege and prevent data leaks.
    - 'Admin' can access everything.
    - 'User' can access 'public' and 'internal' data.
    - 'Auditor' has read-only access to everything for compliance checks.
    - 'Guest' can only access 'public' data.
    - The agent 'Insider Eve (Malicious)' will attempt to exfiltrate data they shouldn't access, even if their base role ('user') might seem to grant it. Be extra suspicious of their requests for 'confidential' or 'restricted' data.
    - Assume an agent with a valid role might not have the correct decryption keys for higher sensitivity data unless they are an 'admin' or 'auditor'. For example, a 'user' might be able to access 'internal' data but fail to decrypt 'confidential' data.

    Based on this, provide a JSON response detailing your decision.
  `;

  try {
    // Call the Gemini API to generate content based on the prompt and schema.
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: decisionSchema,
        temperature: 0.7,
      },
    });

    const jsonText = response.text.trim();
    const decision = JSON.parse(jsonText) as AccessDecision;
    if (decision && typeof decision.action === 'string') {
        return decision;
    }
    throw new Error("Invalid JSON structure in Gemini response");

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    // Fallback to a safe, default decision in case of an API error.
    return {
      reasoning: "API error or invalid response. Defaulting to deny access.",
      action: 'deny',
      isLeak: false,
      decryptionSuccess: false,
    };
  }
}
