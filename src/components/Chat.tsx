'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, User, Bot, Loader2, Search, Brain, Zap, Paperclip, Mic, Plus } from 'lucide-react';
import { Message } from '@/lib/types';

export default function Chat() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [steps, setSteps] = useState<{ name: string; status: string; details?: string }[]>([]);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, steps]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || loading) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: input,
            timestamp: Date.now(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setInput('');
        setLoading(true);
        setSteps([{ name: 'Analyzing Request', status: 'thinking' }]);

        try {
            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messages: [...messages, userMessage] }),
            });

            if (res.ok) {
                const data = await res.json();
                setSteps(data.steps);

                setTimeout(() => {
                    setMessages((prev) => [...prev, data.message]);
                    setLoading(false);
                    setSteps([]);
                }, 1200);
            } else {
                const err = await res.json();
                alert(err.error || 'Failed to fetch');
                setLoading(false);
                setSteps([]);
            }
        } catch (error) {
            console.error('Error:', error);
            setLoading(false);
            setSteps([]);
        }
    };

    return (
        <div className="flex flex-col h-screen w-full max-w-4xl mx-auto bg-[#0f172a] text-slate-200">
            {/* Search/Header Bar */}
            <header className="sticky top-0 z-20 flex items-center justify-between p-4 border-b border-white/5 bg-[#0f172a]/80 backdrop-blur-md">
                <div className="flex items-center gap-2">
                    <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-600/20 text-blue-400">
                        <Zap className="w-5 h-5" />
                    </div>
                    <span className="font-semibold text-white tracking-tight">NextAgent AI</span>
                </div>
                <div className="flex items-center gap-4">
                    <button className="text-xs font-medium px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-colors">
                        New Chat
                    </button>
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 overflow-hidden border border-white/10" />
                </div>
            </header>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto px-4 py-8 space-y-8 scrollbar-thin scrollbar-thumb-white/10">
                {messages.length === 0 && (
                    <div className="h-full flex flex-col items-center justify-center text-center max-w-md mx-auto">
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.5 }}
                            className="w-16 h-16 rounded-3xl bg-blue-500/10 flex items-center justify-center mb-6 border border-blue-500/20 shadow-2xl shadow-blue-500/20"
                        >
                            <Bot className="w-8 h-8 text-blue-400" />
                        </motion.div>
                        <h1 className="text-2xl font-bold text-white mb-2 tracking-tight">How can I help you today?</h1>
                        <p className="text-slate-400 text-sm leading-relaxed mb-8">
                            Ask me about technical architecture, billing queries, or general system support. Our multi-agent router will assign the best specialist.
                        </p>
                        <div className="grid grid-cols-2 gap-3 w-full">
                            {['Debug my React code', 'Explain the billing cycle', 'System status check', 'New feature request'].map((suggestion) => (
                                <button
                                    key={suggestion}
                                    onClick={() => setInput(suggestion)}
                                    className="p-3 text-left text-xs rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 transition-all text-slate-300"
                                >
                                    {suggestion}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                <AnimatePresence>
                    {messages.map((m) => (
                        <motion.div
                            key={m.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`flex w-full group ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div className={`flex max-w-[85%] ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'} gap-4`}>
                                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center border ${m.role === 'user' ? 'bg-slate-800 border-white/10' : 'bg-blue-600/10 border-blue-500/20'
                                    }`}>
                                    {m.role === 'user' ? <User className="w-4 h-4 text-slate-400" /> : <Bot className="w-4 h-4 text-blue-400" />}
                                </div>

                                <div className="flex flex-col gap-2">
                                    <div className={`flex items-center gap-2 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                                            {m.agentId || (m.role === 'user' ? 'User' : 'Assistant')}
                                        </span>
                                    </div>

                                    <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${m.role === 'user'
                                        ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/10 rounded-tr-none'
                                        : 'bg-white/5 text-slate-200 border border-white/5 rounded-tl-none'
                                        }`}>
                                        {m.content}
                                    </div>

                                    {m.role === 'assistant' && (
                                        <div className="flex items-center gap-3 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button className="text-[10px] text-slate-500 hover:text-white transition-colors">Copy</button>
                                            <button className="text-[10px] text-slate-500 hover:text-white transition-colors">Regenerate</button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {loading && (
                    <div className="flex flex-col gap-4 max-w-[85%]">
                        <div className="flex items-start gap-4">
                            <div className="mt-1 w-8 h-8 rounded-full bg-blue-600/10 border border-blue-500/20 flex items-center justify-center">
                                <Brain className="w-4 h-4 text-purple-400 animate-pulse" />
                            </div>
                            <div className="flex flex-col gap-2 w-full">
                                <div className="flex items-center justify-between">
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">MAS Collaboration Protocol</span>
                                    <div className="flex gap-1">
                                        <div className="w-1 h-1 rounded-full bg-blue-500 animate-bounce" />
                                        <div className="w-1 h-1 rounded-full bg-blue-500 animate-bounce [animation-delay:-.3s]" />
                                        <div className="w-1 h-1 rounded-full bg-blue-500 animate-bounce [animation-delay:-.5s]" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 gap-2">
                                    {steps.map((step, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            className="flex items-center justify-between p-2.5 bg-white/[0.03] rounded-xl border border-white/5"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className={`p-1.5 rounded-lg ${step.status === 'thinking' ? 'bg-purple-500/10 text-purple-400' :
                                                    step.status === 'searching' ? 'bg-green-500/10 text-green-400' : 'bg-blue-500/10 text-blue-400'
                                                    }`}>
                                                    {step.status === 'thinking' ? <Brain className="w-3.5 h-3.5" /> :
                                                        step.status === 'searching' ? <Search className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
                                                </div>
                                                <div>
                                                    <p className="text-xs font-bold text-slate-300">{step.name}</p>
                                                    <p className="text-[10px] text-slate-500">{step.details}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${step.status === 'finished' ? 'bg-green-500/10 text-green-500' : 'bg-blue-500/10 text-blue-500 animate-pulse'
                                                    }`}>
                                                    {step.status === 'finished' ? 'Verified' : 'Active'}
                                                </span>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Bar */}
            <footer className="p-6 bg-gradient-to-t from-[#0f172a] via-[#0f172a] to-transparent">
                <form onSubmit={handleSubmit} className="max-w-3xl mx-auto relative group">
                    <div className="relative flex items-end gap-2 p-2 bg-white/5 border border-white/10 rounded-2xl focus-within:border-blue-500/50 transition-all shadow-2xl backdrop-blur-xl">
                        <button type="button" className="p-2.5 text-slate-500 hover:text-white transition-colors rounded-xl hover:bg-white/5">
                            <Plus className="w-5 h-5" />
                        </button>
                        <textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSubmit(e);
                                }
                            }}
                            placeholder="Message NextAgent AI..."
                            rows={1}
                            className="w-full bg-transparent border-none focus:ring-0 py-2.5 resize-none text-sm text-slate-200 placeholder:text-slate-500 max-h-48 scrollbar-none"
                        />
                        <div className="flex items-center gap-1">
                            <button type="button" className="p-2.5 text-slate-500 hover:text-white transition-colors rounded-xl hover:bg-white/5">
                                <Paperclip className="w-5 h-5" />
                            </button>
                            <button type="button" className="p-2.5 text-slate-500 hover:text-white transition-colors rounded-xl hover:bg-white/5">
                                <Mic className="w-5 h-5" />
                            </button>
                            <button
                                type="submit"
                                disabled={loading || !input.trim()}
                                className="p-2.5 bg-white text-black rounded-xl hover:bg-slate-200 disabled:bg-white/5 disabled:text-slate-600 transition-all font-bold shadow-lg"
                            >
                                <Send className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                    <p className="mt-3 text-center text-[10px] text-slate-600 uppercase tracking-widest font-bold">
                        Multi-Agent Router (Technical • Billing • Support) active
                    </p>
                </form>
            </footer>
        </div>
    );
}
