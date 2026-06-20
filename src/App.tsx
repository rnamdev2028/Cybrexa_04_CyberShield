import React, { useState, useEffect } from "react";
import { Shield, Bell, Network, Power, CheckCircle, Database } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { TabType } from "./types";

// Import custom sections
import NewsSection from "./components/NewsSection";
import AnalyticsSection from "./components/AnalyticsSection";
import MonitorSection from "./components/MonitorSection";
import IntelSection from "./components/IntelSection";
import KnowledgeSection from "./components/KnowledgeSection";

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>("news");
  const [newsCount, setNewsCount] = useState<number>(4);
  const [threatScore, setThreatScore] = useState<number>(75);
  const [sysTime, setSysTime] = useState<string>("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setSysTime(now.getUTCFullYear() + "-" + 
                 String(now.getUTCMonth() + 1).padStart(2, "0") + "-" + 
                 String(now.getUTCDate()).padStart(2, "0") + " " + 
                 String(now.getUTCHours()).padStart(2, "0") + ":" + 
                 String(now.getUTCMinutes()).padStart(2, "0") + ":" + 
                 String(now.getUTCSeconds()).padStart(2, "0") + " UTC");
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const tabList = [
    {
      id: "news" as TabType,
      num: "1",
      title: "NEWS AGGREGATOR",
      desc: "Fetch real-time cyber security news (API)",
    },
    {
      id: "analytics" as TabType,
      num: "2",
      title: "THREAT ANALYTICS",
      desc: "Visual charts",
    },
    {
      id: "monitor" as TabType,
      num: "3",
      title: "Live Monitor",
      desc: "Auto-refresh news • Auto 3s update",
    },
    {
      id: "intel" as TabType,
      num: "4",
      title: "IP & SOURCE INTEL",
      desc: "WHOIS • Geo",
    },
    {
      id: "knowledge" as TabType,
      num: "5",
      title: "KNOWLEDGE HUB",
      desc: "Cyber security glossary",
    }
  ];

  return (
    <div className="min-h-screen bg-[#020617] text-slate-300 p-4 md:p-6 flex flex-col space-y-6 select-none font-sans" id="cybershield-main-workspace">
      
      {/* Top Banner & Header Indicators conforming to the Sleek Interface style */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4 bg-[#0f172a]/40 p-4 rounded-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-cyan-500 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.5)]">
            <div className="w-6 h-6 border-2 border-white rotate-45 flex items-center justify-center">
              <div className="w-2 h-2 bg-white"></div>
            </div>
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
              CyberShield 
              <span className="text-[10px] bg-cyan-500/10 text-cyan-400 px-2 py-0.5 border border-cyan-500/30 rounded font-mono uppercase">
                Enterprise
              </span>
            </h1>
          </div>
        </div>

        {/* Global state gauges (Perfectly aligned with Sleek design aesthetics) */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-3 bg-slate-900/80 px-4 py-2 rounded-full border border-slate-700">
            <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]"></div>
            <span className="text-xs font-semibold text-emerald-400 font-mono tracking-wider">LIVE TRAFFIC ANALYTICS</span>
          </div>
        </div>
      </header>

      {/* Main 5-Column Navigation Matrix conforming to Sleek Interface header accent colors */}
      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3" id="navigation-matrix-board">
        {tabList.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="text-left w-full transition-all duration-300 transform active:scale-[0.98] outline-none"
            >
              {/* Top Highlight Cyan Line */}
              <div 
                className={`h-1.5 w-full rounded-t-md transition-all duration-300 ${
                  isActive ? "bg-cyan-500 shadow-[0_0_12px_rgba(6,182,212,0.8)]" : "bg-slate-800/60"
                }`}
              />
              
              {/* Base Interactive Card */}
              <div 
                className={`p-4 rounded-b-lg border-x border-b transition-all duration-300 h-[130px] flex flex-col justify-between ${
                  isActive
                    ? "bg-[#0f172a] border-cyan-500/30 shadow-[0_4px_25px_rgba(6,182,212,0.08)]"
                    : "bg-[#090d16] border-slate-800 hover:border-slate-700 hover:bg-[#0f172a]/30"
                }`}
              >
                <div className="text-center font-bold font-mono text-cyan-400/80 text-xs">
                  {tab.num}
                </div>
                
                <div className="text-center">
                  <h3 className={`text-[11px] font-bold tracking-wider font-mono uppercase transition-colors duration-300 ${
                    isActive ? "text-cyan-400" : "text-slate-300"
                  }`}>
                    {tab.title}
                  </h3>
                  <p className="text-[10px] text-slate-500 font-sans mt-2 leading-relaxed text-center">
                    {tab.desc}
                  </p>
                </div>
                
                {/* Visual marker inside active cards */}
                <div className="flex justify-center">
                  <span className={`w-1 h-1 rounded-full transition-all duration-300 ${
                    isActive ? "bg-cyan-400 scale-150 animate-pulse" : "bg-transparent"
                  }`} />
                </div>
              </div>
            </button>
          );
        })}
      </section>

      {/* Active Workstation Output area */}
      <main className="flex-1 min-h-[460px] relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
            className="w-full h-full"
          >
            {activeTab === "news" && <NewsSection />}
            {activeTab === "analytics" && <AnalyticsSection />}
            {activeTab === "monitor" && <MonitorSection />}
            {activeTab === "intel" && <IntelSection />}
            {activeTab === "knowledge" && <KnowledgeSection />}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Seamless corporate footer without unrequested elements */}
      <footer className="border-t border-slate-800 pt-4 flex flex-col sm:flex-row sm:items-center justify-between text-[10px] font-mono text-slate-600 gap-2 bg-[#020617] px-4 py-3 rounded-lg">
        <div className="flex gap-6 items-center">
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 font-bold uppercase">System Latency</span>
            <span className="text-emerald-500">14ms</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 font-bold uppercase">DB Integrity</span>
            <span className="text-emerald-500">99.9%</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 font-bold uppercase">Sovereign Shutter</span>
            <span className="text-cyan-400">NOMINAL</span>
          </div>
        </div>
        <div>
          ENCRYPTION LEVEL: AES-256-GCM [VERIFIED]
        </div>
      </footer>

    </div>
  );
}
