# AI-Powered Multi-Agent Support System (Next.js Version)

A clean, full-stack support system built using **Next.js**. It features intelligent message routing, context management, and a premium AI-driven interface.

## 🚀 Features

- **Multi-Agent Routing**: Your query is automatically sent to the best specialist (Tech, Billing, or Support).
- **Context Compaction**: Automatically summarizes long chats to save space and stay fast.
- **Thinking Indicators**: Real-time visual feedback showing exactly what the AI is doing ("Routing", "Analyzing").
- **Full-stack Simplicity**: No complex monorepo or extra backend servers—just pure Next.js.
- **Rate Limiting**: Protection against too many requests.
- **Durable Flows**: Designed to handle complex, multi-step AI tasks.

## 🛠️ How it Works

### 1. The Router
Every message you send is analyzed by a "Router" in `src/lib/router.ts`. It looks for keywords like "code", "bill", or "help" to decide which specialist agent should answer.

### 2. Context Management
To keep the AI sharp, we don't send the entire chat history every time. The "Compaction" logic pruning old messages and keeps recent ones, ensuring the AI always has the most relevant info without being overwhelmed.

### 3. API Routes
Backend logic is handled in Next.js API routes (`src/app/api/chat/route.ts`), which acts as the central hub for the multi-agent system.

## 📦 Getting Started

1. **Install everything**:
   ```bash
   npm install
   ```

2. **Run the app**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to start chatting.

## 🧪 Project Structure

- `src/app/api`: Backend logic and agent routing.
- `src/components`: The premium chat interface.
- `src/lib`: Core logic for routing and context management.
