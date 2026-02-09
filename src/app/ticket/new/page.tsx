'use client';

import { useState } from 'react';
import { Send, Zap, ChevronLeft, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function NewTicket() {
    const [name, setName] = useState('');
    const [message, setMessage] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !message) return;
        setLoading(true);

        try {
            const res = await fetch('/api/tickets', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ customer_name: name, message }),
            });

            if (res.ok) {
                setSubmitted(true);
            }
        } catch (err) {
            alert('Failed to submit ticket');
        } finally {
            setLoading(false);
        }
    };

    if (submitted) {
        return (
            <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center p-6 text-center">
                <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center mb-6 border border-green-500/20"
                >
                    <CheckCircle2 className="w-10 h-10 text-green-400" />
                </motion.div>
                <h1 className="text-3xl font-black text-white mb-4 tracking-tight">TICKET SUBMITTED</h1>
                <p className="text-slate-400 max-w-sm mb-8 leading-relaxed">
                    Our agents (both human and AI) are now reviewing your request. We'll get back to you shortly.
                </p>
                <Link href="/" className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all font-bold text-sm">
                    Return to Nexus
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center p-6 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-600/5 rounded-full blur-[120px]" />

            <div className="w-full max-w-xl relative z-10">
                <Link href="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-white transition-colors text-sm font-medium mb-8">
                    <ChevronLeft className="w-4 h-4" /> Back to Home
                </Link>

                <div className="flex items-center gap-3 mb-8">
                    <div className="p-3 rounded-2xl bg-blue-600/10 text-blue-400 shadow-2xl shadow-blue-600/20">
                        <Zap className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-white tracking-tight leading-none mb-1">Nexus Help Center</h1>
                        <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Priority Ticket Submission</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="p-8 rounded-3xl bg-white/[0.03] border border-white/10 shadow-2xl space-y-6 backdrop-blur-xl">
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Your Display Name</label>
                        <input
                            type="text"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g. Satoshi Nakamoto"
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500/50 transition-all placeholder:text-slate-700"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">What can we help you with?</label>
                        <textarea
                            required
                            rows={5}
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Describe your issue in detail..."
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500/50 transition-all placeholder:text-slate-700 resize-none"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 bg-white text-black font-black rounded-2xl hover:bg-slate-200 disabled:opacity-50 transition-all flex items-center justify-center gap-2 shadow-xl shadow-white/5"
                    >
                        {loading ? 'Submitting...' : 'Submit Support Ticket'}
                        <Send className="w-4 h-4" />
                    </button>
                </form>

                <p className="mt-8 text-center text-[10px] text-slate-600 font-bold uppercase tracking-[0.2em]">
                    Powered by Nexus Multi-Agent Orchestration
                </p>
            </div>
        </div>
    );
}
