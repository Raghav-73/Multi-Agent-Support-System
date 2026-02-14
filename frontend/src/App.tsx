import { useState, useEffect, useRef } from "react";
import { useChat } from "@ai-sdk/react";
import {
  MessageSquare,
  Plus,
  User,
  Bot,
  Send,
  Trash2,
  CreditCard,
  Package,
  LifeBuoy,
  ChevronLeft,
  Settings,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface Conversation {
  id: string;
  title: string;
  updatedAt: string;
}

const API_BASE_URL = import.meta.env.VITE_API_URL || "https://raghav-mas.vercel.app";

export default function App() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { messages, sendMessage, setMessages, status } = useChat({
    api: `${API_BASE_URL}/api/chat`,
    onResponse: (response: any) => {
      const newId = response.headers.get("x-conversation-id");

      if (newId && !currentId) {
        setCurrentId(newId);
        fetchConversations();
      }
    },
    onFinish: async () => {
      fetchConversations();
      if (currentId) {
        await fetchMessages(currentId);
      }
    },
  } as any);

  // const { messages, sendMessage, setMessages, status } = useChat({
  //     onFinish: () => {
  //         fetchConversations()
  //     }
  // })

  // Create isLoading derived state for existing UI components
  const isLoading = status === "streaming" || status === "submitted";

  const [input, setInput] = useState("");

  const handleInputChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    setInput(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    await sendMessage({ role: "user", content: input } as any, {
      body: {
        conversationId: currentId,
      },
    });
    setInput("");
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    if (currentId) {
      fetchMessages(currentId);
    } else {
      setMessages([]);
    }
  }, [currentId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const fetchConversations = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/chat/conversations`);
      const data = await res.json();
      setConversations(data);
    } catch (e) {
      console.error("Failed to fetch conversations", e);
    }
  };

  const fetchMessages = async (id: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/chat/conversations/${id}`);
      const data = await res.json();
      setMessages(
        data.messages.map((m: any) => ({
          id: m.id,
          role: m.role,
          content: m.content,
          createdAt: new Date(m.createdAt),
          agentType: m.agentType,
        })),
      );
    } catch (e) {
      console.error("Failed to fetch messages", e);
    }
  };

  const deleteConversation = async (id: string) => {
    try {
      await fetch(`${API_BASE_URL}/api/chat/conversations/${id}`, { method: "DELETE" });
      if (currentId === id) setCurrentId(null);
      fetchConversations();
    } catch (e) {
      console.error("Failed to delete", e);
    }
  };

  const startNewChat = () => {
    setCurrentId(null);
    setMessages([]);
  };

  const getAgentIcon = (type?: string) => {
    switch (type) {
      case "ORDER":
        return <Package size={16} />;
      case "BILLING":
        return <CreditCard size={16} />;
      case "SUPPORT":
        return <LifeBuoy size={16} />;
      default:
        return <Bot size={16} />;
    }
  };

  return (
    <div className="app-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="logo-icon">
            <Bot color="white" size={20} />
          </div>
          <span className="sidebar-title">Nexus AI</span>
        </div>

        <button
          onClick={startNewChat}
          className="conv-item"
          style={{
            background: "var(--accent-blue)",
            color: "white",
            border: "none",
            marginBottom: "1.5rem",
            justifyContent: "center",
          }}
        >
          <Plus size={18} />
          <span>New Session</span>
        </button>

        <div className="conversation-list">
          <AnimatePresence>
            {conversations.map((conv) => (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                key={conv.id}
                className={cn("conv-item", currentId === conv.id && "active")}
                onClick={() => setCurrentId(conv.id)}
              >
                <div
                  style={{
                    flex: 1,
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                    overflow: "hidden",
                  }}
                >
                  <MessageSquare
                    size={16}
                    color={
                      currentId === conv.id
                        ? "var(--accent-blue)"
                        : "var(--text-secondary)"
                    }
                  />
                  <span className="conv-title">
                    {conv.title || "Untitled Session"}
                  </span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteConversation(conv.id);
                  }}
                  className="trash-btn"
                  style={{
                    background: "none",
                    border: "none",
                    color: "var(--text-secondary)",
                    cursor: "pointer",
                    opacity: 0.5,
                  }}
                >
                  <Trash2 size={14} />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <div
          style={{
            marginTop: "auto",
            paddingTop: "1rem",
            borderTop: "1px solid var(--border-color)",
            display: "flex",
            gap: "1rem",
          }}
        >
          <Settings size={18} color="var(--text-secondary)" />
          <User size={18} color="var(--text-secondary)" />
        </div>
      </aside>

      {/* Main Chat Area */}
      <main className="chat-main">
        <header className="chat-header">
          <div>
            <h2 style={{ fontSize: "1.125rem", fontWeight: 600 }}>
              {currentId
                ? conversations.find((c) => c.id === currentId)?.title ||
                "Active Session"
                : "New Session"}
            </h2>
            <p style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>
              {isLoading ? "Agent is thinking..." : "Multi-Agent System Ready"}
            </p>
          </div>
          <div style={{ display: "flex", gap: "1rem" }}>
            <div className="agent-badge" style={{ margin: 0 }}>
              Active Router
            </div>
          </div>
        </header>

        <div className="message-list">
          {messages.length === 0 && (
            <div
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                opacity: 0.5,
              }}
            >
              <Bot
                size={48}
                style={{ marginBottom: "1rem", color: "var(--accent-blue)" }}
              />
              <p>How can I help you today?</p>
              <div
                style={{ display: "flex", gap: "0.5rem", marginTop: "1.5rem" }}
              >
                {["Track my order", "Billing issue", "Tech support"].map(
                  (q) => (
                    <button
                      key={q}
                      onClick={() =>
                        handleInputChange({ target: { value: q } } as any)
                      }
                      style={{
                        padding: "0.5rem 1rem",
                        borderRadius: "20px",
                        background: "var(--glass-bg)",
                        border: "1px solid var(--glass-border)",
                        color: "white",
                        cursor: "pointer",
                        fontSize: "0.875rem",
                      }}
                    >
                      {q}
                    </button>
                  ),
                )}
              </div>
            </div>
          )}

          {messages.map((m: any) => (
            <div
              key={m.id}
              className={cn("message-item", m.role === "user" ? "user" : "ai")}
            >
              <div className={cn("avatar", m.role === "assistant" && "ai")}>
                {m.role === "user" ? (
                  <User size={18} />
                ) : (
                  getAgentIcon((m as any).agentType)
                )}
              </div>
              <div style={{ display: "flex", flexDirection: "column" }}>
                {m.role === "assistant" && (m as any).agentType && (
                  <span className="agent-badge">
                    {(m as any).agentType} AGENT
                  </span>
                )}
                <div className="message-content">{m.content}</div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="message-item ai">
              <div className="avatar ai">
                <Bot size={18} />
              </div>
              <div className="typing-indicator">
                <div className="dot" />
                <div className="dot" />
                <div className="dot" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="input-area">
          <form onSubmit={handleSubmit} className="input-wrapper">
            <input
              className="chat-input"
              value={input}
              onChange={handleInputChange}
              placeholder="Ask about orders, billing, or technical support..."
              autoFocus
            />
            <button
              type="submit"
              className="send-btn"
              disabled={!input.trim() || isLoading}
            >
              <Send size={18} />
            </button>
          </form>
          <p
            style={{
              textAlign: "center",
              fontSize: "0.65rem",
              color: "var(--text-secondary)",
              marginTop: "1rem",
            }}
          >
            Built with Hono, Prisma, and Vercel AI SDK.
          </p>
        </div>
      </main>
    </div>
  );
}
