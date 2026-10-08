// COMPLETE VERSION - With Animated Background & Responsive Layout

import React, { useState, useEffect } from 'react';
import { useFormContext } from "../context/FormContext";
import { 
  Download, Share2, TrendingDown, FileText, BarChart3, Zap, Flame, Car, Award,
  ArrowLeft, Settings, LogOut, Home, Calendar, ChevronDown
} from 'lucide-react';
import {
  PieChart, Pie, Cell,
  AreaChart, Area,
  BarChart, Bar,
  LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const DashboardPage = ({ onBack, onLogout }) => {
  const { formData, setCurrentStep } = useFormContext();
  const [isVisible, setIsVisible] = useState(false);
  const [trendPeriod, setTrendPeriod] = useState('6months');
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1200,
    height: typeof window !== 'undefined' ? window.innerHeight : 800
  });
  
  useEffect(() => {
    setIsVisible(true);
    
    // Handle window resize for responsive layout
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Add CSS animations
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes float {
        0%, 100% {
          transform: translateY(0px) rotate(0deg);
        }
        50% {
          transform: translateY(-20px) rotate(180deg);
        }
      }
      
      @keyframes float-delayed {
        0%, 100% {
          transform: translateY(0px) rotate(0deg);
        }
        50% {
          transform: translateY(20px) rotate(180deg);
        }
      }
      
      @keyframes pulse-slow {
        0%, 100% {
          opacity: 0.1;
          transform: scale(1);
        }
        50% {
          opacity: 0.2;
          transform: scale(1.05);
        }
      }
      
      @keyframes slideIn {
        from {
          opacity: 0;
          transform: translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      
      .animate-slide-in {
        animation: slideIn 0.5s ease-out forwards;
      }
      
      .animate-float {
        animation: float 8s ease-in-out infinite;
      }
      
      .animate-float-delayed {
        animation: float-delayed 10s ease-in-out infinite;
      }
      
      .animate-pulse-slow {
        animation: pulse-slow 4s ease-in-out infinite;
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const emissionFactors = {
    naturalGas: { therms: 0.0053, kwh: 0.00018, cubicMeters: 0.002 },
    gasoline: 0.00887,
    diesel: 0.01022,
    propane: 0.00582,
    electricity: { 
      'PGE': 0.000203,
      'SCE': 0.000215,
      'SDGE': 0.000228,
      'LADWP': 0.000276,
      'SMUD': 0.000184,
      'Other': 0.000215
    }
  };

  const calculateEmissions = () => {
    let scope1 = 0, scope2 = 0;
    const breakdown = { 
      electricity: 0, 
      naturalGas: 0, 
      gasoline: 0, 
      diesel: 0, 
      propane: 0 
    };

    if (formData.electricity?.totalKwh && parseFloat(formData.electricity.totalKwh) > 0) {
      const kwh = parseFloat(formData.electricity.totalKwh);
      const provider = formData.electricity.provider || 'Other';
      const factor = emissionFactors.electricity[provider] || 0.000215;
      breakdown.electricity = kwh * factor;
      scope2 += breakdown.electricity;
    }

    if (formData.naturalGas?.usesGas === true && formData.naturalGas?.amount) {
      const amount = parseFloat(formData.naturalGas.amount);
      const unit = formData.naturalGas.unit || 'therms';
      const factor = emissionFactors.naturalGas[unit] || 0.0053;
      breakdown.naturalGas = amount * factor;
      scope1 += breakdown.naturalGas;
    }

    if (formData.fuels?.gasoline && parseFloat(formData.fuels.gasoline) > 0) {
      const gallons = parseFloat(formData.fuels.gasoline);
      breakdown.gasoline = gallons * emissionFactors.gasoline;
      scope1 += breakdown.gasoline;
    }
    
    if (formData.fuels?.diesel && parseFloat(formData.fuels.diesel) > 0) {
      const gallons = parseFloat(formData.fuels.diesel);
      breakdown.diesel = gallons * emissionFactors.diesel;
      scope1 += breakdown.diesel;
    }
    
    if (formData.fuels?.propane && parseFloat(formData.fuels.propane) > 0) {
      const gallons = parseFloat(formData.fuels.propane);
      breakdown.propane = gallons * emissionFactors.propane;
      scope1 += breakdown.propane;
    }

    const result = {
      scope1: parseFloat(scope1.toFixed(2)),
      scope2: parseFloat(scope2.toFixed(2)),
      total: parseFloat((scope1 + scope2).toFixed(2)),
      breakdown
    };
    
    return result;
  };

  const emissions = calculateEmissions();
  const industryAverage = 1500;
  const percentageVsIndustry = ((emissions.total - industryAverage) / industryAverage * 100).toFixed(1);

  const donutData = [
    { name: 'Natural Gas', value: emissions.breakdown.naturalGas, color: '#ef4444' },
    { name: 'Propane', value: emissions.breakdown.propane, color: '#f97316' },
    { name: 'Electricity', value: emissions.breakdown.electricity, color: '#3b82f6' },
    { name: 'Gasoline', value: emissions.breakdown.gasoline, color: '#eab308' },
    { name: 'Diesel', value: emissions.breakdown.diesel, color: '#a855f7' }
  ].filter(item => item.value > 0);

  const areaData = [
    { month: 'Jan', current: emissions.total * 1.25, previous: emissions.total * 1.35 },
    { month: 'Feb', current: emissions.total * 1.18, previous: emissions.total * 1.28 },
    { month: 'Mar', current: emissions.total * 1.12, previous: emissions.total * 1.22 },
    { month: 'Apr', current: emissions.total * 1.08, previous: emissions.total * 1.15 },
    { month: 'May', current: emissions.total * 1.03, previous: emissions.total * 1.08 },
    { month: 'Jun', current: emissions.total, previous: emissions.total * 1.05 }
  ];

  const barData = Array.from({ length: 30 }, (_, i) => ({
    day: (i + 1).toString(),
    current: (emissions.total / 30) * (0.85 + Math.random() * 0.3),
    previous: (emissions.total / 30) * (0.95 + Math.random() * 0.2)
  }));

  const benchmarkData = [
    { month: 'Jan', yourCompany: emissions.total * 1.25, industryAvg: 1575 },
    { month: 'Feb', yourCompany: emissions.total * 1.18, industryAvg: 1545 },
    { month: 'Mar', yourCompany: emissions.total * 1.12, industryAvg: 1530 },
    { month: 'Apr', yourCompany: emissions.total * 1.08, industryAvg: 1515 },
    { month: 'May', yourCompany: emissions.total * 1.03, industryAvg: 1500 },
    { month: 'Jun', yourCompany: emissions.total, industryAvg: 1470 }
  ];

  const goBackToForms = () => {
    if (onBack) onBack();
    else setCurrentStep(6);
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-3 shadow-lg">
          <p className="text-gray-300 text-sm mb-1">{label}</p>
          {payload.map((item, index) => (
            <p key={index} className="text-sm" style={{ color: item.color }}>
              {item.name}: {item.value.toFixed(1)} tCO₂e
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // Responsive chart heights based on screen size
  const getChartHeight = () => {
    if (windowSize.width < 640) return 250;
    if (windowSize.width < 1024) return 280;
    return 300;
  };

  const getDonutHeight = () => {
    if (windowSize.width < 640) return 280;
    return 320;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-white relative overflow-x-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Floating Circles */}
        <div className="absolute top-[10%] left-[5%] w-32 h-32 md:w-48 md:h-48 rounded-full bg-purple-500/5 blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-[20%] right-[5%] w-40 h-40 md:w-64 md:h-64 rounded-full bg-blue-500/5 blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }} />
        <div className="absolute top-[40%] right-[15%] w-24 h-24 md:w-36 md:h-36 rounded-full bg-pink-500/5 blur-2xl animate-pulse-slow" style={{ animationDelay: '1s' }} />
        
        {/* Floating Geometric Shapes */}
        <div className="fixed top-32 left-10 w-16 h-16 md:w-20 md:h-20 opacity-10 pointer-events-none animate-float">
          <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(139, 92, 246, 0.5)" strokeWidth="2"/>
          </svg>
        </div>

        <div className="fixed bottom-32 right-10 w-20 h-20 md:w-24 md:h-24 opacity-10 pointer-events-none animate-float-delayed">
          <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <rect x="25" y="25" width="50" height="50" fill="none" stroke="rgba(236, 72, 153, 0.5)" strokeWidth="2" transform="rotate(45 50 50)"/>
          </svg>
        </div>

        <div className="fixed top-1/2 left-[2%] w-12 h-12 md:w-16 md:h-16 opacity-5 pointer-events-none animate-float" style={{ animationDelay: '1.5s' }}>
          <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <polygon points="50,15 85,35 85,65 50,85 15,65 15,35" fill="none" stroke="rgba(59, 130, 246, 0.5)" strokeWidth="2"/>
          </svg>
        </div>

        <div className="fixed bottom-[15%] left-[15%] w-14 h-14 md:w-20 md:h-20 opacity-5 pointer-events-none animate-float-delayed" style={{ animationDelay: '0.5s' }}>
          <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <path d="M20,50 L35,35 L65,35 L80,50 L65,65 L35,65 Z" fill="none" stroke="rgba(16, 185, 129, 0.5)" strokeWidth="2"/>
          </svg>
        </div>
      </div>

      {/* Navigation */}
      <nav className="bg-gray-900/50 backdrop-blur-xl border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-2 sm:gap-4">
              <button onClick={goBackToForms} className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-1.5 sm:py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-all text-sm sm:text-base">
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Back to Forms</span>
                <span className="sm:hidden">Back</span>
              </button>
              <div className="h-6 sm:h-8 w-px bg-white/10"></div>
              <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">CarboniQ</h1>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <button className="p-1.5 sm:p-2 hover:bg-white/5 rounded-lg transition-all">
                <Settings className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
              </button>
              <button onClick={onLogout} className="p-1.5 sm:p-2 hover:bg-white/5 rounded-lg transition-all">
                <LogOut className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-8 space-y-4 sm:space-y-8 relative z-10 animate-slide-in">
        
        {/* Header */}
        <div className="space-y-1 sm:space-y-2">
          <div className="flex items-center gap-2 sm:gap-3">
            <Home className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400" />
            <h2 className="text-2xl sm:text-3xl font-bold">Dashboard</h2>
          </div>
          <p className="text-gray-400 text-sm sm:text-base">
            Welcome back, {formData?.company?.name || 'User'} • Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>

        {/* Stats Cards - Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* Total Emissions Card */}
          <div className="lg:col-span-2 relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-2xl opacity-50 group-hover:opacity-75 blur transition duration-500"></div>
            <div className="relative bg-gray-900/90 backdrop-blur-xl border border-white/10 rounded-2xl p-4 sm:p-6">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center gap-2 text-gray-400 text-xs sm:text-sm">
                  <BarChart3 className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span>Total Emissions (2024)</span>
                </div>
                <div className="space-y-1">
                  <div className="text-3xl sm:text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                    {emissions.total.toFixed(1)}
                  </div>
                  <div className="text-sm sm:text-xl text-gray-400">tonnes CO₂e</div>
                </div>
                <div className={`inline-flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm ${
                  parseFloat(percentageVsIndustry) < 0 
                    ? 'bg-green-500/20 border border-green-500/30 text-green-400' 
                    : 'bg-orange-500/20 border border-orange-500/30 text-orange-400'
                }`}>
                  <TrendingDown className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span>{Math.abs(parseFloat(percentageVsIndustry))}% {parseFloat(percentageVsIndustry) < 0 ? 'below' : 'above'} industry</span>
                </div>
              </div>
            </div>
          </div>

          {/* Scope Cards */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 sm:p-6 hover:bg-white/10 transition-all">
            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-center gap-2">
                <div className="p-1.5 sm:p-2 bg-orange-500/20 rounded-lg">
                  <Flame className="w-3 h-3 sm:w-4 sm:h-4 text-orange-400" />
                </div>
                <span className="text-xs sm:text-sm text-gray-400">Scope 1</span>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-bold text-white">{emissions.scope1.toFixed(1)}</div>
                <div className="text-xs sm:text-sm text-gray-400">tonnes CO₂e</div>
              </div>
              <div className="text-[10px] sm:text-xs text-gray-500">Direct Emissions</div>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 sm:p-6 hover:bg-white/10 transition-all">
            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-center gap-2">
                <div className="p-1.5 sm:p-2 bg-blue-500/20 rounded-lg">
                  <Zap className="w-3 h-3 sm:w-4 sm:h-4 text-blue-400" />
                </div>
                <span className="text-xs sm:text-sm text-gray-400">Scope 2</span>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-bold text-white">{emissions.scope2.toFixed(1)}</div>
                <div className="text-xs sm:text-sm text-gray-400">tonnes CO₂e</div>
              </div>
              <div className="text-[10px] sm:text-xs text-gray-500">Indirect Emissions</div>
            </div>
          </div>
        </div>

        {/* SB 253 Compliance Banner - Responsive */}
        <div className="bg-gradient-to-r from-green-500/10 via-emerald-500/10 to-teal-500/10 border border-green-500/20 rounded-2xl p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="p-2 sm:p-3 bg-green-500/20 rounded-xl">
                <Award className="w-6 h-6 sm:w-8 sm:h-8 text-green-400" />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-white">SB 253 Compliant</h3>
                <p className="text-green-400 text-xs sm:text-sm">Your report is ready for submission to CARB</p>
              </div>
            </div>
            <button className="px-4 sm:px-6 py-2 sm:py-3 bg-green-600 hover:bg-green-500 rounded-lg font-semibold transition-all text-sm sm:text-base w-full sm:w-auto">
              Submit to CARB
            </button>
          </div>
        </div>

        {/* Charts Row 1 */}
        <div className="grid lg:grid-cols-2 gap-4 sm:gap-6">
          
          {/* Donut Chart */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
              <div>
                <h3 className="text-lg sm:text-xl font-bold">Emissions by Source</h3>
                <p className="text-xs sm:text-sm text-gray-400">Last Month</p>
              </div>
              <button className="flex items-center gap-2 px-2 sm:px-3 py-1 sm:py-1.5 bg-white/5 rounded-lg text-xs sm:text-sm hover:bg-white/10 transition">
                <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                <span>Last Month</span>
                <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4" />
              </button>
            </div>
            {donutData.length > 0 ? (
              <div className="relative" style={{ height: getDonutHeight() }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={donutData}
                      cx="50%"
                      cy="50%"
                      innerRadius={windowSize.width < 640 ? 50 : 70}
                      outerRadius={windowSize.width < 640 ? 80 : 100}
                      paddingAngle={2}
                      dataKey="value"
                      label={({ name, percent }) => windowSize.width > 640 ? `${name} ${(percent * 100).toFixed(0)}%` : `${(percent * 100).toFixed(0)}%`}
                      labelLine={false}
                    >
                      {donutData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    {windowSize.width > 640 && (
                      <Legend 
                        iconType="circle"
                        layout="horizontal"
                        verticalAlign="bottom"
                        align="center"
                        wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }}
                      />
                    )}
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
                  <div className="text-2xl sm:text-3xl font-bold text-white">{emissions.total.toFixed(0)}</div>
                  <div className="text-[10px] sm:text-xs text-gray-400">Total tCO₂e</div>
                </div>
              </div>
            ) : (
              <div className="h-[280px] sm:h-[350px] flex items-center justify-center text-gray-500">
                <p>No data available</p>
              </div>
            )}
          </div>

          {/* Area Chart */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
              <div>
                <h3 className="text-lg sm:text-xl font-bold">Emissions Trend</h3>
                <p className="text-xs sm:text-sm text-gray-400">Last 6 Months</p>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => setTrendPeriod('month')}
                  className={`px-2 sm:px-3 py-1 rounded-lg text-xs sm:text-sm transition ${
                    trendPeriod === 'month' 
                      ? 'bg-blue-500/20 text-blue-400' 
                      : 'bg-white/5 text-gray-400 hover:bg-white/10'
                  }`}
                >
                  Last Month
                </button>
                <button 
                  onClick={() => setTrendPeriod('6months')}
                  className={`px-2 sm:px-3 py-1 rounded-lg text-xs sm:text-sm transition ${
                    trendPeriod === '6months' 
                      ? 'bg-blue-500/20 text-blue-400' 
                      : 'bg-white/5 text-gray-400 hover:bg-white/10'
                  }`}
                >
                  Last 6 Months
                </button>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={getChartHeight()}>
              <AreaChart data={areaData}>
                <defs>
                  <linearGradient id="colorCurrent" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.05}/>
                  </linearGradient>
                  <linearGradient id="colorPrevious" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6b7280" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#6b7280" stopOpacity={0.02}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
                <XAxis dataKey="month" stroke="#9ca3af" axisLine={false} tickLine={false} tick={{ fontSize: windowSize.width < 640 ? 10 : 12 }} />
                <YAxis stroke="#9ca3af" axisLine={false} tickLine={false} tick={{ fontSize: windowSize.width < 640 ? 10 : 12 }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: windowSize.width < 640 ? '10px' : '12px' }} />
                <Area type="monotone" dataKey="previous" stroke="#6b7280" strokeWidth={2} fill="url(#colorPrevious)" name="previous" />
                <Area type="monotone" dataKey="current" stroke="#3b82f6" strokeWidth={2} fill="url(#colorCurrent)" name="current" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Daily Emissions Bar Chart */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
            <div>
              <h3 className="text-lg sm:text-xl font-bold">Daily Emissions</h3>
              <p className="text-xs sm:text-sm text-gray-400">Last 30 Days</p>
            </div>
            <div className="flex gap-2">
              <button className="px-2 sm:px-3 py-1 bg-blue-500/20 text-blue-400 rounded-lg text-xs sm:text-sm">
                Last 30 Days
              </button>
              <button className="px-2 sm:px-3 py-1 bg-white/5 text-gray-400 rounded-lg text-xs sm:text-sm hover:bg-white/10 transition">
                Last Month
              </button>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={getChartHeight()}>
            <BarChart data={barData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
              <XAxis 
                dataKey="day" 
                stroke="#9ca3af" 
                axisLine={false} 
                tickLine={false}
                interval={windowSize.width < 640 ? 6 : 4}
                tick={{ fontSize: windowSize.width < 640 ? 10 : 12 }}
              />
              <YAxis stroke="#9ca3af" axisLine={false} tickLine={false} tick={{ fontSize: windowSize.width < 640 ? 10 : 12 }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: windowSize.width < 640 ? '10px' : '12px' }} />
              <Bar dataKey="previous" fill="#6b7280" radius={[4, 4, 0, 0]} name="previous" />
              <Bar dataKey="current" fill="#3b82f6" radius={[4, 4, 0, 0]} name="current" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Industry Benchmark */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 sm:p-6">
          <h3 className="text-lg sm:text-xl font-bold mb-2">Industry Benchmark</h3>
          <p className="text-xs sm:text-sm text-gray-400 mb-4">Your emissions vs. Manufacturing average</p>
          <ResponsiveContainer width="100%" height={getChartHeight()}>
            <LineChart data={benchmarkData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
              <XAxis dataKey="month" stroke="#9ca3af" axisLine={false} tickLine={false} tick={{ fontSize: windowSize.width < 640 ? 10 : 12 }} />
              <YAxis stroke="#9ca3af" axisLine={false} tickLine={false} tick={{ fontSize: windowSize.width < 640 ? 10 : 12 }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: windowSize.width < 640 ? '10px' : '12px' }} />
              <Line type="monotone" dataKey="yourCompany" stroke="#10b981" strokeWidth={2.5} name="Your Company" dot={{ fill: '#10b981', r: windowSize.width < 640 ? 3 : 4 }} />
              <Line type="monotone" dataKey="industryAvg" stroke="#ef4444" strokeWidth={2} strokeDasharray="5 5" name="Industry Average" dot={{ fill: '#ef4444', r: windowSize.width < 640 ? 3 : 4 }} />
            </LineChart>
          </ResponsiveContainer>
          <div className="mt-4 p-3 sm:p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
            <p className="text-xs sm:text-sm text-green-400">
              <strong>Excellent performance!</strong> Your emissions are trending below industry standards.
            </p>
          </div>
        </div>

               {/* Detailed Breakdown - Responsive Grid */}
               <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 sm:p-6">
            <h3 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6">Emissions by Source</h3>
            <div className="space-y-3 sm:space-y-4">
              {Object.entries(emissions.breakdown)
                .filter(([_, value]) => value > 0)
                .sort(([, a], [, b]) => b - a)
                .map(([source, value]) => {
                  const percentage = ((value / emissions.total) * 100).toFixed(1);
                  const icons = { electricity: Zap, naturalGas: Flame, gasoline: Car, diesel: Car, propane: Flame };
                  const Icon = icons[source];
                  const colors = { 
                    electricity: 'from-blue-500 to-blue-400', 
                    naturalGas: 'from-red-500 to-red-400', 
                    gasoline: 'from-yellow-500 to-yellow-400', 
                    diesel: 'from-purple-500 to-purple-400', 
                    propane: 'from-orange-500 to-orange-400' 
                  };
                  return (
                    <div key={source} className="space-y-2">
                      <div className="flex items-center justify-between text-xs sm:text-sm">
                        <div className="flex items-center gap-2 sm:gap-3">
                          <Icon className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" />
                          <span className="capitalize">{source.replace(/([A-Z])/g, ' $1').trim()}</span>
                        </div>
                        <div className="flex items-center gap-2 sm:gap-3">
                          <span className="text-gray-400 text-xs sm:text-sm">{percentage}%</span>
                          <span className="font-semibold text-xs sm:text-sm">{value.toFixed(2)}t</span>
                        </div>
                      </div>
                      <div className="h-1.5 sm:h-2 bg-gray-800/50 rounded-full overflow-hidden">
                        <div 
                          className={`h-full bg-gradient-to-r ${colors[source]} rounded-full transition-all duration-1000`} 
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 sm:p-6">
            <h3 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6">Scope Breakdown</h3>
            <div className="space-y-3 sm:space-y-4">
              <div className="p-3 sm:p-4 bg-orange-500/10 border border-orange-500/20 rounded-xl">
                <div className="flex items-center justify-between mb-2 sm:mb-3">
                  <div className="flex items-center gap-2">
                    <Flame className="w-4 h-4 sm:w-5 sm:h-5 text-orange-400" />
                    <span className="font-semibold text-sm sm:text-base">Scope 1 - Direct</span>
                  </div>
                  <span className="text-base sm:text-lg font-bold">{emissions.scope1.toFixed(1)}t</span>
                </div>
                <div className="space-y-1 text-xs sm:text-sm text-gray-400">
                  {emissions.breakdown.naturalGas > 0 && <div>• Natural Gas: {emissions.breakdown.naturalGas.toFixed(2)}t</div>}
                  {emissions.breakdown.gasoline > 0 && <div>• Gasoline: {emissions.breakdown.gasoline.toFixed(2)}t</div>}
                  {emissions.breakdown.diesel > 0 && <div>• Diesel: {emissions.breakdown.diesel.toFixed(2)}t</div>}
                  {emissions.breakdown.propane > 0 && <div>• Propane: {emissions.breakdown.propane.toFixed(2)}t</div>}
                </div>
              </div>
              <div className="p-3 sm:p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                <div className="flex items-center justify-between mb-2 sm:mb-3">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
                    <span className="font-semibold text-sm sm:text-base">Scope 2 - Indirect</span>
                  </div>
                  <span className="text-base sm:text-lg font-bold">{emissions.scope2.toFixed(1)}t</span>
                </div>
                <div className="space-y-1 text-xs sm:text-sm text-gray-400">
                  {emissions.breakdown.electricity > 0 && <div>• Electricity: {emissions.breakdown.electricity.toFixed(2)}t</div>}
                  {formData.electricity?.provider && <div>• Provider: {formData.electricity.provider}</div>}
                  {formData.electricity?.totalKwh && <div>• Usage: {parseFloat(formData.electricity.totalKwh).toLocaleString()} kWh</div>}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons - Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-6">
          <button className="group bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 rounded-xl p-4 sm:p-6 transition-all hover:scale-105">
            <div className="flex flex-col items-center gap-2 sm:gap-3 text-white">
              <Download className="w-6 h-6 sm:w-8 sm:h-8" />
              <span className="font-semibold text-sm sm:text-base">Download Report</span>
              <span className="text-[10px] sm:text-xs opacity-80">PDF Format</span>
            </div>
          </button>
          <button className="group bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-xl p-4 sm:p-6 transition-all hover:scale-105">
            <div className="flex flex-col items-center gap-2 sm:gap-3">
              <Share2 className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400 group-hover:text-white" />
              <span className="font-semibold text-sm sm:text-base">Share Results</span>
              <span className="text-[10px] sm:text-xs text-gray-400">Email or Link</span>
            </div>
          </button>
          <button onClick={goBackToForms} className="group bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-xl p-4 sm:p-6 transition-all hover:scale-105">
            <div className="flex flex-col items-center gap-2 sm:gap-3">
              <FileText className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400 group-hover:text-white" />
              <span className="font-semibold text-sm sm:text-base">Update Data</span>
              <span className="text-[10px] sm:text-xs text-gray-400">Recalculate</span>
            </div>
          </button>
        </div>

      </div>
    </div>
  );
};

export default DashboardPage;