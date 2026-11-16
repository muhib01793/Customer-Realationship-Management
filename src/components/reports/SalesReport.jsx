import React, { useState } from 'react';
import { useCrm } from '../../context/CrmContext';
import { pipelineStages, salesReps } from '../../data/initialData';
import StatCard from '../common/StatCard';
import {
  BarChart3,
  TrendingUp,
  DollarSign,
  Download,
  Calendar,
  Users,
  Award,
  Target,
  ArrowUpRight,
  PieChart,
  Layers,
  FileSpreadsheet
} from 'lucide-react';

const SalesReport = () => {
  const { deals, customers, leads, reminders, addToast } = useCrm();

  const [timeRange, setTimeRange] = useState('This Year');

  // Overall Financials
  const wonDeals = deals.filter((d) => d.stage === 'won');
  const lostDeals = deals.filter((d) => d.stage === 'lost');
  const activeDeals = deals.filter((d) => d.stage !== 'won' && d.stage !== 'lost');

  const totalWonRevenue = wonDeals.reduce((sum, d) => sum + (Number(d.amount) || 0), 0);
  const totalPipelineValue = activeDeals.reduce((sum, d) => sum + (Number(d.amount) || 0), 0);
  const avgDealSize = wonDeals.length > 0 ? Math.round(totalWonRevenue / wonDeals.length) : 0;
  
  const totalDecided = wonDeals.length + lostDeals.length;
  const winRate = totalDecided > 0 ? Math.round((wonDeals.length / totalDecided) * 100) : 0;

  // Rep Performance
  const repStats = salesReps.map((rep) => {
    const repDeals = deals.filter((d) => d.assignedRep === rep);
    const repWon = repDeals.filter((d) => d.stage === 'won');
    const repRevenue = repWon.reduce((sum, d) => sum + (Number(d.amount) || 0), 0);
    const repLeads = leads.filter((l) => l.assignedRep === rep).length;
    return {
      rep,
      totalDeals: repDeals.length,
      wonDeals: repWon.length,
      revenue: repRevenue,
      leadsHandled: repLeads,
      winRate: repDeals.length > 0 ? Math.round((repWon.length / repDeals.length) * 100) : 0,
    };
  });

  // Stage Distribution
  const stageStats = pipelineStages.map((stage) => {
    const stageDeals = deals.filter((d) => d.stage === stage.id);
    const val = stageDeals.reduce((sum, d) => sum + (Number(d.amount) || 0), 0);
    return {
      ...stage,
      count: stageDeals.length,
      value: val,
    };
  });

  // Lead Sources Breakdown
  const sourceMap = {};
  leads.forEach((l) => {
    sourceMap[l.source] = (sourceMap[l.source] || 0) + 1;
  });
  const sourceStats = Object.entries(sourceMap).map(([source, count]) => ({
    source,
    count,
    percent: Math.round((count / (leads.length || 1)) * 100),
  }));

  // Monthly Revenue Mock Breakdown
  const monthlyData = [
    { month: 'Jan', revenue: 45000, deals: 3 },
    { month: 'Feb', revenue: 58000, deals: 4 },
    { month: 'Mar', revenue: 72000, deals: 5 },
    { month: 'Apr', revenue: 64000, deals: 4 },
    { month: 'May', revenue: 89000, deals: 6 },
    { month: 'Jun', revenue: 95000, deals: 7 },
    { month: 'Jul', revenue: 82000, deals: 5 },
    { month: 'Aug', revenue: 105000, deals: 8 },
    { month: 'Sep', revenue: 115000, deals: 9 },
    { month: 'Oct', revenue: 130000, deals: 10 },
    { month: 'Nov', revenue: totalWonRevenue || 125000, deals: wonDeals.length || 8 },
    { month: 'Dec (Proj)', revenue: 140000, deals: 11 },
  ];

  const maxMonthRev = Math.max(...monthlyData.map((m) => m.revenue));

  // Export CSV Handler
  const handleExportCSV = () => {
    const csvRows = [
      ['Deal ID', 'Title', 'Customer', 'Amount', 'Stage', 'Close Date', 'Rep', 'Probability'],
      ...deals.map((d) => [
        d.id,
        `"${d.title.replace(/"/g, '""')}"`,
        `"${d.customerName.replace(/"/g, '""')}"`,
        d.amount,
        d.stage,
        d.expectedCloseDate,
        d.assignedRep,
        `${d.probability}%`,
      ]),
    ];

    const csvContent = 'data:text/csv;charset=utf-8,' + csvRows.map((e) => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `CRM_Sales_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    addToast('Sales report exported to CSV successfully', 'success');
  };

  return (
    <div className="space-y-6">
      {/* Top Stat Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Won Revenue"
          value={`$${totalWonRevenue.toLocaleString()}`}
          change="+24.5% vs target"
          isPositive={true}
          icon={DollarSign}
          color="emerald"
        />
        <StatCard
          title="Active Pipeline Value"
          value={`$${totalPipelineValue.toLocaleString()}`}
          change={`${activeDeals.length} active opportunities`}
          isPositive={true}
          icon={TrendingUp}
          color="indigo"
        />
        <StatCard
          title="Avg Closed Deal Size"
          value={`$${avgDealSize.toLocaleString()}`}
          change="Strong deal health"
          isPositive={true}
          icon={Award}
          color="purple"
        />
        <StatCard
          title="Sales Win Rate"
          value={`${winRate}%`}
          change={`${wonDeals.length} won vs ${lostDeals.length} lost`}
          isPositive={winRate >= 50}
          icon={Target}
          color="amber"
        />
      </div>

      {/* Control bar: Time filter & CSV Export */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-2">
          <Calendar className="w-4 h-4 text-slate-400" />
          <span className="text-xs font-semibold text-slate-600">Reporting Period:</span>
          <div className="flex items-center bg-slate-100 p-1 rounded-xl">
            {['This Month', 'This Quarter', 'This Year', 'All Time'].map((p) => (
              <button
                key={p}
                onClick={() => setTimeRange(p)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                  timeRange === p ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleExportCSV}
          className="flex items-center justify-center space-x-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-sm shadow-emerald-600/20 transition cursor-pointer"
        >
          <FileSpreadsheet className="w-4 h-4" />
          <span>Export Deals to CSV</span>
        </button>
      </div>

      {/* Grid: 2 Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Revenue Trend Bar Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Monthly Closed Revenue ($ USD)</h3>
              <p className="text-xs text-slate-500">Historical performance and current quarter trend</p>
            </div>
            <div className="flex items-center space-x-3 text-xs">
              <span className="flex items-center space-x-1.5 text-slate-600">
                <span className="w-3 h-3 rounded bg-indigo-600" />
                <span>Actual Revenue</span>
              </span>
            </div>
          </div>

          {/* Responsive Bar Chart Canvas */}
          <div className="h-64 flex items-end space-x-2 sm:space-x-4 pt-4 border-b border-slate-200 px-2">
            {monthlyData.map((item, idx) => {
              const heightPercent = Math.max(12, Math.round((item.revenue / maxMonthRev) * 100));
              const isCurrent = idx === 10;

              return (
                <div key={item.month} className="flex-1 flex flex-col items-center group relative h-full justify-end">
                  {/* Tooltip */}
                  <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-[10px] py-1 px-2 rounded-lg pointer-events-none whitespace-nowrap z-10 shadow-lg">
                    ${item.revenue.toLocaleString()} ({item.deals} deals)
                  </div>

                  {/* Bar */}
                  <div
                    className={`w-full rounded-t-lg transition-all duration-300 group-hover:brightness-110 ${
                      isCurrent
                        ? 'bg-gradient-to-t from-emerald-600 to-emerald-400'
                        : 'bg-gradient-to-t from-indigo-600 to-indigo-400'
                    }`}
                    style={{ height: `${heightPercent}%` }}
                  />

                  {/* Label */}
                  <span className="text-[10px] font-semibold text-slate-500 mt-2 truncate w-full text-center">
                    {item.month}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Pipeline Stage Funnel Breakdown */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-1">Pipeline Stages Funnel</h3>
            <p className="text-xs text-slate-500 mb-4">Total volume & value per pipeline stage</p>

            <div className="space-y-3">
              {stageStats.map((stg) => {
                const totalDealsCount = deals.length || 1;
                const widthPercent = Math.max(8, Math.round((stg.count / totalDealsCount) * 100));

                return (
                  <div key={stg.id} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-700 flex items-center space-x-1.5">
                        <span className={`w-2 h-2 rounded-full ${stg.color}`} />
                        <span>{stg.name}</span>
                      </span>
                      <span className="text-slate-500 font-medium">
                        {stg.count} deals (${stg.value.toLocaleString()})
                      </span>
                    </div>

                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${stg.color} rounded-full transition-all duration-500`}
                        style={{ width: `${widthPercent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100 bg-slate-50/50 p-3 rounded-xl text-xs text-slate-600 flex items-center justify-between">
            <span className="font-medium">Total Opportunities:</span>
            <span className="font-bold text-slate-900">{deals.length} deals in cycle</span>
          </div>
        </div>
      </div>

      {/* Row 2: Sales Rep Leaderboard & Lead Sources */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Rep Leaderboard */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Sales Representative Leaderboard</h3>
              <p className="text-xs text-slate-500">Quota attainment, revenue closed, and win rates</p>
            </div>
            <Award className="w-5 h-5 text-amber-500" />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 uppercase font-semibold text-[11px] border-b border-slate-100">
                <tr>
                  <th className="py-3 px-4">Sales Rep</th>
                  <th className="py-3 px-4">Closed Won Revenue</th>
                  <th className="py-3 px-4">Won Deals</th>
                  <th className="py-3 px-4">Leads Handled</th>
                  <th className="py-3 px-4 text-right">Win Conversion Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {repStats.map((rep) => (
                  <tr key={rep.rep} className="hover:bg-slate-50/80 transition">
                    <td className="py-3.5 px-4 font-bold text-slate-900 flex items-center space-x-2.5">
                      <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center">
                        {rep.rep.substring(0, 2).toUpperCase()}
                      </div>
                      <span>{rep.rep}</span>
                    </td>
                    <td className="py-3.5 px-4 font-extrabold text-emerald-600">
                      ${rep.revenue.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-700">
                      {rep.wonDeals} / {rep.totalDeals}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">{rep.leadsHandled}</td>
                    <td className="py-3.5 px-4 text-right">
                      <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                        {rep.winRate}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Lead Acquisition Channels */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Lead Acquisition Sources</h3>
              <p className="text-xs text-slate-500">Inbound marketing channel efficiency</p>
            </div>
            <PieChart className="w-5 h-5 text-indigo-500" />
          </div>

          <div className="space-y-3">
            {sourceStats.map((item) => (
              <div key={item.source} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-700">{item.source}</span>
                  <span className="font-bold text-slate-900">
                    {item.count} leads ({item.percent}%)
                  </span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-600 rounded-full transition-all duration-300"
                    style={{ width: `${item.percent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-5 p-3 rounded-xl bg-indigo-50/60 border border-indigo-100 text-xs text-indigo-900">
            <span className="font-bold block mb-1">Channel Recommendation:</span>
            <p className="leading-relaxed">
              Website Forms and Referral channels provide the highest quality lead score (average 82/100).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesReport;
