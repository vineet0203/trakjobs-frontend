import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import httpClient from '../../services/api/httpClient';
import { useAuth } from '../auth/hooks/useAuth';
import moment from 'moment';
import { 
  Calendar, ClipboardCheck, DollarSign, Star, 
  ChevronDown, Clock, Check, Plus, Receipt
} from 'lucide-react';
import './Dashboard.css';

const Dashboard = () => {
  const [data, setData] = useState(null);

  const [error, setError] = useState('');
  const [availability, setAvailability] = useState(true);
  const [timeRange, setTimeRange] = useState('this_month');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isDropdownOpen2, setIsDropdownOpen2] = useState(false);

  // Get real user from auth context
  const { user } = useAuth();
  
  const getFirstName = () => {
    if (user?.full_name) return user.full_name.split(' ')[0];
    if (user?.first_name) return user.first_name;
    if (user?.name) return user.name.split(' ')[0];
    return 'Vendor';
  };
  const firstName = getFirstName();

  useEffect(() => {
    let mounted = true;
    const fetchDashboard = async () => {
      try {
        let fromDate = moment().startOf('month').format('YYYY-MM-DD');
        let toDate = moment().endOf('month').format('YYYY-MM-DD');

        if (timeRange === 'last_month') {
          fromDate = moment().subtract(1, 'month').startOf('month').format('YYYY-MM-DD');
          toDate = moment().subtract(1, 'month').endOf('month').format('YYYY-MM-DD');
        } else if (timeRange === 'this_year') {
          fromDate = moment().startOf('year').format('YYYY-MM-DD');
          toDate = moment().endOf('year').format('YYYY-MM-DD');
        }

        const response = await httpClient.get(`/api/v1/dashboard?earning_from=${fromDate}&earning_to=${toDate}`);
        if (!mounted) return;
        const dashboardData = response?.data?.data || response?.data || {};
        setData(dashboardData);
        setAvailability(!!dashboardData.is_available);
      } catch (err) {
        if (!mounted) return;
        setError(err?.response?.data?.message || err?.message || 'Failed to load dashboard.');
      }
    };
    fetchDashboard();
    return () => { mounted = false; };
  }, [timeRange]);

  const stats = data?.stats || [];
  const totalEarning = data?.totalEarning || { amount: '0', change: '0%', changeLabel: 'from last month' };
  const recentBookings = data?.recentBookings || [];
  const upcomingBookings = data?.upcomingBookings || [];
  const recentQuotes = data?.recentQuotes || [];
  
  // Maps API stats to UI
  const totalBookingsStat = stats.find(s => s.label === 'Total Booking') || { value: 0, change: '0%' };
  const completedJobsStat = stats.find(s => s.label === 'Total Job') || { value: 0, change: '0%' };
  const totalInvoiceStat = stats.find(s => s.label === 'Total Invoice') || { value: 0, change: '0%' };
  
  // Chart Data
  const earningChart = data?.earningChart?.length ? data.earningChart : [];
  const chartData = useMemo(() => buildLineChart(earningChart), [earningChart]);

  // Donut Chart logic
  const bookingStatus = data?.bookingStatus || { completed: 0, upcoming: 0, cancelled: 0 };
  const compCount = bookingStatus.completed;
  const upCount = bookingStatus.upcoming;
  const cancCount = bookingStatus.cancelled;
  const totalJobsCount = compCount + upCount + cancCount;
  
  const compPct = totalJobsCount ? (compCount / totalJobsCount) * 100 : 0;
  const upPct = totalJobsCount ? (upCount / totalJobsCount) * 100 : 0;
  const cancPct = totalJobsCount ? (cancCount / totalJobsCount) * 100 : 0;
  const C = 2 * Math.PI * 38; // ~238.76
  const compDash = `${(compPct/100) * C} ${C}`;
  const upDash = `${(upPct/100) * C} ${C}`;
  const cancDash = `${(cancPct/100) * C} ${C}`;

  const handleToggleAvailability = async () => {
    try {
      const newStatus = !availability;
      setAvailability(newStatus); // Optimistic UI update
      await httpClient.post('/api/v1/dashboard/availability', { is_available: newStatus });
    } catch (err) {
      console.error('Failed to update availability:', err);
      setAvailability(availability); // Revert on failure
    }
  };
  const compOffset = 0;
  const upOffset = -((compPct/100) * C);
  const cancOffset = -(((compPct + upPct)/100) * C);

  // Status map
  const getStatusColor = (status) => {
    switch(status) {
      case 'completed': return 'text-green-500 border-green-100 bg-white shadow-sm';
      case 'scheduled': return 'text-blue-500 border-blue-100 bg-white shadow-sm';
      case 'cancelled': return 'text-orange-500 border-orange-100 bg-white shadow-sm';
      default: return 'text-purple-500 border-purple-100 bg-white shadow-sm';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'completed': return Check;
      case 'scheduled': return Clock;
      default: return Calendar;
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] p-8 font-sans w-full box-border">
      {error && <div className="mb-4 rounded-lg bg-red-50 p-4 text-red-600">{error}</div>}
      
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-[28px] font-bold text-slate-800">Welcome back, {firstName}! 👋</h1>
        <p className="mt-1 text-slate-500 text-[15px]">Here's what's happening with your business today.</p>
      </div>

      {/* 4 Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex flex-col">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center text-orange-500">
              <Calendar size={24} />
            </div>
            <div>
              <p className="text-[13px] font-medium text-slate-500">Total Bookings</p>
              <p className="text-2xl font-bold text-slate-800 leading-tight">{totalBookingsStat.value}</p>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-1 text-[13px] font-semibold text-green-500">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="18 15 12 9 6 15" transform="rotate(180 12 12)"/></svg>
            <span>{totalBookingsStat.change}</span>
            <span className="text-slate-400 font-medium ml-1">from last month</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex flex-col">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500">
              <ClipboardCheck size={24} />
            </div>
            <div>
              <p className="text-[13px] font-medium text-slate-500">Total Jobs</p>
              <p className="text-2xl font-bold text-slate-800 leading-tight">{completedJobsStat.value}</p>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-1 text-[13px] font-semibold text-green-500">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="18 15 12 9 6 15" transform="rotate(180 12 12)"/></svg>
            <span>{completedJobsStat.change}</span>
            <span className="text-slate-400 font-medium ml-1">from last month</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex flex-col">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center text-green-500">
              <DollarSign size={24} />
            </div>
            <div>
              <p className="text-[13px] font-medium text-slate-500">Total Earnings</p>
              <p className="text-2xl font-bold text-slate-800 leading-tight">${totalEarning.amount}</p>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-1 text-[13px] font-semibold text-green-500">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="18 15 12 9 6 15" transform="rotate(180 12 12)"/></svg>
            <span>{totalEarning.change}</span>
            <span className="text-slate-400 font-medium ml-1">{totalEarning.changeLabel}</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex flex-col">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center text-purple-500">
              <Receipt size={24} />
            </div>
            <div>
              <p className="text-[13px] font-medium text-slate-500">Total Invoices</p>
              <p className="text-2xl font-bold text-slate-800 leading-tight">{totalInvoiceStat.value}</p>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-1 text-[13px] font-semibold text-green-500">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="18 15 12 9 6 15" transform="rotate(180 12 12)"/></svg>
            <span>{totalInvoiceStat.change}</span>
            <span className="text-slate-400 font-medium ml-1">from last month</span>
          </div>
        </div>
      </div>

      <div className="grid xl:grid-cols-[1.5fr_1fr_1fr] gap-6">
        
        {/* Earnings Overview Line Chart */}
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex flex-col min-h-[340px]">
          <div className="flex items-center justify-between mb-4 relative">
            <h3 className="font-bold text-slate-800 text-[15px]">Earnings Overview</h3>
            <div className="relative">
              <button 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 text-xs font-semibold text-slate-600 bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-sm"
              >
                {timeRange === 'this_month' ? 'This Month' : timeRange === 'last_month' ? 'Last Month' : 'This Year'} <ChevronDown size={14} />
              </button>
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-36 bg-white border border-slate-100 rounded-xl shadow-lg z-10 py-1">
                  <button onClick={() => { setTimeRange('this_month'); setIsDropdownOpen(false); }} className="w-full text-left px-4 py-2 text-[13px] font-medium text-slate-700 hover:bg-slate-50">This Month</button>
                  <button onClick={() => { setTimeRange('last_month'); setIsDropdownOpen(false); }} className="w-full text-left px-4 py-2 text-[13px] font-medium text-slate-700 hover:bg-slate-50">Last Month</button>
                  <button onClick={() => { setTimeRange('this_year'); setIsDropdownOpen(false); }} className="w-full text-left px-4 py-2 text-[13px] font-medium text-slate-700 hover:bg-slate-50">This Year</button>
                </div>
              )}
            </div>
          </div>
          <div className="flex-1 relative w-full mt-4">
            <svg viewBox={`0 0 ${chartData.width} ${chartData.height}`} className="w-full h-full overflow-visible">
              <defs>
                <linearGradient id="earningGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ffb800" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#ffb800" stopOpacity="0" />
                </linearGradient>
              </defs>
              {chartData.yTicks.map((tick) => (
                <g key={tick.value}>
                  <line x1="40" x2={chartData.width} y1={tick.y} y2={tick.y} stroke="#f1f5f9" strokeWidth="1.5" />
                  <text x="0" y={tick.y + 4} className="text-[11px] fill-slate-400 font-medium">{tick.label}</text>
                </g>
              ))}
              <path d={chartData.areaPath} fill="url(#earningGradient)" />
              <path d={chartData.linePath} fill="none" stroke="#ffb800" strokeWidth="3" />
              {chartData.points.map((point, i) => (
                <g key={i}>
                  {i === chartData.points.length - 1 && point.origValue > 0 && (
                    <g transform={`translate(${point.x - 35}, ${point.y - 45})`}>
                      <rect width="70" height="34" rx="8" fill="white" filter="drop-shadow(0 4px 6px rgba(0,0,0,0.1))" />
                      <text x="35" y="14" className="text-[9px] fill-slate-400 font-medium" textAnchor="middle">Latest</text>
                      <text x="35" y="26" className="text-[11px] fill-slate-800 font-bold" textAnchor="middle">${point.origValue}</text>
                    </g>
                  )}
                  {(point.origValue > 0 || i === chartData.points.length - 1) && (
                    <circle cx={point.x} cy={point.y} r={i === chartData.points.length - 1 ? "4" : "2"} fill="#fff" stroke="#ffb800" strokeWidth="2" />
                  )}
                </g>
              ))}
              {chartData.xLabels.map((label) => (
                <text key={label.value} x={label.x} y={chartData.height - 5} className="text-[11px] fill-slate-400 font-medium" textAnchor="middle">{label.value}</text>
              ))}
            </svg>
          </div>
        </div>

        {/* Bookings by Status Donut Chart */}
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex flex-col">
          <h3 className="font-bold text-slate-800 text-[15px] mb-8">Bookings by Status</h3>
          <div className="flex items-center justify-between flex-1">
            <div className="relative w-36 h-36 flex-shrink-0">
              <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90 drop-shadow-sm">
                <circle cx="50" cy="50" r="38" fill="none" stroke="#f1f5f9" strokeWidth="24" />
                {totalJobsCount > 0 && (
                  <>
                    <circle cx="50" cy="50" r="38" fill="none" stroke="#22c55e" strokeWidth="24" strokeDasharray={compDash} strokeDashoffset={compOffset} />
                    <circle cx="50" cy="50" r="38" fill="none" stroke="#3b82f6" strokeWidth="24" strokeDasharray={upDash} strokeDashoffset={upOffset} />
                    <circle cx="50" cy="50" r="38" fill="none" stroke="#f97316" strokeWidth="24" strokeDasharray={cancDash} strokeDashoffset={cancOffset} />
                  </>
                )}
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-[22px] font-black text-slate-800">{totalJobsCount}</span>
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Total</span>
              </div>
            </div>
            <div className="flex flex-col gap-5 mr-4">
              <div className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-green-500 shadow-sm"></div>
                <div className="flex flex-col">
                  <span className="text-[11px] text-slate-500 font-semibold">Completed</span>
                  <span className="text-[13px] font-bold text-slate-800">{compCount} ({compPct.toFixed(1)}%)</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-sm"></div>
                <div className="flex flex-col">
                  <span className="text-[11px] text-slate-500 font-semibold">Upcoming</span>
                  <span className="text-[13px] font-bold text-slate-800">{upCount} ({upPct.toFixed(1)}%)</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-orange-500 shadow-sm"></div>
                <div className="flex flex-col">
                  <span className="text-[11px] text-slate-500 font-semibold">Cancelled</span>
                  <span className="text-[13px] font-bold text-slate-800">{cancCount} ({cancPct.toFixed(1)}%)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column Top - Availability Status */}
        <div className="flex flex-col gap-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-slate-800 text-[15px]">Availability Status</h3>
              <span className={`px-2.5 py-1 rounded border text-[11px] font-bold ${availability ? 'bg-green-50 border-green-200 text-green-600' : 'bg-slate-50 border-slate-200 text-slate-500'}`}>
                {availability ? 'Online' : 'Offline'}
              </span>
            </div>
            <p className="text-[13px] font-medium text-slate-500 mb-5">
              {availability ? 'You are available for new bookings' : 'You are currently not accepting new bookings'}
            </p>
            <button 
              onClick={handleToggleAvailability}
              className={`w-[52px] h-[28px] rounded-full relative transition-colors shadow-inner ${availability ? 'bg-green-500' : 'bg-slate-300'}`}
            >
              <div className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow-sm transition-all ${availability ? 'right-1' : 'left-1'}`}></div>
            </button>
            <Link 
              to="/schedule" 
              className="mt-7 w-full py-2.5 border border-slate-200 rounded-xl text-[13px] font-bold text-green-600 hover:bg-green-50 transition-colors flex items-center justify-center gap-2"
            >
              <Calendar size={16} /> Edit Availability
            </Link>
          </div>
        </div>
      </div>

      <div className="grid xl:grid-cols-[1.5fr_1fr_1fr] gap-6 mt-6">
        {/* Recent Bookings */}
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex flex-col h-[420px]">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-bold text-slate-800 text-[15px]">Recent Bookings</h3>
            <Link to="/schedule" className="text-[13px] font-bold text-orange-500 hover:text-orange-600">View All</Link>
          </div>
          <div className="flex-1 overflow-y-auto pr-2 space-y-5 custom-scrollbar">
            {recentBookings.map((b, i) => {
              const Icon = getStatusIcon(b.status);
              const colorClass = getStatusColor(b.status);
              return (
                <div key={i} className="flex items-center justify-between pb-4 border-b border-slate-100 last:border-0 last:pb-0">
                  <div className="flex items-center gap-4">
                    <div className={`w-[46px] h-[46px] rounded-full border flex items-center justify-center ${colorClass}`}>
                      <Icon size={20} strokeWidth={2.5} />
                    </div>
                    <div>
                      <p className="text-[14px] font-bold text-slate-800">{b.service}</p>
                      <p className="text-[12px] font-medium text-slate-500 mt-0.5">{b.date} • {b.time}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-bold text-slate-800 text-[13px]">{b.client}</span>
                    <span className="px-3 py-1.5 rounded-md bg-green-50 text-green-600 text-[11px] font-bold uppercase">{b.status}</span>
                    <ChevronRight size={18} className="text-slate-300" />
                  </div>
                </div>
              );
            })}
            {recentBookings.length === 0 && (
              <div className="text-center text-slate-500 text-sm mt-8">No recent bookings found.</div>
            )}
          </div>
          <div className="mt-5 pt-4 border-t border-slate-100 flex justify-center">
            <Link to="/schedule" className="text-[13px] font-bold text-orange-500 hover:text-orange-600 flex items-center gap-1.5">
              View All Bookings <ArrowRight size={16} />
            </Link>
          </div>
        </div>

        {/* Recent Quotes */}
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex flex-col h-[420px]">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-bold text-slate-800 text-[15px]">Recent Quotes</h3>
            <Link to="/quotes" className="text-[13px] font-bold text-orange-500 hover:text-orange-600">View All</Link>
          </div>
          <div className="flex-1 overflow-y-auto pr-2 space-y-6 custom-scrollbar">
            {recentQuotes.map((q, i) => (
              <div key={i} className="flex gap-3 items-center">
                <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 font-bold flex items-center justify-center">
                  {q.client.charAt(0)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-[14px] font-bold text-slate-800">{q.client}</p>
                    <p className="text-[12px] font-medium text-slate-400">{q.date}</p>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-[13px] font-bold text-slate-600">{q.amount}</span>
                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-bold uppercase">{q.status}</span>
                  </div>
                </div>
              </div>
            ))}
            {recentQuotes.length === 0 && (
              <div className="text-center text-slate-500 text-sm mt-8">No recent quotes found.</div>
            )}
          </div>
          <div className="mt-5 pt-4 border-t border-slate-100 flex justify-center">
            <Link to="/quotes" className="text-[13px] font-bold text-orange-500 hover:text-orange-600 flex items-center gap-1.5">
              View All Quotes <ArrowRight size={16} />
            </Link>
          </div>
        </div>

        {/* Right Column Bottom - Upcoming Bookings */}
        <div className="flex flex-col gap-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex flex-col flex-1 max-h-[420px]">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-slate-800 text-[15px]">Upcoming Bookings</h3>
              <Link to="/schedule" className="text-[13px] font-bold text-orange-500 hover:text-orange-600">View All</Link>
            </div>
            <div className="flex-1 overflow-y-auto pr-2 space-y-4 custom-scrollbar">
              {upcomingBookings.map((b, i) => (
                <div key={i} className="flex gap-4 pb-4 border-b border-slate-50 last:border-0 last:pb-0">
                  <div className="w-[52px] h-[52px] flex flex-col items-center justify-center bg-slate-50 rounded-xl flex-shrink-0 border border-slate-100 shadow-sm">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">JOB</span>
                    <span className="text-[18px] font-black text-slate-800 leading-none mt-0.5">#{b.job_number}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <p className="text-[14px] font-bold text-slate-800 leading-snug">{b.service}</p>
                      <span className="px-2.5 py-1 rounded bg-blue-50 text-blue-600 text-[10px] font-bold uppercase shrink-0">Upcoming</span>
                    </div>
                    <p className="text-[12px] font-medium text-slate-500 mt-1">{b.date} • {b.time}</p>
                    <p className="text-[12px] font-medium text-slate-500 mt-0.5">Customer: {b.client}</p>
                  </div>
                </div>
              ))}
              {upcomingBookings.length === 0 && (
                <div className="text-center text-slate-500 text-sm mt-8">No upcoming bookings found.</div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid xl:grid-cols-[2.5fr_1fr] gap-6 mt-6 pb-12">
        {/* My Services */}
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-bold text-slate-800 text-[15px]">My Services</h3>
            <button className="text-[13px] font-bold text-orange-500 hover:text-orange-600">Manage Services</button>
          </div>
          <div className="flex gap-5 overflow-x-auto pb-3 custom-scrollbar">
            {[
              { name: 'Plumbing', icon: '💧', color: 'bg-blue-50 text-blue-500 border-blue-100' },
              { name: 'Pipe Fitting', icon: '🔧', color: 'bg-orange-50 text-orange-500 border-orange-100' },
              { name: 'Bathroom Installation', icon: '🛁', color: 'bg-green-50 text-green-500 border-green-100' },
            ].map((s, i) => (
              <div key={i} className="flex-shrink-0 flex items-center gap-3 border border-slate-100 rounded-xl p-3 pr-4 shadow-sm w-56 hover:shadow-md transition-shadow bg-white">
                <div className={`w-11 h-11 rounded-xl border flex items-center justify-center text-xl shadow-sm ${s.color}`}>
                  {s.icon}
                </div>
                <div className="flex-1">
                  <p className="text-[14px] font-bold text-slate-800 truncate">{s.name}</p>
                  <div className="flex items-center justify-between mt-1.5">
                    <span className="text-[11px] font-bold text-slate-500">Active</span>
                    <div className="w-7 h-4 bg-green-500 rounded-full relative shadow-inner">
                      <div className="absolute right-0.5 top-0.5 w-3 h-3 bg-white rounded-full shadow-sm"></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <button className="flex-shrink-0 flex items-center justify-center gap-2 border-2 border-dashed border-slate-200 rounded-xl px-8 text-[14px] font-bold text-slate-500 hover:bg-slate-50 hover:text-slate-800 hover:border-slate-300 transition-colors">
              <Plus size={20} strokeWidth={2.5} /> Add Service
            </button>
          </div>
        </div>

        {/* Earnings Summary */}
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-6 relative">
            <h3 className="font-bold text-slate-800 text-[15px]">Earnings Summary</h3>
            <div className="relative">
              <button 
                onClick={() => setIsDropdownOpen2(!isDropdownOpen2)}
                className="flex items-center gap-2 text-xs font-semibold text-slate-600 bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-sm"
              >
                {timeRange === 'this_month' ? 'This Month' : timeRange === 'last_month' ? 'Last Month' : 'This Year'} <ChevronDown size={14} />
              </button>
              {isDropdownOpen2 && (
                <div className="absolute right-0 mt-2 w-36 bg-white border border-slate-100 rounded-xl shadow-lg z-10 py-1">
                  <button onClick={() => { setTimeRange('this_month'); setIsDropdownOpen2(false); }} className="w-full text-left px-4 py-2 text-[13px] font-medium text-slate-700 hover:bg-slate-50">This Month</button>
                  <button onClick={() => { setTimeRange('last_month'); setIsDropdownOpen2(false); }} className="w-full text-left px-4 py-2 text-[13px] font-medium text-slate-700 hover:bg-slate-50">Last Month</button>
                  <button onClick={() => { setTimeRange('this_year'); setIsDropdownOpen2(false); }} className="w-full text-left px-4 py-2 text-[13px] font-medium text-slate-700 hover:bg-slate-50">This Year</button>
                </div>
              )}
            </div>
          </div>
          <div className="flex items-end justify-between mb-6">
            <div>
              <p className="text-[32px] font-black text-slate-800 leading-none">${totalEarning.amount}</p>
              <p className="text-[13px] font-medium text-slate-500 mt-2">Total Earnings</p>
              <div className="flex items-center gap-1 mt-1 text-[11px] font-bold text-green-500">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="18 15 12 9 6 15" transform="rotate(180 12 12)"/></svg>
                <span>{totalEarning.change} vs previous period</span>
              </div>
            </div>
            {/* Mini Bar Chart */}
            <div className="flex items-end gap-2 h-16">
              {[40, 60, 30, 80, 50, 90, 70].map((h, i) => (
                <div key={i} className="w-[14px] bg-[#ffb800] rounded-sm hover:bg-orange-500 transition-colors" style={{ height: `${h}%` }}></div>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-between border-t border-slate-100 pt-5 mt-auto">
            <div>
              <p className="text-[11px] font-bold text-slate-500 uppercase">Completed Jobs</p>
              <p className="text-[16px] font-black text-slate-800 mt-1">{completedJobsStat.value}</p>
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-500 uppercase">Total Bookings</p>
              <p className="text-[16px] font-black text-slate-800 mt-1">{totalBookingsStat.value}</p>
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-500 uppercase">Avg Job Value</p>
              <p className="text-[16px] font-black text-slate-800 mt-1">
                ${totalJobsCount > 0 ? (parseFloat(totalEarning.amount.replace(/,/g, '')) / totalJobsCount).toFixed(2) : '0.00'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Helpers for the chart ---
const buildLineChart = (data) => {
  const width = 600;
  const height = 240;
  const paddingX = 40;
  const paddingY = 30;

  if (!data || data.length === 0) return { width, height, yTicks: [], xLabels: [], areaPath: '', linePath: '', points: [] };

  const values = data.map(d => parseFloat(d.value) || parseFloat(d.amount) || 0);
  const maxVal = Math.max(...values, 10);
  const minVal = 0;
  const range = maxVal - minVal;

  const getX = (index) => paddingX + (index * (width - paddingX * 2)) / Math.max(data.length - 1, 1);
  const getY = (val) => height - paddingY - ((val - minVal) / range) * (height - paddingY * 2);

  const points = data.map((d, i) => ({ x: getX(i), y: getY(parseFloat(d.value) || parseFloat(d.amount) || 0), origValue: parseFloat(d.value) || parseFloat(d.amount) || 0 }));
  
  let linePath = '';
  let areaPath = '';
  
  if (points.length > 0) {
    // Generate curved path instead of sharp lines
    linePath = `M ${points[0].x},${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1];
      const curr = points[i];
      const midX = (prev.x + curr.x) / 2;
      linePath += ` C ${midX},${prev.y} ${midX},${curr.y} ${curr.x},${curr.y}`;
    }
    
    areaPath = `${linePath} L ${points[points.length-1].x},${height - paddingY} L ${points[0].x},${height - paddingY} Z`;
  }

  const yTicks = [0, 0.5, 1].map(pct => {
    const val = minVal + pct * range;
    return {
      value: val,
      label: `$${val.toFixed(0)}`,
      y: getY(val)
    };
  });

  // Only show about 6 x-axis labels to avoid overlap
  const labelStep = Math.max(1, Math.ceil(data.length / 6));
  const xLabels = data.map((d, i) => {
    if (i % labelStep === 0 || i === data.length - 1) {
      return { value: d.date, x: getX(i) };
    }
    return null;
  }).filter(Boolean);

  return { width, height, yTicks, xLabels, linePath, areaPath, points };
};

const ArrowRight = ({ size = 24, className }) => (
  <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"></line>
    <polyline points="12 5 19 12 12 19"></polyline>
  </svg>
);

const ChevronRight = ({ size = 24, className }) => (
  <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6"></polyline>
  </svg>
);

export default Dashboard;
