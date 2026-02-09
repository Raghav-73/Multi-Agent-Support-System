import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { PromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import knowledgeBase from "@/data/knowledge_base.json";
import { compactContext } from "./router";
import { Message } from "./types";

if (!process.env.GEMINI_API_KEY) {
    console.error("❌ CRITICAL: GEMINI_API_KEY is missing in .env file.");
}

const model = new ChatGoogleGenerativeAI({
    apiKey: process.env.GEMINI_API_KEY || "dummy_key",
    model: "gemini-2.5-flash",
    maxOutputTokens: 2048,
});

const parser = new StringOutputParser();

// Agent A: The Classifier
const classifierPrompt = PromptTemplate.fromTemplate(`
  You are an expert support ticket classifier.
  Analyze the following message and output exactly in this format:
  CATEGORY: [Technical/Billing/General]
  SENTIMENT: [Angry/Neutral/Happy]

  Message: {message}
`);

// Agent C: The Composer
const composerPrompt = PromptTemplate.fromTemplate(`
  You are an empathetic support agent named Nexus Assistant.
  Based on the research findings and the original customer message, draft a professional and helpful response.
  
  Research Findings: {research}
  Customer Message: {message}
  Sentiment Context: {sentiment}

  Draft:
`);

export async function runMultiAgentWorkflow(message: string, history: Message[] = []) {
    "use workflow";
    const logs: any[] = [];

    // --- Step 0: Context Management ---
    const context = await (async () => {
        "use step";
        return history.length > 0 ? compactContext(history) : [];
    })();

    if (history.length > context.length) {
        logs.push({
            agent: "Memory",
            thought: `Compacted conversation context from ${history.length} to ${context.length} relevant messages.`,
            timestamp: new Date()
        });
    }

    // --- Agent A: Classifier ---
    const classification = await (async () => {
        "use step";
        logs.push({ agent: "Classifier", thought: "Analyzing customer intent and emotional state...", timestamp: new Date() });
        const classifierChain = classifierPrompt.pipe(model).pipe(parser);
        return await classifierChain.invoke({ message });
    })();

    const categoryMatch = classification.match(/CATEGORY:\s*(.*)/i);
    const sentimentMatch = classification.match(/SENTIMENT:\s*(.*)/i);
    const category = categoryMatch ? categoryMatch[1].trim() : "General";
    const sentiment = sentimentMatch ? sentimentMatch[1].trim() : "Neutral";

    logs.push({
        agent: "Classifier",
        thought: `Done. Intent: ${category}. Sentiment: ${sentiment}. Proceeding to Research.`,
        timestamp: new Date()
    });

    // --- Agent B: Researcher ---
    const researchFindings = await (async () => {
        "use step";
        logs.push({ agent: "Researcher", thought: `Searching internal knowledge base for ${category} policies...`, timestamp: new Date() });
        const relevantInfo = knowledgeBase.find(kb => kb.category.toLowerCase() === category.toLowerCase()) ||
            knowledgeBase.find(kb => kb.category === "General");
        return relevantInfo ? relevantInfo.solution : "No specific policy found. Provide general empathetic assistance.";
    })();

    logs.push({
        agent: "Researcher",
        thought: `Found relevant policy. Solution retrieved.`,
        timestamp: new Date()
    });

    // --- Agent C: Composer ---
    const aiDraft = await (async () => {
        "use step";
        logs.push({ agent: "Composer", thought: "Synthesizing research results into a professional draft...", timestamp: new Date() });
        const composerChain = composerPrompt.pipe(model).pipe(parser);
        return await composerChain.invoke({
            research: researchFindings,
            message,
            sentiment
        });
    })();

    logs.push({
        agent: "Composer",
        thought: "Drafting complete. Finalizing response for human review.",
        timestamp: new Date()
    });

    return {
        category,
        sentiment,
        aiDraft,
        logs
    };
}
