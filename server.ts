import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Mock global in-memory news database
const MOCK_NEWS = [
  {
    id: "news-1",
    title: "Critical VPN Zero-Day Exploit Actively Target Edge Devices",
    description: "A remote code execution vulnerability (CVSS 9.8) enables unauthenticated attackers to bypass secure network gateways and launch secondary lateral operations inside corporate networks.",
    vector: "Edge Gateway / Exploit",
    date: "2026-06-18",
    severity: "CRITICAL",
    remediation: "Disable VPN portals temporarily or apply urgent firmware patch v11.4.2 instantly, monitor SSH activity audits.",
    cve: "CVE-2026-8924"
  },
  {
    id: "news-2",
    title: "Double-Extortion Ransomware Campaign Hits Healthcare Sector",
    description: "A sophisticated ransomware-as-a-service (RaaS) group executes automated phishing and active directory compromise, targeting digital healthcare databases and exfiltrating critical records.",
    vector: "Ransomware / Phishing",
    date: "2026-06-17",
    severity: "HIGH",
    remediation: "Deploy strict endpoint EDR isolation protocols, enforce multi-factor authentication (MFA) on AD controls, restore backups safely offline.",
    cve: "CVE-2026-5120"
  },
  {
    id: "news-3",
    title: "DNS-over-HTTPS Tunneling Active in Cloud Environments",
    description: "Threat actors exploit standard recursive DNS queries to mask bi-directional Command & Control (C2) channels, quietly leaking proprietary industrial assets from containerized environments.",
    vector: "Data Exfiltration / C2",
    date: "2026-06-16",
    severity: "MEDIUM",
    remediation: "Enforce deep packet inspection (DPI) on outgoing TLS payloads, block non-approved external DNS resolutions on firewalls.",
    cve: "CVE-2026-3391"
  },
  {
    id: "news-4",
    title: "Compromised Node Package Found Injecting System Loader",
    description: "A malicious package found in open-source registries has been poisoning dev pipelines, injecting compressed assembly libraries to download credential harvesting binaries during deployment builds.",
    vector: "Supply Chain / DevSecOps",
    date: "2026-06-15",
    severity: "HIGH",
    remediation: "Audit lockfiles instantly, restrict unvetted public package imports, implement automated SBOM verification sweeps.",
    cve: "CVE-2026-4411"
  }
];

// Mock event feeds for Live Monitor simulation
const MOCK_ALERTS_BASE = [
  { id: "alt-1", type: "BRUTE_FORCE", sourceIp: "185.34.22.90", protocol: "SSH (Port 22)", severity: "MODERATE", status: "BLOCKED", count: 124, description: "Multiple rapid authentication failures for user 'root'" },
  { id: "alt-2", type: "PORT_SCAN", sourceIp: "82.102.5.11", protocol: "SYN Sweep", severity: "LOW", status: "ACK_IGNORED", count: 1402, description: "Host sweep targeting core database ports (3306, 5432, 1433)" },
  { id: "alt-3", type: "MALICIOUS_C2", sourceIp: "10.0.4.55", protocol: "HTTPS (Port 443)", severity: "CRITICAL", status: "EVALUATING", count: 8, description: "Outbound communication spike to verified adversary command nodes over SSL" },
  { id: "alt-4", type: "WAF_BLOCK", sourceIp: "198.51.100.12", protocol: "HTTP (SQL injection)", severity: "HIGH", status: "MITIGATED", count: 35, description: "SQL Injection payload detected and blocked at edge load balancer" },
  { id: "alt-5", type: "EXFILTRATION", sourceIp: "10.0.12.91", protocol: "SFTP (Port 22)", severity: "CRITICAL", status: "QUARANTINED", count: 1, description: "Abnormal payload transfer (14.2 GB) detected to unapproved target domain" }
];

// Cybersecurity GLOSSARY items
const MOCK_GLOSSARY = [
  { word: "Zero-Day Exploit", category: "Vulnerabilities", description: "An attack that targets a software or hardware vulnerability before the vendor is aware or has created a corresponding patch." },
  { word: "Advanced Persistent Threat (APT)", category: "Threat Actors", description: "A highly stealthy, resource-rich cyber espionage threat group (often state-sponsored) pursuing prolonged strategic targets." },
  { word: "Defense in Depth", category: "Methodology", description: "A system defense strategy relying on multiple overlapping layers of administrative, technical, and physical security measures." },
  { word: "Cross-Site Scripting (XSS)", category: "Exploits", description: "A client-side security vulnerability where an attacker injects malicious client scripts directly into safe web applications." },
  { word: "Mitre ATT&CK Framework", category: "Methodology", description: "Globally accessible structured knowledge matrix tracking adversary tactics, techniques, and procedures based on actual incidents on systems." },
  { word: "EDR (Endpoint Detection and Response)", category: "Infrastructure", description: "An integrated security solution that continuously monitors client endpoints to record, inspect, and automatically block malicious actions." },
  { word: "C2 (Command and Control)", category: "Exploits", description: "A system of computer servers used by cyber criminals or APTs to coordinate instructions and transmit exfiltrated data from inside networks." },
  { word: "SQL Injection (SQLi)", category: "Exploits", description: "A vulnerability where malicious SQL commands are structured within inputs to breach, manipulate, or steal database structures." }
];

