import React, { useState, useEffect } from "react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell } from "recharts";
import { Sliders, RefreshCw, Flame, ShieldAlert, Cpu, AlertCircle, Database, HelpCircle, ChevronRight } from "lucide-react";
import { motion } from "motion/react";
import { AnalyticsStats } from "../types";

export default function AnalyticsSection() {
  const [stats, setStats] = useState<AnalyticsStats>({
    incidentCount: 524,
    severityDistribution: [
      { name: "Critical", value: 38 },
      { name: "High", value: 112 },
      { name: "Moderate", value: 214 },
      { name: "Low", value: 160 }
    ],
    threatVectors: [
      { name: "Phishing", incidents: 198, riskScore: 82 },
      { name: "Cred Abuse", incidents: 145, riskScore: 78 },
      { name: "VPN ZeroDay", incidents: 82, riskScore: 95 },
      { name: "Malware Payload", incidents: 99, riskScore: 72 }
    ]
  });

  const [activeSimulation, setActiveSimulation] = useState<string | null>(null);
  const [systemRiskScore, setSystemRiskScore] = useState<number>(78);
  const [incidentMultipler, setIncidentMultiplier] = useState<number>(1);
  const [simLog, setSimLog] = useState<string[]>(["CyberShield Analytics core warmed up.", "Listening on interfaces vnet0, tailscale0..."]);

  const PIE_COLORS = ["#ef4444", "#f97316", "#eab308", "#3b82f6"];

  const detonateIncident = (type: string) => {
    setActiveSimulation(type);
    let name = "";
    let logs: string[] = [];
    let incCountAdd = 0;
    let riskAdd = 0;

    switch (type) {
      case "ransomware":
        name = "Hermes Ransomware Detonation Simulated";
        incCountAdd = 78;
        riskAdd = 15;
        logs = [
          "ALERT: Mass Canary file corruption detected on Server AD-02",
          "EDR: Threat identified block signature hash '0xAE89BF'",
          "SOC: Isolating subnet block 10.0.12.0/24 automatically",
          "CYBERSHIELD: Initiating offline backup restoration routine."
        ];
        break;
      case "sqli":
        name = "Web Application SQLi Sweep Detected";
        incCountAdd = 45;
        riskAdd = 6;
        logs = [
          "WAF: Request blocked from host 182.12.9.2 due to regex query signature 'UNION SELECT'",
          "DB: PostgreSQL reporting unusual syntax failures on schema user_tables",
          "SOC: Source IP automatically routed to Cloudflare IP ban list."
        ];
        break;
      case "bruteforce":
        name = "APT32 Automated Brute Force Run";
        incCountAdd = 120;
        riskAdd = 8;
        logs = [
          "IDS: Auth threshold violated: 240 failed password trials in 12s on LDAP servers",
          "SYSTEM: Enforcing progressive login delay on gateway portal for all non-federated subnets",
          "SOC: Generating automatic incident report dossier."
        ];
        break;
      default:
        break;
    }

    setSimLog(prev => [ `[${new Date().toLocaleTimeString()}] >> SYSTEM TRIGGER: ${name}`, ...logs, ...prev ].slice(0, 10));

    // Shift statistical data based on detonation to make it highly interactive!
    setStats(prev => {
      const updatedSeverity = prev.severityDistribution.map(item => ({ ...item }));
      if (type === "ransomware") {
        updatedSeverity[0].value += 20; // Critical
        updatedSeverity[1].value += 30; // High
      } else if (type === "sqli") {
        updatedSeverity[1].value += 15; // High
        updatedSeverity[2].value += 20; // Moderate
      } else {
        updatedSeverity[2].value += 40; // Moderate
        updatedSeverity[3].value += 30; // Low
      }

      const updatedVectors = prev.threatVectors.map(vec => {
        if (type === "ransomware" && vec.name === "Malware Payload") {
          return { ...vec, incidents: vec.incidents + incCountAdd, riskScore: Math.min(vec.riskScore + 8, 99) };
        }
        if (type === "sqli" && vec.name === "VPN ZeroDay") {
          return { ...vec, incidents: vec.incidents + incCountAdd, riskScore: Math.min(vec.riskScore + 4, 99) };
        }
        if (type === "bruteforce" && vec.name === "Cred Abuse") {
          return { ...vec, incidents: vec.incidents + incCountAdd, riskScore: Math.min(vec.riskScore + 12, 99) };
        }
        return vec;
      });

      return {
        incidentCount: prev.incidentCount + incCountAdd,
        severityDistribution: updatedSeverity,
        threatVectors: updatedVectors
      };
    });

    setSystemRiskScore(prev => Math.min(prev + riskAdd, 99));

    setTimeout(() => {
      setActiveSimulation(null);
    }, 2000);
  };

  const resetData = () => {
    setStats({
      incidentCount: 524,
      severityDistribution: [
        { name: "Critical", value: 38 },
        { name: "High", value: 112 },
        { name: "Moderate", value: 214 },
        { name: "Low", value: 160 }
      ],
      threatVectors: [
        { name: "Phishing", incidents: 198, riskScore: 82 },
        { name: "Cred Abuse", incidents: 145, riskScore: 78 },
        { name: "VPN ZeroDay", incidents: 82, riskScore: 95 },
        { name: "Malware Payload", incidents: 99, riskScore: 72 }
      ]
    });
    setSystemRiskScore(74);
    setSimLog(["Telemetry databases recycled.", "Telemetry matrices flushed successfully."]);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="analytics-section-viewport">
      {/* Control Station & Simulator */}
      <div className="lg:col-span-4 flex flex-col space-y-4 bg-slate-900/60 p-4 rounded-xl border border-slate-800 backdrop-blur-md">
        <div>
          <h2 className="text-sm font-semibold tracking-wider text-slate-400 uppercase flex items-center gap-2">
            <Sliders className="w-4 h-4 text-cyan-400" />
            SOC Simulator Station
          </h2>
          <p className="text-xs text-slate-500 mt-1">Simulate attack scenarios to evaluate analytical thresholds and telemetry reactions.</p>
        </div>

        {/* Global Security Risk Temperature Gauge */}
        <div className="bg-slate-950 p-4 rounded-lg border border-slate-800/80 text-center relative overflow-hidden flex flex-col items-center justify-center">
          <div className="absolute top-2 right-2 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping"></span>
            <span className="text-[10px] font-mono text-slate-500">LIVE</span>
          </div>
          <span className="text-xs font-mono text-slate-500 uppercase tracking-widest">Network Threat Level</span>
          <div className="text-4xl font-extrabold font-mono text-cyan-400 mt-1 select-none">
            {systemRiskScore}%
          </div>
          <span className="text-xs text-slate-400/80 mt-1 font-mono">
            {systemRiskScore > 90 ? "CRITICAL OUTBREAK SHIELD" : systemRiskScore > 80 ? "HIGH WATCH ALERT" : "MONITORED BASELINE"}
          </span>

          <div className="w-full bg-slate-900 h-1.5 rounded-full mt-3 overflow-hidden">
            <motion.div 
              className="bg-cyan-500 h-full rounded-full" 
              style={{ width: `${systemRiskScore}%` }}
              animate={{ width: `${systemRiskScore}%` }}
            />
          </div>
        </div>

        {/* Detonation list */}
        <div className="space-y-2">
          <span className="text-[10px] font-bold font-mono uppercase tracking-wider text-slate-500">Telemetry Detonators</span>
          <div className="grid grid-cols-1 gap-2">
            <button
              onClick={() => detonateIncident("ransomware")}
              disabled={activeSimulation !== null}
              className={`p-2.5 rounded-lg border text-left text-xs font-mono flex items-center justify-between transition-all ${
                activeSimulation === "ransomware"
                  ? "bg-red-500/10 border-red-500 text-red-400"
                  : "bg-slate-950 border-slate-800 text-slate-300 hover:border-red-500/30 hover:bg-slate-950/80"
              }`}
            >
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-red-500" />
                <span>Simulate Ransomware Deployment</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 opacity-60" />
            </button>

            <button
              onClick={() => detonateIncident("sqli")}
              disabled={activeSimulation !== null}
              className={`p-2.5 rounded-lg border text-left text-xs font-mono flex items-center justify-between transition-all ${
                activeSimulation === "sqli"
                  ? "bg-orange-500/10 border-orange-500 text-orange-400"
                  : "bg-slate-950 border-slate-800 text-slate-300 hover:border-orange-500/30 hover:bg-slate-950/80"
              }`}
            >
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-orange-500" />
                <span>Simulate SQL Injection Sweep</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 opacity-60" />
            </button>

            <button
              onClick={() => detonateIncident("bruteforce")}
              disabled={activeSimulation !== null}
              className={`p-2.5 rounded-lg border text-left text-xs font-mono flex items-center justify-between transition-all ${
                activeSimulation === "bruteforce"
                  ? "bg-yellow-500/10 border-yellow-500 text-yellow-400"
                  : "bg-slate-950 border-slate-800 text-slate-300 hover:border-yellow-500/30 hover:bg-slate-950/80"
              }`}
            >
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-yellow-500" />
                <span>Trigger Brute Force Spike</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 opacity-60" />
            </button>
          </div>
        </div>

        {/* Real-time incident telemetry feed */}
        <div className="flex flex-col flex-1 bg-slate-950/80 p-3 rounded-lg border border-slate-800/80 min-h-[140px]">
          <div className="flex justify-between items-center border-b border-slate-800 pb-1.5 mb-2">
            <span className="text-[10px] font-bold font-mono text-cyan-400 flex items-center gap-1">
              <Cpu className="w-3 h-3" />
              Event Engine Logs
            </span>
            <button onClick={resetData} className="text-slate-500 hover:text-cyan-400 transition-colors">
              <RefreshCw className="w-3 h-3" />
            </button>
          </div>
          <div className="font-mono text-[10px] text-slate-400 space-y-1.5 overflow-y-auto max-h-[160px] pr-1.5">
            {simLog.map((log, index) => (
              <div key={index} className="line-clamp-2 leading-relaxed">
                <span className="text-slate-600">&gt;&gt;</span> {log}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Charts area */}
      <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-900/60 p-5 rounded-xl border border-slate-800 backdrop-blur-md">
        
        {/* Severity chart */}
        <div className="flex flex-col bg-slate-950/40 border border-slate-800 p-4 rounded-xl min-h-[280px]">
          <div>
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider font-mono">Telemetry Severity Distribution</h3>
            <p className="text-[10px] text-slate-600 mb-2">Reflects aggregated active incidents across all core nodes.</p>
          </div>
          <div className="flex-1 min-h-[180px] flex items-center justify-center relative">
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie
                  data={stats.severityDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={74}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {stats.severityDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: "#0b1329", border: "1px solid #1e293b", borderRadius: "8px", fontFamily: "monospace", fontSize: "11px" }}
                  itemStyle={{ color: "#cbd5e1" }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute flex flex-col items-center select-none text-center">
              <span className="text-xs font-mono text-slate-500">Active Incidents</span>
              <span className="text-lg font-bold font-mono text-slate-200">{stats.incidentCount}</span>
            </div>
          </div>
          <div className="grid grid-cols-4 gap-1 text-center border-t border-slate-900 pt-3">
            {stats.severityDistribution.map((entry, idx) => (
              <div key={idx} className="flex flex-col">
                <span className="text-[10px] font-mono font-semibold" style={{ color: PIE_COLORS[idx] }}>{entry.name}</span>
                <span className="text-sm font-bold font-mono text-slate-300">{entry.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Threat vectors chart */}
        <div className="flex flex-col bg-slate-950/40 border border-slate-800 p-4 rounded-xl min-h-[280px]">
          <div>
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider font-mono">Incident Intensity by Vectors</h3>
            <p className="text-[10px] text-slate-600 mb-2">Tracking breach vectors count mapped against system risk weights.</p>
          </div>
          <div className="flex-1 min-h-[185px]">
            <ResponsiveContainer width="100%" height={210}>
              <BarChart data={stats.threatVectors}>
                <CartesianGrid strokeDasharray="3 3" stroke="#101930" vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" tick={{ fontSize: 9, fontFamily: "monospace" }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 9, fontFamily: "monospace" }} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#0b1329", border: "1px solid #1e293b", borderRadius: "8px", fontFamily: "monospace", fontSize: "11px" }}
                  labelStyle={{ color: "#22d3ee" }}
                  itemStyle={{ fontSize: "11px", height: "14px" }}
                />
                <Bar dataKey="incidents" fill="#22d3ee" radius={[4, 4, 0, 0]}>
                  {stats.threatVectors.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.riskScore > 80 ? "#ef4444" : "#06b6d4"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
}
