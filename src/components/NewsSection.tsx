import React, { useState, useEffect } from "react";
import { NewsItem } from "../types";
import { Shield, AlertTriangle, Cpu, Terminal, Search, ChevronRight, Download, Activity, PlaySquare } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function NewsSection() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<NewsItem | null>(null);
  const [filterSeverity, setFilterSeverity] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [analysis, setAnalysis] = useState<string>("");
  const [generatingPlaybook, setGeneratingPlaybook] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/news");
      const data = await res.json();
      if (data.success) {
        setNews(data.news);
        if (data.news.length > 0) {
          setSelectedItem(data.news[0]);
        }
      } else {
        setError("Failed to fetch defense feed from CyberShield database.");
      }
    } catch (err) {
      setError("Failed connecting to secure CyberShield gateway.");
    } finally {
      setLoading(false);
    }
  };

  const getAnalysis = async (item: NewsItem) => {
    try {
      setGeneratingPlaybook(true);
      setAnalysis("");
      const res = await fetch("/api/news/breakdown", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: item.title,
          description: item.description,
          cve: item.cve,
          severity: item.severity
        })
      });
      const data = await res.json();
      if (data.success) {
        setAnalysis(data.analysis);
      } else {
        setAnalysis("Secure Threat Core encountered an error: " + data.error);
      }
    } catch (err) {
      setAnalysis("Unable to establish tunnel with secure CyberShield core.");
    } finally {
      setGeneratingPlaybook(false);
    }
  };

  const filteredNews = news.filter(item => {
    const matchesSeverity = filterSeverity === "ALL" || item.severity === filterSeverity;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (item.cve && item.cve.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesSeverity && matchesSearch;
  });

  const getSeverityColor = (sev: string) => {
    switch (sev) {
      case "CRITICAL": return "bg-red-500/10 text-red-400 border-red-500/30";
      case "HIGH": return "bg-orange-500/10 text-orange-400 border-orange-500/30";
      case "MEDIUM": return "bg-yellow-500/10 text-yellow-400 border-yellow-500/30";
      default: return "bg-blue-500/10 text-blue-400 border-blue-500/30";
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="news-section-viewport">
      {/* Sidebar List */}
      <div className="lg:col-span-5 flex flex-col space-y-4 bg-slate-900/60 p-4 rounded-xl border border-slate-800 backdrop-blur-md">
        <div className="flex flex-col space-y-2">
          <h2 className="text-sm font-semibold tracking-wider text-slate-400 uppercase flex items-center gap-2">
            <Activity className="w-4 h-4 text-cyan-400" />
            Vulnerability Feed
          </h2>
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-4.5 h-4.5 text-slate-500" />
            <input
              type="text"
              placeholder="Search CVE, vector, exploit..."
              className="w-full pl-10 pr-4 py-2 text-sm bg-slate-950 border border-slate-800 rounded-lg text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-cyan-500/50"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2 pt-1 overflow-x-auto">
            {["ALL", "CRITICAL", "HIGH", "MEDIUM"].map((sev) => (
              <button
                key={sev}
                onClick={() => setFilterSeverity(sev)}
                className={`text-xs px-2.5 py-1 rounded-md font-mono border transition-all ${
                  filterSeverity === sev
                    ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/40"
                    : "bg-slate-950 text-slate-500 border-slate-800 hover:border-slate-700 hover:text-slate-400"
                }`}
              >
                {sev}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 text-slate-500 font-mono text-xs gap-3">
            <div className="w-5 h-5 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
            Connecting security socket...
          </div>
        ) : error ? (
          <div className="text-red-400 text-xs font-mono py-8 bg-slate-950 p-3 rounded-lg border border-red-950">
            {error}
          </div>
        ) : filteredNews.length === 0 ? (
          <div className="text-slate-500 font-mono text-xs py-12 text-center select-none border border-dashed border-slate-800 rounded-lg">
            No matched threat intelligence indices found.
          </div>
        ) : (
          <div className="space-y-2 overflow-y-auto max-h-[380px] pr-1">
            {filteredNews.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setSelectedItem(item);
                  setAnalysis("");
                }}
                className={`w-full text-left p-3 rounded-lg border transition-all flex flex-col space-y-1.5 ${
                  selectedItem?.id === item.id
                    ? "bg-slate-950 border-cyan-500/40 shadow-[0_0_10px_rgba(6,182,212,0.05)]"
                    : "bg-slate-950/40 border-slate-800 hover:border-slate-700 hover:bg-slate-950/60"
                }`}
              >
                <div className="flex justify-between items-start gap-2">
                  <span className="text-xs font-mono text-cyan-400/80">{item.cve || "ADV-ALERT"}</span>
                  <span className={`text-[10px] font-mono border px-1.5 py-0.5 rounded ${getSeverityColor(item.severity)}`}>
                    {item.severity}
                  </span>
                </div>
                <h3 className="text-sm font-medium text-slate-200 line-clamp-1">{item.title}</h3>
                <p className="text-xs text-slate-400 line-clamp-1">{item.description}</p>
                <div className="flex items-center justify-between pt-1 text-[10px] font-mono text-slate-500">
                  <span>{item.vector}</span>
                  <span>{item.date}</span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Detail Analysis Area */}
      <div className="lg:col-span-7 flex flex-col space-y-4 bg-slate-900/60 p-5 rounded-xl border border-slate-800 backdrop-blur-md">
        {selectedItem ? (
          <div className="flex flex-col h-full space-y-4">
            <div className="border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2 mb-2">
                <span className={`text-xs font-mono border px-2 py-0.5 rounded-md ${getSeverityColor(selectedItem.severity)}`}>
                  {selectedItem.severity} Severity
                </span>
                <span className="text-xs font-mono text-slate-500">{selectedItem.cve}</span>
                <span className="text-xs font-mono text-slate-500 ml-auto">{selectedItem.date}</span>
              </div>
              <h1 className="text-lg font-semibold text-slate-100 tracking-tight">{selectedItem.title}</h1>
            </div>

            <div className="bg-slate-950/50 p-4 rounded-lg border border-slate-800/80">
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1.5 font-mono">Overview</h4>
              <p className="text-sm text-slate-300 leading-relaxed">{selectedItem.description}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-3 bg-slate-950/30 rounded-lg border border-slate-800">
                <h4 className="text-xs font-mono text-slate-500 mb-1">Attack Vector Classification</h4>
                <p className="text-sm font-medium text-slate-300">{selectedItem.vector}</p>
              </div>
              <div className="p-3 bg-slate-950/30 rounded-lg border border-slate-800">
                <h4 className="text-xs font-mono text-slate-500 mb-1">Recommended Direct Action</h4>
                <p className="text-sm font-medium text-emerald-400">{selectedItem.remediation}</p>
              </div>
            </div>

            <div className="flex flex-col space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest font-mono flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-cyan-400" />
                  Remediation & Forensic Intel (AI Core)
                </h3>
                {!analysis && !generatingPlaybook && (
                  <button
                    onClick={() => getAnalysis(selectedItem)}
                    className="text-xs px-3 py-1.5 bg-cyan-700 hover:bg-cyan-600 text-cyan-50 font-mono rounded-lg transition-all flex items-center gap-1.5 shadow-[0_0_15px_rgba(6,182,212,0.1)] active:scale-95"
                  >
                    <Terminal className="w-3.5 h-3.5" />
                    Generate Playbook
                  </button>
                )}
              </div>

              <div className="min-h-[140px] max-h-[300px] overflow-y-auto bg-slate-950 border border-slate-800 rounded-lg p-4 font-mono text-xs text-slate-300 leading-relaxed flex flex-col relative">
                {generatingPlaybook ? (
                  <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm flex flex-col items-center justify-center space-y-3">
                    <div className="w-6 h-6 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-xs text-cyan-400 animate-pulse">Consulting sovereign threat registers...</span>
                  </div>
                ) : null}

                {analysis ? (
                  <div className="space-y-4 markdown-body pr-1 select-text">
                    {analysis.split("\n").map((line, idx) => {
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
                        return null; // Simple code block styling
                      }
                      return <p key={idx} className="text-slate-400">{line}</p>;
                    })}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center my-auto py-8 text-slate-600">
                    <Shield className="w-8 h-8 mb-2 opacity-30 text-cyan-400" />
                    <span className="text-center">Select "Generate Playbook" to invoke CyberShield Intelligent Core remediation matrix.</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-slate-500 font-mono text-xs py-16">
            <AlertTriangle className="w-8 h-8 text-amber-500/40 mb-2" />
            Please select an active threat advisory profile to proceed.
          </div>
        )}
      </div>
    </div>
  );
}