// Active mock threat index counters for live updating charts
let dynamicActivityStats = {
  incidentCount: 524,
  severityDistribution: [
    { name: "Critical", value: 38 },
    { name: "High", value: 112 },
    { name: "Moderate", value: 214 },
    { name: "Low", value: 160 }
  ],
  threatVectors: [
    { name: "Phishing", incidents: 198, riskScore: 82 },
    { name: "Credential Abuse", incidents: 145, riskScore: 78 },
    { name: "VPN Zero-Day", incidents: 82, riskScore: 95 },
    { name: "Malware Loader", incidents: 99, riskScore: 72 }
  ]
};

/* =======================================
   API ENDPOINTS
   ======================================= */

// Endpoint for News Aggregator
app.get("/api/news", (req, res) => {
  res.json({ success: true, news: MOCK_NEWS });
});

// Endpoint for AI News Breakdown & mitigation playbook
app.post("/api/news/breakdown", async (req, res) => {
  const { title, description, cve, severity } = req.body;

  if (!title) {
    return res.status(400).json({ success: false, error: "News brief context required." });
  }

  const mockAnalysis = `### Heuristic Intelligence Assessment for Vulnerability
The security threat associated with **${cve || "TBD / Pending"}** represents a significant exposure vector. An unauthenticated remote threat actor can exploit this path to bypass normal validation, execute arbitrary instructions, or hijack session boundaries on affected servers. Edge gateway tunnels, remote directories, and containerized internal databases are highly endangered from lateral activity sweeps.

### Tactical Incident Containment & mitigation playbook
1. **Perimeter Isolation**: Segregate external edge directories or immediately block unwanted incoming requests at your application-level firewalls.
2. **Session Revocation**: Revoke all active administrator sessions, invalid API tokens, and VPN authentications initialized during the suspected timeframe.
3. **Log Audit & Inspection**: Extensively analyze system access logs, proxy registers, and target host database commands to discover footprints or trace file changes.
4. **Service Patching**: Install security upgrades and apply patches distributed by upstream vendors, keeping affected segments isolated during testing.

### Network Mitigation Block Syntax
\`\`\`nginx
# Nginx Endpoint Defense Heuristics
server {
    location ~* /vulnerable-endpoint-path {
        deny all;
        return 403 "Incident Prevention Block Active";
    }
}
\`\`\`

### Heuristic Detection Yara Rule
\`\`\`yara
rule Heuristic_Exploit_Detection {
    meta:
        description = "Identifies suspected exploit attempt for ${cve || 'TBD / Pending'}"
        severity = "${severity || 'HIGH'}"
    strings:
        $sig_vulnerable_payload = "exploit_command_string"
        $hex_header_buffer = { 4D 5A 90 00 03 00 00 00 }
    condition:
        any of them
}
\`\`\`

*(Note: Running in Heuristic Analytics Engine Mode)*`;

  res.json({ success: true, analysis: mockAnalysis });
});

// Endpoint for Threat Analytics & Charts Data
app.get("/api/threat-analytics", (req, res) => {
  res.json({
    success: true,
    stats: dynamicActivityStats,
    liveScore: Math.floor(Math.random() * 15) + 75 // Mock threat temperature index
  });
});

// Endpoint for generating live monitor logs stream simulation
app.get("/api/live-logs", (req, res) => {
  // Generate random new logs or append timestamps to mock base
  const now = new Date();
  const logs = MOCK_ALERTS_BASE.map(alert => {
    // Randomize time offset within last 60 seconds
    const diff = Math.floor(Math.random() * 60) * 1000;
    const time = new Date(now.getTime() - diff);
    return {
      ...alert,
      timestamp: time.toISOString().replace("T", " ").substring(0, 19),
      // Randomize source IP sometimes
      sourceIp: Math.random() > 0.4 ? alert.sourceIp : `192.168.${Math.floor(Math.random() * 254) + 1}.${Math.floor(Math.random() * 254) + 1}`
    };
  });
  res.json({ success: true, logs });
});

