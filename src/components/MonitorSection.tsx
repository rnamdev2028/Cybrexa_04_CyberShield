import React, { useState, useEffect, useRef } from "react";
import { Terminal, Shield, Play, Pause, AlertTriangle, ShieldCheck, Database, WifiOff, Globe, Server, UserCheck } from "lucide-react";
import { LiveLog } from "../types";
import { motion, AnimatePresence } from "motion/react";

export default function MonitorSection() {
  const [logs, setLogs] = useState<LiveLog[]>([]);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [filterType, setFilterType] = useState<string>("ALL");
  const [soundEnabled, setSoundEnabled] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    fetchLogs();
    
    // Auto 3-second auto-update sequence as explicitly specified in the reference image
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        tickLogs();
      }, 3000);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying]);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/live-logs");
      const data = await res.json();
      if (data.success) {
        setLogs(data.logs);
      } else {
        setError("Failed loading initial telemetry stream.");
      }
    } catch (err) {
      setError("Lost connection to security telemetry agent.");
    } finally {
      setLoading(false);
    }
  };

  const playTickSound = () => {
    if (!soundEnabled) return;
    try {
      // Create lightweight, professional high-frequency synthetic oscillator sound (cyber scan tick)
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      
      osc.type = "sine";
      osc.frequency.setValueAtTime(1200, audioCtx.currentTime); // High pitch tick
      gain.gain.setValueAtTime(0.01, audioCtx.currentTime);     // Very quiet
      gain.gain.exponentialRampToValueAtTime(0.00001, audioCtx.currentTime + 0.1);
      
      osc.start();
      osc.stop(audioCtx.currentTime + 0.1);
    } catch (e) {
      // Browser block policy silent safety
    }
  };

  const tickLogs = async () => {
    try {
      const res = await fetch("/api/live-logs");
      const data = await res.json();
      if (data.success) {
        playTickSound();
        setLogs(prev => {
          // Shuffle timestamps or rotate items to simulate a continuous feed
          const freshLogs: LiveLog[] = data.logs.map((log: LiveLog) => {
            const time = new Date();
            // Randomize seconds slightly to appear authentic
            time.setSeconds(time.getSeconds() - Math.floor(Math.random() * 5));
            return {
              ...log,
              id: "alt-" + Math.random().toString(36).substr(2, 5),
              timestamp: time.toISOString().replace("T", " ").substring(0, 19)
            };
          });
          
          // Prepend 2 fresh logs, merge and slice to keep top 25 logs
          return [...freshLogs.slice(0, 2), ...prev].slice(0, 25);
        });
      }
    } catch (e) {
      // Backend error toleration
    }
  };

  const getLogColor = (type: string, severity: string) => {
    if (severity === "CRITICAL") return "bg-red-500/15 border-red-500/30 text-red-400";
    if (severity === "HIGH") return "bg-orange-500/15 border-orange-500/30 text-orange-400";
    if (severity === "MODERATE") return "bg-yellow-500/15 border-yellow-500/30 text-yellow-300";
    return "bg-blue-500/15 border-blue-500/30 text-blue-400";
  };

  const filteredLogs = logs.filter(log => {
    if (filterType === "ALL") return true;
    if (filterType === "CRITICAL") return log.severity === "CRITICAL";
    return log.type === filterType;
  });

  return (
    <div className="flex flex-col space-y-4 bg-slate-900/60 p-5 rounded-xl border border-slate-800 backdrop-blur-md" id="monitor-section-viewport">
      {/* Top controls and filter dashboard */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-sm font-semibold tracking-wider text-slate-400 uppercase flex items-center gap-2">
            <Terminal className="w-4 h-4 text-cyan-400" />
            Live Threat Stream (Audit Event Log)
          </h2>
          <p className="text-xs text-slate-500 mt-1">Real-time log aggregation ticker updating on 3000ms loop intervals.</p>
        </div>

        <div className="flex flex-wrap items-center gap-3 font-mono text-xs">
          {/* Pause / Play Indicator */}
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`px-3 py-1.5 rounded-lg border transition-all flex items-center gap-1.5 ${
              isPlaying 
                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20"
                : "bg-slate-950 text-slate-500 border-slate-800 hover:border-slate-700 hover:text-slate-400"
            }`}
          >
            {isPlaying ? (
              <>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                <Pause className="w-3.5 h-3.5" />
                <span>MONITORING LIVE</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5" />
                <span>MONITOR PAUSED</span>
              </>
            )}
          </button>

          {/* Synthetic Radar Tick audio */}
          <button
            onClick={() => {
              setSoundEnabled(!soundEnabled);
              playTickSound();
            }}
            className={`px-2.5 py-1.5 rounded-lg border transition-colors ${
              soundEnabled
                ? "bg-cyan-500/10 border-cyan-500/40 text-cyan-400"
                : "bg-slate-950 border-slate-800 text-slate-500 hover:border-slate-700"
            }`}
          >
            Tick Speaker: {soundEnabled ? "ON" : "OFF"}
          </button>
        </div>
      </div>

      {/* Categories / Filter tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-900">
        {[
          { key: "ALL", label: "All Logs" },
          { key: "CRITICAL", label: "Critical Severity" },
          { key: "MALICIOUS_C2", label: "C2 Signals" },
          { key: "BRUTE_FORCE", label: "Brute Force" },
          { key: "WAF_BLOCK", label: "SQLi Controls" },
          { key: "EXFILTRATION", label: "Exfiltration" }
        ].map((btn) => (
          <button
            key={btn.key}
            onClick={() => setFilterType(btn.key)}
            className={`px-3 py-1.5 rounded-md text-xs font-mono border transition-all ${
              filterType === btn.key
                ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/30"
                : "bg-slate-950/40 text-slate-500 border-slate-800/80 hover:border-slate-700 hover:text-slate-400"
            }`}
          >
            {btn.label}
          </button>
        ))}
      </div>

      {/* Terminal View */}
      <div className="flex-1 overflow-hidden rounded-lg border border-slate-950 shadow-2xl relative flex flex-col bg-slate-950/90 font-mono text-xs">
        <div className="bg-slate-900 px-4 py-2 border-b border-slate-950 flex items-center justify-between text-slate-500 select-none">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500/60"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/60"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-green-500/60"></span>
            <span className="text-[10px] uppercase font-bold text-slate-400 border-l border-slate-800 pl-2 ml-1">Terminal Shell</span>
          </div>
          <span className="text-[10px] text-slate-600">secure-gateway@cybershield:~$</span>
        </div>

        <div className="flex-1 p-4 overflow-y-auto max-h-[380px] space-y-4">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-500 gap-3">
              <div className="w-5 h-5 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
              <span>Synchronizing system logs thread...</span>
            </div>
          ) : error ? (
            <div className="text-red-400 p-4 border border-red-950 bg-red-950/20 rounded-lg">
              {error}
            </div>
          ) : filteredLogs.length === 0 ? (
            <div className="text-slate-600 text-center py-16 uppercase select-none tracking-widest text-[10px]">
              NO ACTIVE FILTER MATCHED TELEMETRY.
            </div>
          ) : (
            <div className="space-y-2.5">
              <AnimatePresence initial={false}>
                {filteredLogs.map((log) => (
                  <motion.div
                    key={log.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className={`p-3 rounded-lg border leading-relaxed flex flex-col md:flex-row md:items-center justify-between gap-3 ${getLogColor(log.type, log.severity)}`}
                  >
                    <div className="flex flex-col md:flex-row md:items-start gap-2.5 flex-1 min-w-0">
                      {/* Log Category indicators */}
                      <span className="text-[10px] font-bold border rounded px-1.5 py-0.5 bg-slate-950/60 uppercase tracking-wider shrink-0 text-center font-mono select-none">
                        {log.type}
                      </span>
                      <div className="flex flex-col min-w-0">
                        <p className="text-slate-200 font-medium select-text">{log.description}</p>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-[10px] text-slate-500">
                          <span className="flex items-center gap-1 text-slate-400">
                            <Server className="w-3 h-3 text-cyan-400/80" /> Source: <span className="text-slate-300 font-bold">{log.sourceIp}</span>
                          </span>
                          <span>protocol: {log.protocol}</span>
                          {log.count > 1 && <span className="text-cyan-400">hits: {log.count}x</span>}
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0 flex md:flex-col items-center md:items-end justify-between font-mono text-[10px] text-slate-500">
                      <span className="bg-slate-950 px-2 py-0.5 rounded text-slate-400 tracking-wider">
                        {log.status}
                      </span>
                      <span className="text-slate-600 font-mono mt-1 pr-1 md:pr-0">
                        {log.timestamp || new Date().toISOString().slice(11, 19)}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
