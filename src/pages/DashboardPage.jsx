import React, { useState } from 'react';
import {
  BookOpen,
  Users,
  Repeat,
  AlertTriangle,
  LayoutGrid,
  Coins,
  Copy,
  Clock,
  Zap,
  PlusCircle,
  UserPlus,
  ArrowRight,
  RotateCcw,
  Tag,
  ChevronDown,
  Calendar,
  Sprout,
  CheckCircle2,
  X,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

export default function DashboardPage() {
  const { user } = useAuth();
  const [timeFilter, setTimeFilter] = useState('Last 6 Months');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [hoveredBar, setHoveredBar] = useState(null);
  const [activeModal, setActiveModal] = useState(null);

  // Quick Action form inputs for interactive modals
  const [modalFormData, setModalFormData] = useState({
    title: '',
    author: '',
    isbn: '',
    name: '',
    email: '',
    bookId: '',
    memberId: '',
    categoryName: '',
  });

  // Dynamic greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  // Dynamic date formatted exactly like screenshot (e.g. "Saturday, 11 Oct 2025")
  const getFormattedDate = () => {
    const now = new Date();
    const options = { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' };
    return now.toLocaleDateString('en-GB', options);
  };

  // Bar chart dataset (6 months)
  const chartDataSets = {
    'Last 6 Months': [
      { month: 'May', issued: 138, returned: 96, overdue: 25 },
      { month: 'Jun', issued: 132, returned: 90, overdue: 20 },
      { month: 'Jul', issued: 142, returned: 98, overdue: 28 },
      { month: 'Aug', issued: 135, returned: 88, overdue: 30 },
      { month: 'Sep', issued: 142, returned: 98, overdue: 32 },
      { month: 'Oct', issued: 178, returned: 128, overdue: 42 },
    ],
    'This Year': [
      { month: 'Jan', issued: 120, returned: 85, overdue: 18 },
      { month: 'Feb', issued: 128, returned: 90, overdue: 22 },
      { month: 'Mar', issued: 145, returned: 105, overdue: 28 },
      { month: 'Apr', issued: 130, returned: 92, overdue: 24 },
      { month: 'May', issued: 138, returned: 96, overdue: 25 },
      { month: 'Jun', issued: 160, returned: 115, overdue: 35 },
    ],
    'Last 30 Days': [
      { month: 'W1', issued: 35, returned: 24, overdue: 6 },
      { month: 'W2', issued: 42, returned: 30, overdue: 8 },
      { month: 'W3', issued: 48, returned: 34, overdue: 11 },
      { month: 'W4', issued: 53, returned: 40, overdue: 17 },
    ],
  };

  const currentChartData = chartDataSets[timeFilter] || chartDataSets['Last 6 Months'];
  const maxChartValue = 200;

  // Recent Activities items matching image exactly
  const activities = [
    {
      id: 1,
      title: 'New book added',
      subtitle: 'Clean Code by Robert C. Martin',
      time: '2 hours ago',
      icon: BookOpen,
      iconBg: 'bg-emerald-50 text-[#0bad96]',
    },
    {
      id: 2,
      title: 'New member registered',
      subtitle: 'Priya Sharma (M00123)',
      time: '4 hours ago',
      icon: Users,
      iconBg: 'bg-blue-50 text-blue-500',
    },
    {
      id: 3,
      title: 'Book issued',
      subtitle: 'To Rahul Verma - The Alchemist',
      time: '6 hours ago',
      icon: Repeat,
      iconBg: 'bg-emerald-50 text-emerald-500',
    },
    {
      id: 4,
      title: 'Book returned',
      subtitle: 'By Sneha Reddy - JavaScript Basics',
      time: '8 hours ago',
      icon: RotateCcw,
      iconBg: 'bg-teal-50 text-teal-600',
    },
    {
      id: 5,
      title: 'Fine collected',
      subtitle: '₹ 150 from Amit Kumar',
      time: '1 day ago',
      icon: Coins,
      iconBg: 'bg-amber-50 text-amber-500',
    },
    {
      id: 6,
      title: 'Category added',
      subtitle: 'Science Fiction',
      time: '1 day ago',
      icon: Tag,
      iconBg: 'bg-purple-50 text-purple-600',
    },
  ];

  const handleQuickActionSubmit = (e) => {
    e.preventDefault();
    toast.success(`${activeModal} completed successfully!`, { icon: '✨' });
    setActiveModal(null);
  };

  return (
    <div className="space-y-4 max-w-[1520px] mx-auto select-none">
      {/* 1. Header Greeting Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <span>{getGreeting()}, {user?.name ? user.name.split(' ')[0] : 'Vimal'}!</span>
            <span className="inline-block animate-wave">👋</span>
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Here's what's happening in your library today.
          </p>
        </div>

        {/* Date & Motivation Pill */}
        <div className="flex items-center gap-3 bg-white border border-slate-100 rounded-2xl px-4 py-2 shadow-2xs w-fit">
          <div className="w-8 h-8 rounded-xl bg-emerald-50 text-[#0bad96] flex items-center justify-center flex-shrink-0">
            <Calendar className="w-4 h-4 stroke-[2]" />
          </div>
          <div className="text-left leading-tight">
            <div className="text-xs font-bold text-slate-800">
              {getFormattedDate()}
            </div>
            <div className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
              <span>Keep reading, keep growing!</span>
            </div>
          </div>
          <div className="text-emerald-500 pl-1">
            <Sprout className="w-4 h-4 stroke-[2]" />
          </div>
        </div>
      </div>

      {/* 2. Main 2-Column Split: Left (8 cols) vs Right (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* ===================== LEFT COLUMN (8 cols) ===================== */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          {/* Row 1 Stats (3 Cards) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* 1. Total Books */}
            <div className="bg-white rounded-2xl p-4 sm:p-4.5 border border-slate-100/90 shadow-2xs relative overflow-hidden group hover:shadow-xs transition-shadow min-h-[92px] flex flex-col justify-between">
              <div className="flex items-start justify-between">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-[#0bad96] flex items-center justify-center">
                  <BookOpen className="w-4.5 h-4.5 stroke-[2]" />
                </div>
              </div>
              <div className="mt-1">
                <span className="text-[11px] font-semibold text-slate-500 block leading-tight">Total Books</span>
                <div className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-none mt-1">
                  1,248
                </div>
                <div className="text-[10px] sm:text-[11px] font-bold text-emerald-600 mt-1 flex items-center gap-1">
                  <span>↑ 12%</span>
                  <span className="text-slate-400 font-normal">from last month</span>
                </div>
              </div>
              <BookOpen className="w-14 h-14 text-slate-100/60 absolute -right-2.5 -bottom-2.5 pointer-events-none stroke-[1]" />
            </div>

            {/* 2. Total Members */}
            <div className="bg-white rounded-2xl p-4 sm:p-4.5 border border-slate-100/90 shadow-2xs relative overflow-hidden group hover:shadow-xs transition-shadow min-h-[92px] flex flex-col justify-between">
              <div className="flex items-start justify-between">
                <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                  <Users className="w-4.5 h-4.5 stroke-[2]" />
                </div>
              </div>
              <div className="mt-1">
                <span className="text-[11px] font-semibold text-slate-500 block leading-tight">Total Members</span>
                <div className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-none mt-1">
                  582
                </div>
                <div className="text-[10px] sm:text-[11px] font-bold text-emerald-600 mt-1 flex items-center gap-1">
                  <span>↑ 8%</span>
                  <span className="text-slate-400 font-normal">from last month</span>
                </div>
              </div>
              <Users className="w-14 h-14 text-slate-100/60 absolute -right-2.5 -bottom-2.5 pointer-events-none stroke-[1]" />
            </div>

            {/* 3. Books Issued */}
            <div className="bg-white rounded-2xl p-4 sm:p-4.5 border border-slate-100/90 shadow-2xs relative overflow-hidden group hover:shadow-xs transition-shadow min-h-[92px] flex flex-col justify-between">
              <div className="flex items-start justify-between">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Repeat className="w-4.5 h-4.5 stroke-[2]" />
                </div>
              </div>
              <div className="mt-1">
                <span className="text-[11px] font-semibold text-slate-500 block leading-tight">Books Issued</span>
                <div className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-none mt-1">
                  346
                </div>
                <div className="text-[10px] sm:text-[11px] font-bold text-emerald-600 mt-1 flex items-center gap-1">
                  <span>↑ 15%</span>
                  <span className="text-slate-400 font-normal">from last month</span>
                </div>
              </div>
              <BookOpen className="w-14 h-14 text-slate-100/60 absolute -right-2.5 -bottom-2.5 pointer-events-none stroke-[1]" />
            </div>
          </div>

          {/* Row 2 Stats (3 Cards) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* 4. Overdue Books */}
            <div className="bg-white rounded-2xl p-4 sm:p-4.5 border border-red-100/70 shadow-2xs relative overflow-hidden group hover:shadow-xs transition-shadow min-h-[92px] flex flex-col justify-between">
              <div className="flex items-start justify-between">
                <div className="w-9 h-9 rounded-xl bg-red-50 text-red-500 flex items-center justify-center">
                  <AlertTriangle className="w-4.5 h-4.5 stroke-[2]" />
                </div>
              </div>
              <div className="mt-1">
                <span className="text-[11px] font-semibold text-slate-500 block leading-tight">Overdue Books</span>
                <div className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-none mt-1">
                  48
                </div>
                <div className="text-[10px] sm:text-[11px] font-bold text-red-500 mt-1 flex items-center gap-1">
                  <span>↑ 5%</span>
                  <span className="text-slate-400 font-normal">from last month</span>
                </div>
              </div>
              <AlertTriangle className="w-14 h-14 text-slate-100/60 absolute -right-2.5 -bottom-2.5 pointer-events-none stroke-[1]" />
            </div>

            {/* 5. Total Categories */}
            <div className="bg-white rounded-2xl p-4 sm:p-4.5 border border-slate-100/90 shadow-2xs relative overflow-hidden group hover:shadow-xs transition-shadow min-h-[92px] flex flex-col justify-between">
              <div className="flex items-start justify-between">
                <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center">
                  <LayoutGrid className="w-4.5 h-4.5 stroke-[2]" />
                </div>
              </div>
              <div className="mt-1">
                <span className="text-[11px] font-semibold text-slate-500 block leading-tight">Total Categories</span>
                <div className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-none mt-1">
                  18
                </div>
                <div className="text-[10px] sm:text-[11px] font-bold text-amber-500 mt-1 flex items-center gap-1">
                  <span>↑ 2%</span>
                  <span className="text-slate-400 font-normal">from last month</span>
                </div>
              </div>
              <LayoutGrid className="w-14 h-14 text-slate-100/60 absolute -right-2.5 -bottom-2.5 pointer-events-none stroke-[1]" />
            </div>

            {/* 6. Fine Collected */}
            <div className="bg-white rounded-2xl p-4 sm:p-4.5 border border-slate-100/90 shadow-2xs relative overflow-hidden group hover:shadow-xs transition-shadow min-h-[92px] flex flex-col justify-between">
              <div className="flex items-start justify-between">
                <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                  <Coins className="w-4.5 h-4.5 stroke-[2]" />
                </div>
              </div>
              <div className="mt-1">
                <span className="text-[11px] font-semibold text-slate-500 block leading-tight">Fine Collected</span>
                <div className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-none mt-1">
                  ₹ 2,450
                </div>
                <div className="text-[10px] sm:text-[11px] font-bold text-purple-600 mt-1 flex items-center gap-1">
                  <span>↑ 20%</span>
                  <span className="text-slate-400 font-normal">from last month</span>
                </div>
              </div>
              <Coins className="w-14 h-14 text-slate-100/60 absolute -right-2.5 -bottom-2.5 pointer-events-none stroke-[1]" />
            </div>
          </div>

          {/* Row 3: Books Overview (Bar Chart & Donut Chart) */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-100/90 shadow-2xs flex flex-col justify-between">
            {/* Header & Filter */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-50 text-[#0bad96] flex items-center justify-center">
                  <BookOpen className="w-4 h-4 stroke-[2]" />
                </div>
                <h2 className="text-xs sm:text-sm font-bold text-slate-800">Books Overview</h2>
              </div>

              {/* Filter Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl border border-slate-200/80 text-[11px] font-medium text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <span>{timeFilter}</span>
                  <ChevronDown className="w-3 h-3 text-slate-400 stroke-[2]" />
                </button>

                {isFilterOpen && (
                  <>
                    <div onClick={() => setIsFilterOpen(false)} className="fixed inset-0 z-20" />
                    <div className="absolute right-0 mt-1 w-32 bg-white rounded-xl shadow-lg border border-slate-100 py-1 z-30 text-xs">
                      {['Last 6 Months', 'This Year', 'Last 30 Days'].map((filter) => (
                        <button
                          key={filter}
                          type="button"
                          onClick={() => {
                            setTimeFilter(filter);
                            setIsFilterOpen(false);
                            toast.info(`Updated overview for ${filter}`);
                          }}
                          className={`w-full text-left px-3 py-1.5 hover:bg-slate-50 transition-colors ${
                            timeFilter === filter ? 'text-[#0bad96] font-bold' : 'text-slate-600'
                          }`}
                        >
                          {filter}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Legend Row */}
            <div className="flex items-center gap-4 text-[11px] text-slate-500 font-medium mb-3">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#0bad96]" />
                <span>Issued</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#86efac]" />
                <span>Returned</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#fb923c]" />
                <span>Overdue</span>
              </div>
            </div>

            {/* Charts Split (Bar Chart ~62% | Donut Chart ~38%) */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
              {/* Left Bar Chart (8 cols) */}
              <div className="md:col-span-8 flex flex-col justify-end">
                <div className="relative h-48 sm:h-52 flex items-end justify-between gap-1.5 sm:gap-3 pl-7 border-b border-slate-100">
                  {/* Dotted horizontal lines & labels */}
                  {[200, 150, 100, 50, 0].map((val) => (
                    <div
                      key={val}
                      className="absolute left-0 right-0 flex items-center pointer-events-none"
                      style={{ bottom: `${(val / maxChartValue) * 100}%` }}
                    >
                      <span className="text-[9px] text-slate-400 font-mono w-5 text-right pr-1.5">
                        {val}
                      </span>
                      <div className="w-full border-b border-dashed border-slate-100" />
                    </div>
                  ))}

                  {/* Grouped Bars */}
                  {currentChartData.map((d) => {
                    const issuedHeight = (d.issued / maxChartValue) * 100;
                    const returnedHeight = (d.returned / maxChartValue) * 100;
                    const overdueHeight = (d.overdue / maxChartValue) * 100;

                    return (
                      <div
                        key={d.month}
                        onMouseEnter={() => setHoveredBar(d)}
                        onMouseLeave={() => setHoveredBar(null)}
                        className="relative z-10 flex-1 flex items-end justify-center gap-1 h-full group cursor-pointer"
                      >
                        {/* Bar 1: Issued */}
                        <div
                          style={{ height: `${issuedHeight}%` }}
                          className="w-2.5 sm:w-3 bg-[#0bad96] rounded-t-sm transition-all duration-300 group-hover:brightness-110"
                        />
                        {/* Bar 2: Returned */}
                        <div
                          style={{ height: `${returnedHeight}%` }}
                          className="w-2.5 sm:w-3 bg-[#86efac] rounded-t-sm transition-all duration-300 group-hover:brightness-110"
                        />
                        {/* Bar 3: Overdue */}
                        <div
                          style={{ height: `${overdueHeight}%` }}
                          className="w-2.5 sm:w-3 bg-[#fb923c] rounded-t-sm transition-all duration-300 group-hover:brightness-110"
                        />

                        {/* Hover Tooltip */}
                        {hoveredBar?.month === d.month && (
                          <div className="absolute -top-11 bg-slate-900 text-white text-[10px] rounded-lg px-2 py-1 shadow-lg pointer-events-none whitespace-nowrap z-20">
                            <div><strong>{d.month}:</strong> Issued: {d.issued} | Ret: {d.returned} | Overdue: {d.overdue}</div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* X Axis Labels */}
                <div className="flex justify-between pl-7 pt-1.5 text-[10px] font-semibold text-slate-400">
                  {currentChartData.map((d) => (
                    <div key={d.month} className="flex-1 text-center">
                      {d.month}
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Donut Chart (4 cols) */}
              <div className="md:col-span-4 flex flex-col items-center justify-center p-1 border-t md:border-t-0 md:border-l border-slate-100">
                {/* SVG Donut */}
                <div className="relative w-32 h-32 flex items-center justify-center">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="38"
                      fill="transparent"
                      stroke="#f1f5f9"
                      strokeWidth="11"
                    />
                    {/* Available 72% */}
                    <circle
                      cx="50"
                      cy="50"
                      r="38"
                      fill="transparent"
                      stroke="#0bad96"
                      strokeWidth="11"
                      strokeDasharray="238.76"
                      strokeDashoffset="66.85"
                      strokeLinecap="round"
                    />
                    {/* Issued 28% */}
                    <circle
                      cx="50"
                      cy="50"
                      r="38"
                      fill="transparent"
                      stroke="#86efac"
                      strokeWidth="11"
                      strokeDasharray="66.85 238.76"
                      strokeDashoffset="0"
                    />
                    {/* Overdue 4% */}
                    <circle
                      cx="50"
                      cy="50"
                      r="38"
                      fill="transparent"
                      stroke="#fb923c"
                      strokeWidth="11"
                      strokeDasharray="9.55 238.76"
                      strokeDashoffset="-60"
                    />
                  </svg>

                  {/* Donut Center */}
                  <div className="absolute text-center leading-none">
                    <span className="text-[9px] text-slate-400 font-medium block">Total Books</span>
                    <span className="text-base font-black text-slate-900 block mt-0.5">1,248</span>
                  </div>
                </div>

                {/* Donut Legend */}
                <div className="w-full space-y-1.5 mt-3 text-[11px] font-semibold">
                  <div className="flex items-center justify-between text-slate-600">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#0bad96]" />
                      <span>Available</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-900 font-bold">902</span>
                      <span className="text-slate-400 text-[10px]">72%</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-slate-600">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#86efac]" />
                      <span>Issued</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-900 font-bold">346</span>
                      <span className="text-slate-400 text-[10px]">28%</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-slate-600">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#fb923c]" />
                      <span>Overdue</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-900 font-bold">48</span>
                      <span className="text-slate-400 text-[10px]">4%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ===================== RIGHT COLUMN (4 cols) ===================== */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          {/* Card 7: Books Available (Top Right - Matches Row 1 Height exactly!) */}
          <div className="bg-white rounded-2xl p-4 sm:p-4.5 border border-slate-100/90 shadow-2xs relative overflow-hidden group hover:shadow-xs transition-shadow min-h-[92px] flex flex-col justify-between">
            <div className="flex items-start justify-between">
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Copy className="w-4.5 h-4.5 stroke-[2]" />
              </div>
            </div>
            <div className="mt-1">
              <span className="text-[11px] font-semibold text-slate-500 block leading-tight">Books Available</span>
              <div className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-none mt-1">
                902
              </div>
              <div className="text-[10px] sm:text-[11px] font-bold text-emerald-600 mt-1 flex items-center gap-1">
                <span>↑ 10%</span>
                <span className="text-slate-400 font-normal">from last month</span>
              </div>
            </div>
            <BookOpen className="w-16 h-16 text-slate-100/60 absolute -right-3 -bottom-3 pointer-events-none stroke-[1]" />
          </div>

          {/* Recent Activities (Bottom Right - Matches Row 2 + Books Overview Height!) */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-100/90 shadow-2xs flex flex-col justify-between">
            <div>
              {/* Header */}
              <div className="flex items-center justify-between mb-3.5 pb-1">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-slate-700 stroke-[2]" />
                  <h2 className="text-xs sm:text-sm font-bold text-slate-800">Recent Activities</h2>
                </div>
                <button
                  type="button"
                  onClick={() => toast.info('Navigating to full activity logs...')}
                  className="text-xs font-bold text-[#0bad96] hover:underline cursor-pointer"
                >
                  View All
                </button>
              </div>

              {/* Activity Items List */}
              <div className="space-y-3">
                {activities.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.id} className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-2.5 overflow-hidden">
                        <div className={`w-7.5 h-7.5 rounded-xl ${item.iconBg} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                          <Icon className="w-3.5 h-3.5 stroke-[2]" />
                        </div>
                        <div className="truncate text-left leading-tight">
                          <div className="text-xs font-bold text-slate-800 truncate">
                            {item.title}
                          </div>
                          <div className="text-[11px] text-slate-400 truncate mt-0.5">
                            {item.subtitle}
                          </div>
                        </div>
                      </div>

                      {/* Time and Green Status Dot */}
                      <div className="flex items-center gap-1.5 flex-shrink-0 text-[10px] text-slate-400 font-medium">
                        <span>{item.time}</span>
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Bottom Section: Quick Action Row (Full Width - 5 Equal Cards) */}
      <div className="space-y-2.5 pt-1">
        {/* Header */}
        <div className="flex items-center gap-1.5">
          <Zap className="w-4 h-4 text-[#0bad96] stroke-[2.5]" />
          <h2 className="text-xs sm:text-sm font-bold text-slate-800">Quick Action</h2>
        </div>

        {/* 5 Equal Action Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
          {/* Action 1: Add New Book */}
          <div
            onClick={() => setActiveModal('Add New Book')}
            className="bg-white rounded-2xl p-3.5 sm:p-4 border border-slate-100/90 shadow-2xs hover:border-emerald-200 hover:shadow-xs transition-all cursor-pointer flex items-center justify-between group"
          >
            <div>
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-[#0bad96] flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                <PlusCircle className="w-4 h-4 stroke-[2]" />
              </div>
              <h3 className="text-xs font-bold text-slate-800 group-hover:text-[#0bad96] transition-colors">
                Add New Book
              </h3>
              <p className="text-[10px] text-slate-400 mt-0.5">
                Add book to Library
              </p>
            </div>
            <div className="w-6.5 h-6.5 rounded-full bg-emerald-50/80 text-[#0bad96] flex items-center justify-center group-hover:bg-[#0bad96] group-hover:text-white transition-colors flex-shrink-0">
              <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
            </div>
          </div>

          {/* Action 2: Add Member */}
          <div
            onClick={() => setActiveModal('Add Member')}
            className="bg-white rounded-2xl p-3.5 sm:p-4 border border-slate-100/90 shadow-2xs hover:border-emerald-200 hover:shadow-xs transition-all cursor-pointer flex items-center justify-between group"
          >
            <div>
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-[#0bad96] flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                <UserPlus className="w-4 h-4 stroke-[2]" />
              </div>
              <h3 className="text-xs font-bold text-slate-800 group-hover:text-[#0bad96] transition-colors">
                Add Member
              </h3>
              <p className="text-[10px] text-slate-400 mt-0.5">
                Register new member
              </p>
            </div>
            <div className="w-6.5 h-6.5 rounded-full bg-emerald-50/80 text-[#0bad96] flex items-center justify-center group-hover:bg-[#0bad96] group-hover:text-white transition-colors flex-shrink-0">
              <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
            </div>
          </div>

          {/* Action 3: Issue Book */}
          <div
            onClick={() => setActiveModal('Issue Book')}
            className="bg-white rounded-2xl p-3.5 sm:p-4 border border-slate-100/90 shadow-2xs hover:border-emerald-200 hover:shadow-xs transition-all cursor-pointer flex items-center justify-between group"
          >
            <div>
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-[#0bad96] flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                <Repeat className="w-4 h-4 stroke-[2]" />
              </div>
              <h3 className="text-xs font-bold text-slate-800 group-hover:text-[#0bad96] transition-colors">
                Issue Book
              </h3>
              <p className="text-[10px] text-slate-400 mt-0.5">
                Issue to a member
              </p>
            </div>
            <div className="w-6.5 h-6.5 rounded-full bg-emerald-50/80 text-[#0bad96] flex items-center justify-center group-hover:bg-[#0bad96] group-hover:text-white transition-colors flex-shrink-0">
              <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
            </div>
          </div>

          {/* Action 4: Return Book */}
          <div
            onClick={() => setActiveModal('Return Book')}
            className="bg-white rounded-2xl p-3.5 sm:p-4 border border-slate-100/90 shadow-2xs hover:border-emerald-200 hover:shadow-xs transition-all cursor-pointer flex items-center justify-between group"
          >
            <div>
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-[#0bad96] flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                <CheckCircle2 className="w-4 h-4 stroke-[2]" />
              </div>
              <h3 className="text-xs font-bold text-slate-800 group-hover:text-[#0bad96] transition-colors">
                Return Book
              </h3>
              <p className="text-[10px] text-slate-400 mt-0.5">
                Process book return
              </p>
            </div>
            <div className="w-6.5 h-6.5 rounded-full bg-emerald-50/80 text-[#0bad96] flex items-center justify-center group-hover:bg-[#0bad96] group-hover:text-white transition-colors flex-shrink-0">
              <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
            </div>
          </div>

          {/* Action 5: Add Category */}
          <div
            onClick={() => setActiveModal('Add Category')}
            className="bg-white rounded-2xl p-3.5 sm:p-4 border border-slate-100/90 shadow-2xs hover:border-purple-200 hover:shadow-xs transition-all cursor-pointer flex items-center justify-between group"
          >
            <div>
              <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                <Tag className="w-4 h-4 stroke-[2]" />
              </div>
              <h3 className="text-xs font-bold text-slate-800 group-hover:text-purple-600 transition-colors">
                Add Category
              </h3>
              <p className="text-[10px] text-slate-400 mt-0.5">
                Manage categories
              </p>
            </div>
            <div className="w-6.5 h-6.5 rounded-full bg-slate-50 text-slate-400 group-hover:bg-purple-600 group-hover:text-white transition-colors flex-shrink-0">
              <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Modal for Quick Actions */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-7 w-full max-w-md shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <span className="p-1 rounded-lg bg-emerald-50 text-[#0bad96]">
                  <Zap className="w-4 h-4" />
                </span>
                <span>{activeModal}</span>
              </h3>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleQuickActionSubmit} className="space-y-3 text-xs">
              {activeModal === 'Add New Book' && (
                <>
                  <div>
                    <label className="font-bold text-slate-700">Book Title</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Design Patterns"
                      value={modalFormData.title}
                      onChange={(e) => setModalFormData({ ...modalFormData, title: e.target.value })}
                      className="w-full mt-1 p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#0bad96]"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700">Author Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Erich Gamma"
                      value={modalFormData.author}
                      onChange={(e) => setModalFormData({ ...modalFormData, author: e.target.value })}
                      className="w-full mt-1 p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#0bad96]"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700">ISBN Number</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 978-0201633610"
                      value={modalFormData.isbn}
                      onChange={(e) => setModalFormData({ ...modalFormData, isbn: e.target.value })}
                      className="w-full mt-1 p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#0bad96]"
                    />
                  </div>
                </>
              )}

              {activeModal === 'Add Member' && (
                <>
                  <div>
                    <label className="font-bold text-slate-700">Member Full Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ananya Roy"
                      value={modalFormData.name}
                      onChange={(e) => setModalFormData({ ...modalFormData, name: e.target.value })}
                      className="w-full mt-1 p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#0bad96]"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700">Email Address</label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. ananya@example.com"
                      value={modalFormData.email}
                      onChange={(e) => setModalFormData({ ...modalFormData, email: e.target.value })}
                      className="w-full mt-1 p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#0bad96]"
                    />
                  </div>
                </>
              )}

              {activeModal === 'Issue Book' && (
                <>
                  <div>
                    <label className="font-bold text-slate-700">Select Book</label>
                    <input
                      type="text"
                      required
                      placeholder="Enter Book Title or ISBN"
                      value={modalFormData.bookId}
                      onChange={(e) => setModalFormData({ ...modalFormData, bookId: e.target.value })}
                      className="w-full mt-1 p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#0bad96]"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700">Member ID</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. MEM-2026-44"
                      value={modalFormData.memberId}
                      onChange={(e) => setModalFormData({ ...modalFormData, memberId: e.target.value })}
                      className="w-full mt-1 p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#0bad96]"
                    />
                  </div>
                </>
              )}

              {activeModal === 'Return Book' && (
                <div>
                  <label className="font-bold text-slate-700">Issued Book ID / Member ID</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter Book ID to Return"
                    className="w-full mt-1 p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#0bad96]"
                  />
                </div>
              )}

              {activeModal === 'Add Category' && (
                <div>
                  <label className="font-bold text-slate-700">Category Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Artificial Intelligence"
                    value={modalFormData.categoryName}
                    onChange={(e) => setModalFormData({ ...modalFormData, categoryName: e.target.value })}
                    className="w-full mt-1 p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#0bad96]"
                  />
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="px-4 py-2 rounded-xl text-slate-500 hover:bg-slate-100 font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#0bad96] hover:bg-[#099884] text-white font-bold shadow-sm cursor-pointer"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
