'use client';

import { useState, useEffect } from 'react';
import {
    Inbox,
    CheckCircle2,
    Settings,
    Search,
    MessageSquare,
    Sparkles,
    BrainCircuit,
    Send,
    User,
    AlertCircle,
    LayoutDashboard,
    Zap,
    Loader2,
    Shield,
    Database,
    Bell,
    Trash2,
    Key,
    Globe,
    Cpu,
    Activity
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Dashboard() {
    const [tickets, setTickets] = useState<any[]>([]);
    const [selectedTicket, setSelectedTicket] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('inbox');
    const [processing, setProcessing] = useState(false);

    // Settings State
    const [settings, setSettings] = useState({
        aiModel: 'Gemini 2.5 Flash',
        temperature: 0.7,
        autoProcess: true,
        notifications: true,
        systemHealth: 'Optimal',
        logRetention: '30 Days'
    });

    useEffect(() => {
        fetchTickets();
    }, []);

    const fetchTickets = async () => {
        setLoading(true);
        const res = await fetch('/api/tickets');
        const data = await res.json();
        setTickets(data);
        setLoading(false);
    };

    const processTicket = async (id: string) => {
        setProcessing(true);
        const res = await fetch(`/api/tickets/${id}/process`, { method: 'POST' });
        const updated = await res.json();
        setSelectedTicket(updated);
        setTickets(prev => prev.map(t => t._id === id ? updated : t));
        setProcessing(false);
    };

    const closeTicket = async (id: string) => {
        const res = await fetch(`/api/tickets/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: 'closed' })
        });
        const updated = await res.json();
        setTickets(prev => prev.map(t => t._id === id ? updated : t));
        setSelectedTicket(null);
    };

    const getSentimentEmoji = (s: string) => {
        switch (s?.toLowerCase()) {
            case 'happy': return '😊';
            case 'angry': return '😡';
            case 'neutral': return '😐';
            default: return '❔';
        }
    };

    return (
        <div className="flex h-screen bg-[#020617] text-slate-200 overflow-hidden">
            {/* Sidebar */}
            <aside className="w-64 border-r border-white/5 bg-[#0f172a]/50 flex flex-col">
                <div className="p-6 flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-blue-600/10 text-blue-400">
                        <Zap className="w-6 h-6" />
                    </div>
                    <span className="text-xl font-bold tracking-tight text-white">Nexus</span>
                </div>

                <nav className="flex-1 px-4 py-4 space-y-2">
                    {[
                        { id: 'inbox', label: 'Inbox', icon: Inbox },
                        { id: 'resolved', label: 'Resolved', icon: CheckCircle2 },
                        { id: 'settings', label: 'Settings', icon: Settings },
                    ].map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === item.id
                                ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20'
                                : 'text-slate-400 hover:bg-white/5'
                                }`}
                        >
                            <item.icon className="w-5 h-5" />
                            <span className="font-medium">{item.label}</span>
                        </button>
                    ))}
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex overflow-hidden">
                {/* Center Panel (Conditional Content) */}
                <section className={`flex-1 flex overflow-hidden ${activeTab === 'settings' ? 'bg-[#020617]' : ''}`}>
                    {activeTab === 'inbox' && (
                        <div className="flex-1 flex overflow-hidden">
                            {/* Ticket List */}
                            <section className="w-96 border-r border-white/5 flex flex-col">
                                <div className="p-4 border-b border-white/5">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                        <input
                                            type="text"
                                            placeholder="Search tickets..."
                                            className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-blue-500/50"
                                        />
                                    </div>
                                </div>

                                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                                    {loading ? (
                                        <div className="flex flex-col items-center justify-center h-full gap-2 opacity-50">
                                            <BrainCircuit className="w-8 h-8 animate-pulse text-blue-400" />
                                            <span className="text-xs uppercase tracking-widest font-bold">Synchronizing...</span>
                                        </div>
                                    ) : (
                                        tickets.filter(t => t.status === 'open').map((t) => (
                                            <button
                                                key={t._id}
                                                onClick={() => setSelectedTicket(t)}
                                                className={`w-full text-left p-4 rounded-xl border transition-all ${selectedTicket?._id === t._id
                                                    ? 'bg-white/5 border-blue-500/30 ring-1 ring-blue-500/30'
                                                    : 'bg-white/[0.02] border-white/5 hover:border-white/10'
                                                    }`}
                                            >
                                                <div className="flex justify-between items-start mb-2">
                                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{t.customer_name}</span>
                                                    <span className="text-lg">{getSentimentEmoji(t.sentiment)}</span>
                                                </div>
                                                <p className="text-sm font-semibold text-white line-clamp-1 mb-2">{t.message}</p>
                                                <div className="flex gap-2">
                                                    {t.category && (
                                                        <span className="px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 text-[10px] font-bold uppercase border border-blue-500/20">
                                                            {t.category}
                                                        </span>
                                                    )}
                                                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border bg-orange-500/10 text-orange-400 border-orange-500/20">
                                                        {t.status}
                                                    </span>
                                                </div>
                                            </button>
                                        ))
                                    )}
                                </div>
                            </section>

                            {/* Ticket Detail */}
                            <section className="flex-1 bg-[#020617] flex flex-col overflow-hidden">
                                {selectedTicket ? (
                                    <div className="flex-1 flex flex-col overflow-hidden">
                                        {/* Header */}
                                        <div className="p-6 border-b border-white/5 flex justify-between items-center bg-[#0f172a]/30">
                                            <div>
                                                <h2 className="text-xl font-bold text-white mb-1">Ticket #{selectedTicket._id.slice(-6).toUpperCase()}</h2>
                                                <div className="flex items-center gap-2 text-xs text-slate-400">
                                                    <User className="w-3 h-3" />
                                                    <span>{selectedTicket.customer_name}</span>
                                                    <span className="opacity-30">•</span>
                                                    <span>Received {new Date(selectedTicket.createdAt).toLocaleString()}</span>
                                                </div>
                                            </div>
                                            <div className="flex gap-3">
                                                {!selectedTicket.ai_draft && (
                                                    <button
                                                        onClick={() => processTicket(selectedTicket._id)}
                                                        disabled={processing}
                                                        className="px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-lg flex items-center gap-2 text-sm font-bold shadow-lg shadow-blue-600/20 transition-all"
                                                    >
                                                        <Sparkles className={`w-4 h-4 ${processing ? 'animate-spin' : ''}`} />
                                                        {processing ? 'Analyzing...' : 'AI Analyze'}
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => closeTicket(selectedTicket._id)}
                                                    className="px-4 py-2 bg-white/5 hover:bg-white/10 text-slate-200 rounded-lg text-sm font-bold border border-white/10 transition-all"
                                                >
                                                    Close Ticket
                                                </button>
                                            </div>
                                        </div>

                                        {/* Body */}
                                        <div className="flex-1 flex overflow-hidden">
                                            {/* Conversation & Draft */}
                                            <div className="flex-1 p-6 overflow-y-auto space-y-8 scrollbar-none">
                                                <div className="space-y-4">
                                                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 flex items-center gap-2">
                                                        <MessageSquare className="w-3 h-3" /> Customer Message
                                                    </label>
                                                    <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5 text-slate-300 leading-relaxed italic">
                                                        "{selectedTicket.message}"
                                                    </div>
                                                </div>

                                                <AnimatePresence>
                                                    {selectedTicket.ai_draft && (
                                                        <motion.div
                                                            initial={{ opacity: 0, y: 20 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            className="space-y-4"
                                                        >
                                                            <label className="text-[10px] font-bold uppercase tracking-widest text-blue-500 flex items-center gap-2">
                                                                <Sparkles className="w-3 h-3" /> AI Suggested Plan
                                                            </label>
                                                            <div className="relative group">
                                                                <textarea
                                                                    defaultValue={selectedTicket.ai_draft}
                                                                    rows={8}
                                                                    className="w-full bg-blue-600/[0.03] border border-blue-500/20 rounded-2xl p-6 text-sm text-slate-200 focus:outline-none focus:border-blue-500/50 transition-all leading-relaxed shadow-inner"
                                                                />
                                                                <button className="absolute bottom-4 right-4 p-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl flex items-center gap-2 text-xs font-bold shadow-xl transition-all">
                                                                    <Send className="w-4 h-4" /> Send Response
                                                                </button>
                                                            </div>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>

                                            {/* Agent Thought Panel */}
                                            <div className="w-80 border-l border-white/5 bg-[#0f172a]/20 p-6 overflow-y-auto flex flex-col gap-6">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
                                                        <BrainCircuit className="w-4 h-4 text-purple-400" />
                                                    </div>
                                                    <span className="text-sm font-bold text-white">Thought Trace</span>
                                                </div>

                                                <div className="space-y-4 relative">
                                                    <div className="absolute left-4 top-0 bottom-0 w-px bg-white/5" />
                                                    {selectedTicket.agent_logs?.map((log: any, i: number) => (
                                                        <div key={i} className="relative flex items-start gap-4">
                                                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#020617] border border-white/10 flex items-center justify-center z-10">
                                                                <div className={`w-2 h-2 rounded-full ${log.agent === 'Classifier' ? 'bg-orange-400' :
                                                                    log.agent === 'Researcher' ? 'bg-green-400' :
                                                                        log.agent === 'Composer' ? 'bg-blue-400' : 'bg-slate-400'
                                                                    }`} />
                                                            </div>
                                                            <div className="flex-1 pt-0.5">
                                                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none">{log.agent}</span>
                                                                <p className="text-xs text-slate-400 leading-relaxed bg-white/[0.02] p-2 rounded-lg border border-white/5">
                                                                    {log.thought}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                    {processing && (
                                                        <div className="relative flex items-start gap-4 animate-pulse">
                                                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#020617] border border-white/10 flex items-center justify-center z-10">
                                                                <Loader2 className="w-4 h-4 text-blue-400 animate-spin" />
                                                            </div>
                                                            <div className="flex-1 pt-2">
                                                                <div className="h-2 bg-white/5 rounded w-1/3 mb-2" />
                                                                <div className="h-12 bg-white/5 rounded" />
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex-1 flex flex-col items-center justify-center text-slate-500 gap-4">
                                        <LayoutDashboard className="w-10 h-10 opacity-20 mb-4" />
                                        <h3 className="text-lg font-bold text-white/50 tracking-tight">Select a ticket to begin Nexus Analysis</h3>
                                    </div>
                                )}
                            </section>
                        </div>
                    )}

                    {activeTab === 'resolved' && (
                        <div className="flex-1 overflow-y-auto p-10 space-y-6">
                            <h2 className="text-2xl font-black text-white flex items-center gap-3">
                                <CheckCircle2 className="w-6 h-6 text-green-500" />
                                Resolved History
                            </h2>
                            <div className="grid gap-4">
                                {tickets.filter(t => t.status === 'closed').length === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-20 opacity-50">
                                        <Inbox className="w-12 h-12 mb-4" />
                                        <p>No tickets have been closed yet.</p>
                                    </div>
                                ) : (
                                    tickets.filter(t => t.status === 'closed').map((t) => (
                                        <div key={t._id} className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 flex justify-between items-center group">
                                            <div>
                                                <div className="flex items-center gap-3 mb-2">
                                                    <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">{t.customer_name}</span>
                                                    <span className="px-2 py-0.5 rounded-full bg-green-500/10 text-green-400 text-[10px] font-bold uppercase border border-green-500/20">Resolved</span>
                                                </div>
                                                <p className="text-sm text-slate-300 font-medium">{t.message}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[10px] text-slate-500 uppercase font-bold">{new Date(t.updatedAt).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    )}

                    {activeTab === 'settings' && (
                        <div className="flex-1 overflow-y-auto p-10 scrollbar-none">
                            <div className="max-w-4xl mx-auto space-y-12">
                                <header>
                                    <h2 className="text-4xl font-black text-white tracking-tighter mb-2">System Control</h2>
                                    <p className="text-slate-500 font-medium">Configure the Nexus Multi-Agent Orchestration layer and system preferences.</p>
                                </header>

                                <div className="grid gap-8">
                                    {/* AI Architecture Section */}
                                    <section className="space-y-6">
                                        <div className="flex items-center gap-3 text-blue-400">
                                            <Cpu className="w-5 h-5" />
                                            <h3 className="text-sm font-bold uppercase tracking-widest">AI Engine & Workflow</h3>
                                        </div>

                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 space-y-4">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <p className="text-sm font-bold text-white">Model Architecture</p>
                                                        <p className="text-xs text-slate-500">The primary LLM driving the agents.</p>
                                                    </div>
                                                    <Sparkles className="w-5 h-5 text-blue-500/50" />
                                                </div>
                                                <select
                                                    value={settings.aiModel}
                                                    onChange={(e) => setSettings({ ...settings, aiModel: e.target.value })}
                                                    className="w-full bg-[#020617] border border-white/10 rounded-xl px-4 py-2 text-sm text-slate-300 focus:outline-none focus:border-blue-500/50 transition-all cursor-pointer"
                                                >
                                                    <option>Gemini 2.5 Flash</option>
                                                    <option>Gemini 1.5 Pro</option>
                                                    <option>Gemini 1.0 Ultra</option>
                                                </select>
                                            </div>

                                            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 space-y-4">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <p className="text-sm font-bold text-white">Response Creativity</p>
                                                        <p className="text-xs text-slate-500">Target temperature: {settings.temperature}</p>
                                                    </div>
                                                    <Activity className="w-5 h-5 text-purple-500/50" />
                                                </div>
                                                <input
                                                    type="range" min="0" max="1" step="0.1"
                                                    value={settings.temperature}
                                                    onChange={(e) => setSettings({ ...settings, temperature: parseFloat(e.target.value) })}
                                                    className="w-full accent-blue-600 cursor-pointer"
                                                />
                                            </div>
                                        </div>
                                    </section>

                                    {/* Automation & Safety */}
                                    <section className="space-y-6">
                                        <div className="flex items-center gap-3 text-emerald-400">
                                            <Shield className="w-5 h-5" />
                                            <h3 className="text-sm font-bold uppercase tracking-widest">Automation & Safety</h3>
                                        </div>

                                        <div className="space-y-3">
                                            {[
                                                { id: 'autoProcess', label: "Autonomous Processing", desc: "Automatically invoke Classifier and Researcher agents on ticket arrival.", icon: BrainCircuit, color: "text-orange-400" },
                                                { id: 'notifications', label: "System Alerts", desc: "Receive real-time notifications for high-priority sentiment detected.", icon: Bell, color: "text-blue-400" }
                                            ].map((opt) => (
                                                <div key={opt.id} className="flex items-center justify-between p-6 rounded-2xl bg-white/[0.02] border border-white/5 group hover:bg-white/[0.04] transition-all">
                                                    <div className="flex items-center gap-4">
                                                        <div className={`p-3 rounded-xl bg-white/5 ${opt.color}`}><opt.icon className="w-5 h-5" /></div>
                                                        <div>
                                                            <p className="text-sm font-bold text-white">{opt.label}</p>
                                                            <p className="text-xs text-slate-500">{opt.desc}</p>
                                                        </div>
                                                    </div>
                                                    <button
                                                        onClick={() => setSettings(prev => ({ ...prev, [opt.id]: !prev[opt.id as keyof typeof prev] as any }))}
                                                        className={`w-12 h-6 rounded-full transition-all relative ${settings[opt.id as keyof typeof settings] ? 'bg-blue-600' : 'bg-white/10'}`}
                                                    >
                                                        <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${settings[opt.id as keyof typeof settings] ? 'left-7' : 'left-1'}`} />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </section>

                                    {/* Data Management */}
                                    <section className="space-y-6 pb-20">
                                        <div className="flex items-center gap-3 text-slate-400">
                                            <Database className="w-5 h-5" />
                                            <h3 className="text-sm font-bold uppercase tracking-widest">Infrastructure</h3>
                                        </div>

                                        <div className="grid md:grid-cols-3 gap-4">
                                            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 text-center space-y-2">
                                                <Globe className="w-5 h-5 mx-auto text-blue-400/50" />
                                                <p className="text-[10px] font-bold text-slate-500 uppercase">Region</p>
                                                <p className="text-xs text-white font-bold">Global (Multi-AZ)</p>
                                            </div>
                                            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 text-center space-y-2">
                                                <Key className="w-5 h-5 mx-auto text-yellow-400/50" />
                                                <p className="text-[10px] font-bold text-slate-500 uppercase">API Access</p>
                                                <p className="text-xs text-white font-bold">Standard Tier</p>
                                            </div>
                                            <button className="p-6 rounded-2xl bg-red-500/5 border border-red-500/20 text-center space-y-2 group hover:bg-red-500/10 transition-all">
                                                <Trash2 className="w-5 h-5 mx-auto text-red-400/50 group-hover:scale-110 transition-transform" />
                                                <p className="text-[10px] font-bold text-red-400 uppercase">Purge Logs</p>
                                                <p className="text-xs text-red-500/50 font-bold">Critical Danger</p>
                                            </button>
                                        </div>
                                    </section>
                                </div>
                            </div>
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
}
