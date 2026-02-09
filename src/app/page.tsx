import Link from 'next/link';
import {
  Zap,
  ArrowRight,
  ShieldCheck,
  Cpu,
  Users
} from 'lucide-react';

export default function Home() {
  return (
    <main className="min-h-screen bg-[#020617] text-slate-200 selection:bg-blue-500/30">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        {/* Background Blobs */}
        <div className="absolute top-0 -left-1/4 w-[60%] h-[60%] bg-blue-600/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-0 -right-1/4 w-[60%] h-[60%] bg-purple-600/10 rounded-full blur-[120px] animate-pulse delay-1000" />

        <div className="max-w-6xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-600/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-wider mb-8 animate-bounce">
            <Zap className="w-3 h-3" /> Introducing Nexus Support
          </div>

          <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-white mb-8 leading-[0.9]">
            AI THAT <span className="text-blue-500">THINKS</span><br />
            BEFORE IT SPEAKS.
          </h1>

          <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed font-medium">
            The next generation of customer support. Multi-agent workflows that categorize, research, and compose perfectly crafted responses in seconds.
          </p>

          <div className="flex flex-col md:flex-row items-center justify-center gap-4">
            <Link
              href="/dashboard"
              className="px-8 py-4 bg-white text-black font-bold rounded-2xl hover:bg-slate-200 transition-all flex items-center gap-2 shadow-2xl shadow-white/10"
            >
              Admin Dashboard <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/ticket/new"
              className="px-8 py-4 bg-white/5 border border-white/10 text-white font-bold rounded-2xl hover:bg-white/10 transition-all"
            >
              Submit a Ticket
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-6 border-t border-white/5 bg-[#0f172a]/20">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
          {[
            {
              title: "Autonomous Classifiers",
              desc: "Instant categorization and sentiment analysis using domain-trained LLM agents.",
              icon: Cpu,
              color: "text-blue-400"
            },
            {
              title: "Durable Researching",
              desc: "Deep-dive policy lookups and technical solution hunting across internal knowledge bases.",
              icon: ShieldCheck,
              color: "text-green-400"
            },
            {
              title: "Empathetic Composing",
              desc: "Highly tailored drafted responses that save human agents hundreds of hours per week.",
              icon: Users,
              color: "text-purple-400"
            }
          ].map((f, i) => (
            <div key={i} className="p-8 rounded-3xl bg-white/[0.02] border border-white/5 hover:border-blue-500/20 transition-all group">
              <div className={`p-4 rounded-2xl bg-white/5 w-fit mb-6 group-hover:bg-blue-600/10 transition-all`}>
                <f.icon className={`w-8 h-8 ${f.color}`} />
              </div>
              <h3 className="text-xl font-bold text-white mb-4 tracking-tight">{f.title}</h3>
              <p className="text-slate-400 leading-relaxed text-sm">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Stats/Social Proof */}
      <footer className="py-10 px-6 text-center border-t border-white/5">
        <p className="text-[10px] uppercase tracking-[0.3em] font-black text-slate-600 mb-4">Powered by Multi-Agent Support System (MAS)</p>
        <div className="flex justify-center gap-6 opacity-30">
          <span className="font-bold text-lg tracking-tighter">GEMINI AI</span>
          <span className="font-bold text-lg tracking-tighter">MONGODB</span>
          <span className="font-bold text-lg tracking-tighter">LANGCHAIN</span>
        </div>
      </footer>
    </main>
  );
}
