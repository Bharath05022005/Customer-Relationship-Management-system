import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  Target, 
  Award, 
  Briefcase, 
  TrendingUp,
  AlertCircle,
  BarChart2,
  PieChart as PieChartIcon,
  Activity
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';

const DashboardAnalyticsModule = () => {
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get('/api/salesman/summary') // Query the correct dashboard summary route registered in server.js
      .then(res => {
        setSummary(res.data);
        setError('');
      })
      .catch(err => {
        console.error('Dashboard fetch failed:', err);
        setError('Unable to fetch live statistics. Database connection could be offline.');
      });
  }, []);

  if (error) {
    return (
      <div className="p-6 bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl flex items-center gap-3 text-sm max-w-lg mx-auto mt-6">
        <AlertCircle className="w-5 h-5 shrink-0" />
        <p>{error}</p>
      </div>
    );
  }

  if (!summary) {
    return (
      <div className="flex flex-col items-center justify-center p-20">
        <div className="w-10 h-10 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin"></div>
        <p className="text-slate-400 text-xs mt-4 font-semibold tracking-wider uppercase animate-pulse">Loading Live Metrics...</p>
      </div>
    );
  }

  // Cards Data Configuration
  const cards = [
    {
      title: 'Total Leads Registered',
      value: summary.totalLeads,
      icon: Target,
      gradient: 'from-blue-600/20 to-cyan-600/10',
      border: 'border-blue-500/20 hover:border-blue-500/40',
      iconColor: 'text-blue-400',
      glow: 'shadow-blue-900/10'
    },
    {
      title: 'Deals Closed (Won)',
      value: summary.closedDeals,
      icon: Award,
      gradient: 'from-emerald-600/20 to-teal-600/10',
      border: 'border-emerald-500/20 hover:border-emerald-500/40',
      iconColor: 'text-emerald-400',
      glow: 'shadow-emerald-900/10'
    },
    {
      title: 'Total Active Pipelines',
      value: summary.totalDeals,
      icon: Briefcase,
      gradient: 'from-amber-600/20 to-orange-600/10',
      border: 'border-amber-500/20 hover:border-amber-500/40',
      iconColor: 'text-amber-400',
      glow: 'shadow-amber-900/10'
    },
    {
      title: 'Total Pipeline Value',
      value: `₹${(summary.totalPipelineValue || 0).toLocaleString()}`,
      icon: TrendingUp,
      gradient: 'from-purple-600/20 to-pink-600/10',
      border: 'border-purple-500/20 hover:border-purple-500/40',
      iconColor: 'text-purple-400',
      glow: 'shadow-purple-900/10'
    }
  ];

  // Mock Data for Charts (as requested in module description)
  const leadsBySourceData = [
    { name: 'Website', value: 400 },
    { name: 'Referral', value: 300 },
    { name: 'Cold Call', value: 200 },
    { name: 'Campaign', value: 278 },
  ];

  const salesForecastData = [
    { month: 'Jan', actual: 4000, forecast: 4400 },
    { month: 'Feb', actual: 3000, forecast: 3200 },
    { month: 'Mar', actual: 2000, forecast: 2800 },
    { month: 'Apr', actual: 2780, forecast: 3900 },
    { month: 'May', actual: 1890, forecast: 4800 },
    { month: 'Jun', actual: 2390, forecast: 3800 },
    { month: 'Jul', actual: 3490, forecast: 4300 },
  ];

  const employeePerformanceData = [
    { name: 'John', closed: 12, value: 120000 },
    { name: 'Sarah', closed: 19, value: 190000 },
    { name: 'Mike', closed: 3, value: 30000 },
    { name: 'Elena', closed: 5, value: 50000 },
  ];

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'];

  return (
    <div className="p-4 space-y-6">
      
      {/* Visual Analytics Header Card */}
      <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800/80 shadow-xl relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 blur-[80px] pointer-events-none rounded-full"></div>
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Executive Summary Metrics</h2>
          <p className="text-slate-400 text-xs mt-1">Real-time telemetry reports directly synced from core databases.</p>
        </div>
        <div className="px-4 py-2 bg-purple-500/10 border border-purple-500/20 rounded-xl text-purple-400 text-xs font-bold uppercase tracking-wider animate-pulse">
          Live Sync Activated
        </div>
      </div>

      {/* Grid Layout of Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, idx) => {
          const IconComponent = card.icon;
          return (
            <div 
              key={idx}
              className={`p-6 bg-gradient-to-br ${card.gradient} border ${card.border} rounded-2xl shadow-xl ${card.glow} transition duration-300 transform hover:-translate-y-1 hover:scale-[1.01] flex flex-col justify-between group cursor-pointer`}
            >
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400 group-hover:text-slate-300 transition duration-150">{card.title}</p>
                  <p className="text-2xl font-black text-white tracking-tight transition duration-150">{card.value}</p>
                </div>
                <div className={`p-3 bg-slate-900/60 rounded-xl border border-slate-800 flex items-center justify-center shadow ${card.iconColor}`}>
                  <IconComponent className="w-5 h-5 animate-pulse" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Leads by Source (Pie Chart) */}
        <div className="p-6 bg-slate-900/40 border border-slate-800/80 rounded-2xl shadow-xl relative overflow-hidden">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
            <PieChartIcon className="w-4 h-4 text-purple-400" />
            Leads by Source
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={leadsBySourceData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                  label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {leadsBySourceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px border #1e293b', borderRadius: '8px' }}
                  itemStyle={{ color: '#cbd5e1' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sales Forecast (Line Chart) */}
        <div className="p-6 bg-slate-900/40 border border-slate-800/80 rounded-2xl shadow-xl relative overflow-hidden">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-purple-400" />
            Sales Forecast vs Actual
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={salesForecastData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="month" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px border #1e293b', borderRadius: '8px' }}
                  itemStyle={{ color: '#cbd5e1' }}
                />
                <Legend />
                <Line type="monotone" dataKey="actual" stroke="#10b981" strokeWidth={2} dot={{ fill: '#10b981' }} />
                <Line type="monotone" dataKey="forecast" stroke="#3b82f6" strokeWidth={2} strokeDasharray="5 5" dot={{ fill: '#3b82f6' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Employee-wise Closures (Bar Chart) */}
        <div className="p-6 bg-slate-900/40 border border-slate-800/80 rounded-2xl shadow-xl relative overflow-hidden lg:col-span-2">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
            <BarChart2 className="w-4 h-4 text-purple-400" />
            Employee-wise Deal Closures
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={employeePerformanceData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="name" stroke="#64748b" />
                <YAxis yAxisId="left" stroke="#64748b" />
                <YAxis yAxisId="right" orientation="right" stroke="#64748b" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px border #1e293b', borderRadius: '8px' }}
                  itemStyle={{ color: '#cbd5e1' }}
                />
                <Legend />
                <Bar yAxisId="left" dataKey="closed" fill="#8b5cf6" radius={[4, 4, 0, 0]} name="Deals Closed" />
                <Bar yAxisId="right" dataKey="value" fill="#10b981" radius={[4, 4, 0, 0]} name="Value (₹)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

    </div>
  );
};

export default DashboardAnalyticsModule;

