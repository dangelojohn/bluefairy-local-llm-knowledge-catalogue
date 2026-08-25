import React, { useState } from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  Eye, 
  MousePointer, 
  Globe, 
  Sparkles, 
  ExternalLink, 
  BarChart2, 
  Target, 
  Layers,
  Award,
  RefreshCw
} from 'lucide-react';
import { ENTERPRISE_AD_UNITS } from '../data/mockData';
import { AdUnit } from '../types';

export const AdRevenueDashboard: React.FC = () => {
  const [adUnits, setAdUnits] = useState<AdUnit[]>(ENTERPRISE_AD_UNITS);

  // Total Analytics
  const totalImpressions = adUnits.reduce((sum, u) => sum + u.impressions, 0);
  const totalClicks = adUnits.reduce((sum, u) => sum + u.clicks, 0);
  const avgCtr = ((totalClicks / totalImpressions) * 100).toFixed(2);
  const totalRevenue = adUnits.reduce((sum, u) => sum + (u.impressions / 1000) * u.cpmRate, 0);

  const simulateClick = (id: string) => {
    setAdUnits((prev) =>
      prev.map((u) => (u.id === id ? { ...u, clicks: u.clicks + 1, impressions: u.impressions + 15 } : u))
    );
  };

  return (
    <div className="h-[calc(100vh-80px)] overflow-y-auto bg-slate-950 text-slate-100 p-6 space-y-6 font-sans">
      {/* Header */}
      <div className="max-w-6xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-950/80 border border-amber-800 text-xs font-mono text-amber-300">
          <DollarSign className="w-3.5 h-3.5" />
          <span>High-CPM Enterprise Monetization & Google Ad Revenue Engine</span>
        </div>
        <h1 className="text-3xl font-bold text-white tracking-tight">
          Public Ad Revenue & Enterprise Traffic Generation
        </h1>
        <p className="text-slate-300 text-sm max-w-3xl leading-relaxed">
          The public-facing HTTP portal leverages high-intent developer and enterprise SEO traffic to generate ad revenue while funnelling qualified prospective clients into BlueFairy.ca on-premise deployments.
        </p>
      </div>

      {/* Analytics KPI Bar */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-1">
            <span>TOTAL AD REVENUE</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-extrabold text-emerald-400">
            ${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">High-CPM B2B & Google AdSense</div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-1">
            <span>TOTAL IMPRESSIONS</span>
            <Eye className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-extrabold text-white">
            {totalImpressions.toLocaleString()}
          </div>
          <div className="text-[11px] text-cyan-400/80 mt-1">+18.4% month-over-month</div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-1">
            <span>QUALIFIED CLICKS</span>
            <MousePointer className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-extrabold text-indigo-400">
            {totalClicks.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Direct enterprise leads</div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-1">
            <span>AVG. CLICK-THROUGH (CTR)</span>
            <Target className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-extrabold text-amber-400">
            {avgCtr}%
          </div>
          <div className="text-[11px] text-amber-500/80 mt-1">Enterprise Intent Ranking: Tier 1</div>
        </div>
      </div>

      {/* Ad Units Inventory & Live Simulator */}
      <div className="max-w-6xl mx-auto space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white font-mono flex items-center gap-2">
            <Layers className="w-4 h-4 text-cyan-400" />
            <span>Active Enterprise Sponsor Slots & Google Ad Units</span>
          </h3>
          <span className="text-xs font-mono text-slate-400">Click banner to simulate organic interaction</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {adUnits.map((unit) => {
            const revenue = ((unit.impressions / 1000) * unit.cpmRate).toFixed(2);
            return (
              <div
                key={unit.id}
                onClick={() => simulateClick(unit.id)}
                className={`p-6 rounded-2xl bg-gradient-to-br ${unit.bannerBg} border border-slate-700/80 hover:border-cyan-400 transition-all cursor-pointer shadow-lg space-y-4`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-cyan-300 font-mono">{unit.sponsor}</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950 text-slate-300 border border-slate-700">
                    {unit.badge}
                  </span>
                </div>

                <div>
                  <h4 className="text-lg font-bold text-white mb-1 leading-snug">{unit.title}</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">{unit.description}</p>
                </div>

                {/* Financial Metrics */}
                <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-center font-mono text-xs">
                  <div>
                    <div className="text-[10px] text-slate-500">CPM RATE</div>
                    <div className="text-amber-300 font-bold">${unit.cpmRate.toFixed(2)}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-500">IMPRESSIONS</div>
                    <div className="text-white font-bold">{unit.impressions.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-500">TOTAL REVENUE</div>
                    <div className="text-emerald-400 font-bold">${revenue}</div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                  <span>Category: <strong>{unit.category}</strong></span>
                  <span className="text-cyan-400 flex items-center gap-1 font-semibold">
                    Simulate Click <ExternalLink className="w-3 h-3" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