// Endpoint for IP & Source Intelligence Search
app.post("/api/ip-intel", async (req, res) => {
  const { query } = req.body;

  if (!query) {
    return res.status(400).json({ success: false, error: "Please enter a valid IP address or Domain." });
  }

  // Basic IP matching regex pattern
  const isIP = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/.test(query);

  const mockRepScore = Math.floor(Math.random() * 65) + 30; // Heuristic fake score
  const targetType = isIP ? "IP Address" : "Domain Address";
  
  const mockIntel = `### Heuristic Threat Dossier for Target: ${query}

### 1. Target Demographics
- **Target Category**: ${targetType}
- **Registry Owner / Organization**: CyberShield Geo-Block Sentinel (Simulated Lookup)
- **Geographic Country Location**: Switzerland (CH) / Netherlands (NL)
- **Cloud Provider / ISP / ASN**: Sovereign Host Networks (ASN-48291)
- **Active vulnerable Ports**: TCP 22 (SSH), TCP 80 (HTTP), TCP 443 (HTTPS), TCP 8080 (Alternative Dev)

### 2. Heuristic Security Reputation Verdict
- **Calculated Threat Weight**: **${mockRepScore} / 100**
- **Sovereign Risk Level**: ${mockRepScore >= 80 ? "CRITICAL BREACH HAZARD" : mockRepScore >= 50 ? "MEDIUM SUSPICION / ABUSE THREAT" : "NOMINAL / MINOR INCIDENT RATE"}
- **Malicious Threat Classification**: Suspicious SSH credential guessing, high-port scans, and periodic Command & Control recursive requests detected.

### 3. Historical Incident Audit
- **Past 7 Days Logs**: 42 logged connection anomalies, suspected lateral port sweeping activities, and spoofed HTTP requests originating from associated subnets.
- **Current Threat Status**: Active quarantine registry entry.

### 4. Tactical Network Mitigation Controls
Use the following Nginx block syntax to prevent unwanted connections originating from this target:

\`\`\`nginx
# Nginx Threat Source Quarantine Rule
deny ${isIP ? query : "/* suspicious domain traffic block */"};
\`\`\`

To implement a strict IPTables host block rule, apply this syntax in your command prompt:

\`\`\`bash
# Linux Firewall IP Block Command
iptables -A INPUT -s ${isIP ? query : "185.220.101.4"} -j DROP
\`\`\`

*(Note: Running in Heuristic Threat Intelligence Mode)*`;

  res.json({
    success: true,
    intel: mockIntel,
    target: query,
    type: isIP ? "IP" : "Domain",
    riskScore: mockRepScore
  });
});

// Endpoint for Knowledge Assistant & SecOps Help
app.post("/api/knowledge/ask", async (req, res) => {
  const { question } = req.body;

  if (!question) {
    return res.status(400).json({ success: false, error: "Question cannot be empty." });
  }

  const mockAnswer = `### Heuristic Concept Clarification: "${question}"

Excellent cybersecurity inquiry. Here is the technical breakdown to guide secure infrastructure development practices:

### 1. Security Overview
Cybersecurity principles require defending operations at multiple technical layers. To resolve issues or threats similar to your query, engineers prioritize **defense-in-depth methodologies**, enforce strict **least-privilege policies**, and secure configuration entry channels.

### 2. Tactical Mitigation & Best Practices
- **Input Validation**: Never trust external requests. Sanitize arrays, restrict character spaces, and enforce deep payload schema audits.
- **Service Segregation**: Place critical servers, databases, and AI pipelines in isolated firewall subnets without direct external access routing.
- **Continuous Monitoring**: Integrate centralized log collectors (SIEM) to ingest system outputs, keeping alarms responsive.

### 3. Secure Architecture Implementation Example
Ensure safe communication channels are negotiated securely:
\`\`\`javascript
// Express Security Header Configuration Example
const helmet = require('helmet');
app.use(helmet()); // Enforce critical HTTP security headers
\`\`\`

### 4. Heuristic SecOps Challenger Question
Test your understanding of the concept:

**Question**: Which layer is most critical when designing for Defense-in-Depth?
- A) Network Firewall perimeter
- B) System Authorization & access rules
- C) Database query encryption
- D) All of the above (Layers must overlap)

**Correct Answer**: **D**
*Rationale: True defense in depth requires relying on overlapping layers of control. If any single parameter fails, auxiliary protection bounds prevent full-scale vulnerability compromise.*

*(Note: Running in Heuristic SecOps Intelligence Advisory Mode)*`;

  res.json({ success: true, answer: mockAnswer });
});

// Endpoint for glossary search base list
app.get("/api/glossary", (req, res) => {
  res.json({ success: true, glossary: MOCK_GLOSSARY });
});

/* =======================================
   VITE & STATIC ASSETS SETUP
   ======================================= */

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    // Dev environment: mount Vite middleware for high-fidelity rendering
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log("Vite development middleware mounted.");
  } else {
    // Production environment: serve bundled static assets
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*all", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
    console.log("Serving production static layout files.");
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[CyberShield Core Webserver IP: 0.0.0.0 - PORT: ${PORT}] Listening for security telemetry...`);
  });
}

startServer();
