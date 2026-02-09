# Nexus Support: AI Multi-Agent Dashboard

Welcome to **Nexus Support**, a production-ready multi-agent support ecosystem. Nexus uses a sophisticated three-agent chain to handle customer requests with human-like precision.

## 🧠 The Multi-Agent Architecture

Nexus uses a pipeline of specialized LLM agents orchestrated via **LangChain** and **Gemini AI**:

1.  **Agent A (The Classifier)**: Analyzes the ticket to determine its category (Technical, Billing, or General) and detects customer sentiment (Angry, Neutral, or Happy).
2.  **Agent B (The Researcher)**: Cross-references the category against an internal Knowledge Base (`knowledge_base.json`) to find the exact company policy or technical resolution.
3.  **Agent C (The Composer)**: Synthesizes the original query, the detected sentiment, and the research findings to draft a professional, empathetic response.

## 🛠️ Tech Stack

- **Frontend**: Next.js 15+, Tailwind CSS, Framer Motion, Lucide React.
- **Backend**: Next.js API Routes, LangChain, Google Gemini Pro.
- **Database**: MongoDB (via Mongoose) for persistent ticket storage and "Agent Thought Logging."

## 🚀 Setup Instructions

1.  **Clone & Install**:
    ```bash
    npm install
    ```

2.  **Environment Variables**:
    Create a `.env` file based on `.env.example`:
    ```env
    # Required for AI logic
    GEMINI_API_KEY=your_key_here
    
    # Required for persistence
    MONGODB_URI=mongodb://localhost:27017/nexus_support
    ```

3.  **Seed Fresh Data (Optional)**:
    Start the app and visit `http://localhost:3000/api/seed` to populate your dashboard with mock tickets.

4.  **Run Development Server**:
    ```bash
    npm run dev
    ```

## 📂 Project Structure

- `src/app/dashboard`: The Admin Command Center.
- `src/app/ticket/new`: Public customer submission portal.
- `src/lib/agents.ts`: The core "Thought Logic" for the MAS workflow.
- `src/models/Ticket.ts`: Robust schema for tickets and agent logs.

## 🧪 Production Readiness Features

- **Agent Thought Trace**: Every decision is logged and visible in the admin panel.
- **Sentiment-Aware Drafting**: Responses adapt to the customer's mood.
- **Safe Editing**: Admins can review and refine AI drafts before sending.
- **Scalable Backend**: Designed to handle growing ticket volumes with durable state.
