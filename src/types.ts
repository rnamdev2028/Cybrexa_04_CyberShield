/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface NewsItem {
  id: string;
  title: string;
  description: string;
  vector: string;
  date: string;
  severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW" | string;
  remediation?: string;
  cve?: string;
}

export interface LiveLog {
  id: string;
  type: string;
  sourceIp: string;
  protocol: string;
  severity: "CRITICAL" | "HIGH" | "MODERATE" | "LOW" | string;
  status: string;
  count: number;
  description: string;
  timestamp?: string;
}

export interface GlossaryItem {
  word: string;
  category: string;
  description: string;
}

export interface SeverityMetric {
  name: string;
  value: number;
}

export interface ThreatVectorMetric {
  name: string;
  incidents: number;
  riskScore: number;
}

export interface AnalyticsStats {
  incidentCount: number;
  severityDistribution: SeverityMetric[];
  threatVectors: ThreatVectorMetric[];
}

export type TabType = "news" | "analytics" | "monitor" | "intel" | "knowledge";
