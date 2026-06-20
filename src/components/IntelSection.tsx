import React, { useState } from "react";
import { Search, Globe, Shield, ShieldCheck, ShieldAlert, Cpu, HelpCircle, Terminal, Eye, FileText, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function IntelSection() {
  const [query, setQuery] = useState<string>("");
  const [intelReport, setIntelReport] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [riskScore, setRiskScore] = useState<number | null>(null);
  const [vType, setVType] = useState<string>("");
  const [error, setError] = useState<string>("");

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    try {
      setLoading(true);
      setError("");
      setIntelReport("");
      setRiskScore(null);

      const res = await fetch("/api/ip-intel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: query.trim() })
      });
      const data = await res.json();
      if (data.success) {
        setIntelReport(data.intel);
        setRiskScore(data.riskScore);
        setVType(data.type);
      } else {
        setError(data.error || "Failed obtaining registry data.");
      }
    } catch (err) {
      setError("Establishment of threat intel link failed.");
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (score: number) => {
    if (score >= 80) return "text-red-400 border-red-500/20 bg-red-500/5";
    if (score >= 50) return "text-orange-400 border-orange-500/20 bg-orange-500/5";
    return "text-emerald-400 border-emerald-500/20 bg-emerald-500/5";
  };

  const getRiskBadge = (score: number) => {
    if (score >= 80) return <span className="flex items-center gap-1 text-red-400"><ShieldAlert className="w-4 h-4 text-red-500 animate-pulse" /> HIGH MALICIOUS SUSPICION</span>;
    if (score >= 50) return <span className="flex items-center gap-1 text-orange-400"><HelpCircle className="w-4 h-4 text-orange-400" /> SUSPICIOUS ACTIVITY HISTORY</span>;
    return <span className="flex items-center gap-1 text-emerald-400"><ShieldCheck className="w-4 h-4 text-emerald-500" /> REPUTATION RATING SECURE</span>;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="intel-section-viewport">
      {/* Lookup Card Panel */}
      <div className="lg:col-span-4 flex flex-col space-y-4 bg-slate-900/60 p-4 rounded-xl border border-slate-800 backdrop-blur-md">
        <div>
          <h2 className="text-sm font-semibold tracking-wider text-slate-400 uppercase flex items-center gap-2">
            <Globe className="w-4 h-4 text-cyan-400" />
            IP & Destination Registry Search
          </h2>
          <p className="text-xs text-slate-500 mt-1">Audit domains, malicious host records, and block registry ASNs instantly.</p>
        </div>

        <form onSubmit={handleLookup} className="flex flex-col space-y-2">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500">Query Target Directory</span>
          <div className="relative">
            <span className="absolute left-3 top-2.5 text-xs text-slate-500 font-mono select-none">root@intel:~$</span>
            <input
              type="text"
              placeholder="185.220.101.4 or domain.com"
              className="w-full pl-28 pr-10 py-2 font-mono text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-cyan-500/50"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            {loading ? (
              <span className="absolute right-3 top-2.5 w-4 h-4 border border-cyan-500 border-t-transparent rounded-full animate-spin"></span>
            ) : (
              <Search className="absolute right-3 top-2.5 w-4 h-4 text-slate-500" onClick={handleLookup} />
            )}
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-cyan-700 hover:bg-cyan-600 text-cyan-50 font-mono text-xs rounded-lg transition-all shadow-[0_0_15px_rgba(6,182,212,0.1)] active:scale-95"
          >
            Execute Threat Lookup
          </button>
        </form>

        {/* Hot Search Suggestions */}
        <div className="space-y-1.5 pt-2">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-504 text-slate-500">Recent suspicious lookup nodes</span>
          <div className="flex flex-wrap gap-2 text-[10px] font-mono">
            {["103.20.12.90", "185.220.101.4", "malicious-apt-crawler.net", "8.8.8.8"].map((host) => (
              <button
                key={host}
                onClick={() => setQuery(host)}
                className="px-2 py-1 bg-slate-950 border border-slate-800 hover:border-cyan-500/30 hover:text-slate-200 text-slate-500 rounded transition-colors"
              >
                {host}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Threat Risk Gauge inside Sidebar lookup */}
        {riskScore !== null && (
          <div className={`p-4 rounded-lg border text-center flex flex-col items-center justify-center relative overflow-hidden transition-all duration-300 ${getRiskColor(riskScore)}`}>
            <span className="text-[10px] font-mono uppercase tracking-widest font-bold">Adversary Threat Weight</span>
            <span className="text-3xl font-extrabold font-mono mt-1 select-none">{riskScore} / 100</span>
            <div className="text-[10px] font-mono font-medium mt-1.5 leading-relaxed">
              {getRiskBadge(riskScore)}
            </div>
            {/* Visual warning slider inside badge card */}
            <div className="w-full bg-slate-950/80 h-1 rounded-full mt-3 overflow-hidden border border-slate-900">
              <div 
                className={`h-full rounded-full ${riskScore >= 80 ? 'bg-red-500' : riskScore >= 50 ? 'bg-orange-500' : 'bg-emerald-500'}`}
                style={{ width: `${riskScore}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Lookup Report Result */}
      <div className="lg:col-span-8 flex flex-col space-y-4 bg-slate-900/60 p-5 rounded-xl border border-slate-800 backdrop-blur-md">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-cyan-400" />
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest font-mono">Registry Cyber Threat dossier</h3>
          </div>
          {vType && (
            <span className="text-[10px] font-mono uppercase border border-cyan-800 bg-cyan-950/20 text-cyan-400 px-2 py-0.5 rounded">
              Type: {vType} Target
            </span>
          )}
        </div>

        <div className="flex-1 bg-slate-950 border border-slate-850 p-4 font-mono text-xs rounded-lg overflow-y-auto max-h-[380px] text-slate-300 relative flex flex-col">
          {loading ? (
            <div className="absolute inset-0 bg-slate-950/90 flex flex-col items-center justify-center space-y-3">
              <div className="w-6 h-6 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-[10px] font-mono text-cyan-400 tracking-widest animate-pulse">Scanning malicious DNS caches and threat databases...</span>
            </div>
          ) : null}

          {error ? (
            <div className="text-red-400 font-mono text-xs border border-red-950 p-3 rounded-lg bg-red-950/10">
              {error}
            </div>
          ) : intelReport ? (
            <div className="space-y-4 select-text leading-relaxed">
              {intelReport.split("\n").map((line, idx) => {
                if (line.startsWith("#")) {
                  return <h4 key={idx} className="text-sm font-semibold text-cyan-400 border-b border-cyan-950 pb-1 mt-3">{line.replace(/#/g, "")}</h4>;
                }
                if (line.startsWith("-") || line.startsWith("*")) {
                  return <li key={idx} className="text-slate-300 ml-4 list-disc">{line.substring(2)}</li>;
                }
                if (line.match(/^\d+\./)) {
                  return <div key={idx} className="text-slate-300 pl-4 py-0.5">{line}</div>;
                }
                if (line.startsWith("```")) {
                  return null;
                }
                return <p key={idx} className="text-slate-400">{line}</p>;
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center my-auto py-16 text-slate-600">
              <Shield className="w-10 h-10 mb-2 opacity-20 text-cyan-500" />
              <span className="text-center font-mono">Enter any domain (e.g. malicious.net) or IP (e.g. 185.12.92.11) to assemble full reputation intelligence datasets.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
