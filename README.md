# CyberShield Enterprise — Tactical Command Command Center

An enterprise-grade, full-stack cybersecurity threat intelligence, live monitoring, and automated incident playbook mitigation hub. Designed as a high-fidelity capstone project, **CyberShield** empowers security engineers, analysts, and CISOs with deep network insights, responsive charts, automated playbooks, and WHOIS directory intelligence.

---

## 🚀 Key Architectural Modules

### 1. 📰 Vulnerability News Aggregator & AI Playbook Engine
*   **What it does:** Aggregates critical zero-day exploit disclosures, ransomware campaigns, and supply-chain vulnerability profiles.
*   **AI Core Integration (White-Labeled):** Invokes the highly proprietary *CyberShield Security Advisory Core* to dynamically generate technical impact analysis sheets, containment playbooks, custom Snort/Yara rules, and firewall policy templates for any highlighted advisory.

### 2. 📊 Interactive Threat Analytics Dashboard
*   **What it does:** Displays responsive visual breakdowns of active telemetry severity distributions (Critical, High, Moderate, Low) and attack vector incidence counts.
*   **SOC Simulator:** Allows security analysts to "detonate" realistic simulated attacks (Ransomware deployment, WAF bypass attempts, or credential brute-forcing) and immediately watch telemetry vectors shift, system risk score indexes update, and event engine logs stream.

### 3. 🖥️ Real-Time Audit & Event Monitor
*   **What it does:** Connects to a telemetry network stream simulation on a continuous update loop.
*   **Acoustic Radar Ticks:** Features optional sub-decibel audio feedback representing micro-event scans, fully filterable by custom event blocks (C2 signals, Brute force, WAF blocks).

### 4. 🌐 IP & Domain Source Intelligence Dossier
*   **What it does:** Provokes immediate reputation lookup indices for arbitrary IPv4 nodes or web domains.
*   **Intelligence Dossier Output:** Returns structured registration organizations, geo-location classifications, historical risk weights, security reputation evaluations, and precise IPtables or Nginx blocking syntax.

### 5. 🎓 Cybersecurity Knowledge Hub & Certification Coach
*   **What it does:** Enhances auxiliary learning through fully structured cybersecurity terminology dictionaries and categories.
*   **CISOP/Sec+ Coach:** Features a interactive multiple-choice mock challenge suite with rationale explanations, alongside a questions-and-answers help console for secure coding practices.

---

## 🛠️ Technology Stack & Dependencies

*   **Frontend:** React 19, TypeScript, Vite, Tailwind CSS v4, Motion (Animations)
*   **Backend Support:** Node.js, Express, `google/genai` (secure server-side integration fully white-labeled), dotenv
*   **Visualizations:** Recharts (High-fidelity responsive charting library)
*   **Icons:** Lucide-React

---

## ⚙️ Local Development Setup

Follow these commands to deploy CyberShield on your local machine:

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Configure Environment Variables:**
   Create a `.env` file in your root workspace:
   ```env
   GEMINI_API_KEY="your_api_key_here"
   ```

3. **Launch the Server:**
   ```bash
   npm run dev
   ```
   Open your browser to the local server address (default is `http://localhost:3000`).

4. **Production Build Compilation:**
   ```bash
   npm run build
   ```
