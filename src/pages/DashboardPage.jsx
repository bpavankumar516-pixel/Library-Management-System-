import React from 'react';
import {
  BookOpen,
  Users,
  Repeat,
  CheckCircle,
  AlertTriangle,
  FolderTree,
  IndianRupee,
  Clock,
  Sparkles,
  ArrowUpRight,
  ShieldCheck,
  UserCheck,
  Key,
  Database,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function DashboardPage() {
  const { user } = useAuth();

  const stats = [
    {
      title: 'Total Books',
      value: '1,420',
      change: '+12 this week',
      icon: BookOpen,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    {
      title: 'Total Members',
      value: '385',
      change: '+8 new members',
      icon: Users,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
    },
    {
      title: 'Books Issued',
      value: '142',
      change: '10% of inventory',
      icon: Repeat,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
    },
    {
      title: 'Books Available',
      value: '1,278',
      change: 'Ready to borrow',
      icon: CheckCircle,
      color: 'text-[#0bad96]',
      bg: 'bg-teal-50',
    },
    {
      title: 'Overdue Books',
      value: '18',
      change: 'Requires action',
      icon: AlertTriangle,
      color: 'text-red-600',
      bg: 'bg-red-50',
    },
    {
      title: 'Total Categories',
      value: '24',
      change: 'Across all genres',
      icon: FolderTree,
      color: 'text-purple-600',
      bg: 'bg-purple-50',
    },
    {
      title: 'Fine Collected',
      value: '₹8,450',
      change: 'This academic month',
      icon: IndianRupee,
      color: 'text-indigo-600',
      bg: 'bg-indigo-50',
    },
  ];

  const quickActions = [
    { label: 'Issue Book', desc: 'Lend a book to a registered member', icon: Repeat },
    { label: 'Add New Book', desc: 'Add title with ISBN & author details', icon: BookOpen },
    { label: 'Register Member', desc: 'Create new library patron account', icon: Users },
    { label: 'Calculate Fines', desc: 'Review overdue returns & fines', icon: IndianRupee },
  ];

  const recentActivities = [
    {
      id: 1,
      title: 'Session Authenticated',
      detail: `Logged in as ${user?.name || 'Pavan Kumar'} (${user?.email})`,
      time: 'Just now',
      tag: 'Auth',
      tagColor: 'bg-emerald-100 text-emerald-800',
    },
    {
      id: 2,
      title: 'Book Issued: Clean Code',
      detail: 'Issued to Member Rahul Verma (MEM-3042)',
      time: '24 mins ago',
      tag: 'Issue',
      tagColor: 'bg-blue-100 text-blue-800',
    },
    {
      id: 3,
      title: 'Overdue Return Processed',
      detail: 'Fine ₹40 collected from Sneha Reddy (MEM-1829)',
      time: '1 hour ago',
      tag: 'Fines',
      tagColor: 'bg-amber-100 text-amber-800',
    },
    {
      id: 4,
      title: 'New Member Onboarded',
      detail: 'Ananya Sharma registered under Student tier',
      time: '3 hours ago',
      tag: 'Member',
      tagColor: 'bg-purple-100 text-purple-800',
    },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#194c43] via-[#1f5e53] to-[#0bad96] text-white p-8 sm:p-10 shadow-xl shadow-emerald-950/10">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-emerald-100 text-xs font-semibold mb-3 border border-white/20">
            <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
            <span>Module 1: Authentication Active</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Welcome back, {user?.name || 'Pavan Kumar'}! 👋
          </h1>
          <p className="mt-2 text-emerald-100/90 text-sm sm:text-base leading-relaxed">
            LibraBook Library Management System is active. You are authenticated with full administrator privileges.
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5 bg-black/20 px-3 py-1.5 rounded-xl">
              <ShieldCheck className="w-4 h-4 text-emerald-300" />
              <span>Role: <strong className="capitalize">{user?.role || 'Administrator'}</strong></span>
            </div>
            <div className="flex items-center gap-1.5 bg-black/20 px-3 py-1.5 rounded-xl">
              <UserCheck className="w-4 h-4 text-emerald-300" />
              <span>Email: <strong>{user?.email}</strong></span>
            </div>
            <div className="flex items-center gap-1.5 bg-black/20 px-3 py-1.5 rounded-xl">
              <Database className="w-4 h-4 text-emerald-300" />
              <span>Storage: <strong>LocalStorage Active</strong></span>
            </div>
          </div>
        </div>

        {/* Decorative background blur circle */}
        <div className="absolute -right-12 -bottom-12 w-64 h-64 rounded-full bg-white/10 blur-2xl pointer-events-none" />
      </div>

      {/* Library Key Metrics Overview */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Library Key Metrics</h2>
            <p className="text-xs text-slate-500">Live operational overview of library records</p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 bg-emerald-50 text-[#0bad96] rounded-lg border border-emerald-200">
            Real-time Status
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {stats.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="bg-white p-5 rounded-2xl border border-slate-200/70 shadow-xs hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-10 h-10 rounded-xl ${item.bg} ${item.color} flex items-center justify-center`}>
                    <Icon className="w-5 h-5 stroke-[2]" />
                  </div>
                </div>
                <div className="text-2xl font-black text-slate-900 tracking-tight">
                  {item.value}
                </div>
                <div className="text-xs font-semibold text-slate-500 mt-1">
                  {item.title}
                </div>
                <div className="text-[11px] text-emerald-600 font-medium mt-2">
                  {item.change}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Action Cards & Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">Quick Actions</h2>
            <span className="text-xs text-slate-500">Ready for subsequent modules</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <div
                  key={action.label}
                  className="bg-white p-5 rounded-2xl border border-slate-200/70 hover:border-emerald-300 hover:shadow-md transition-all group cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#0bad96] group-hover:bg-[#0bad96] group-hover:text-white transition-colors flex items-center justify-center">
                      <Icon className="w-5 h-5 stroke-[2]" />
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-[#0bad96] transition-colors" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-[#0bad96] transition-colors">
                    {action.label}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    {action.desc}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Module 1 Completion Verified Card */}
          <div className="bg-emerald-50/60 border border-emerald-200 rounded-2xl p-5">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-emerald-500 text-white rounded-xl">
                <CheckCircle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-emerald-950">
                  Authentication & Library Portal Active
                </h4>
                <p className="text-xs text-emerald-800/80 mt-1 leading-relaxed">
                  Login, Register, Forgot Password, Form Validations, Password Show/Hide, LocalStorage Persistence, and Protected Routes are all implemented and verified.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activities */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/70 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-slate-900">Recent Activities</h2>
              <Clock className="w-4 h-4 text-slate-400" />
            </div>

            <div className="space-y-4">
              {recentActivities.map((act) => (
                <div key={act.id} className="flex items-start gap-3 pb-3 border-b border-slate-100 last:border-b-0 last:pb-0">
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-slate-900">{act.title}</h4>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${act.tagColor}`}>
                        {act.tag}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5 leading-snug">{act.detail}</p>
                    <span className="text-[10px] text-slate-400 mt-1 block">{act.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Active Profile Card */}
          <div className="mt-6 pt-4 border-t border-slate-100 bg-slate-50/80 rounded-2xl p-4">
            <div className="text-xs font-bold text-slate-800 mb-2 flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5 text-[#0bad96]" />
              <span>User Profile Details</span>
            </div>
            <div className="text-[11px] space-y-1 text-slate-600">
              <div><strong>Name:</strong> {user?.name || 'Pavan Kumar'}</div>
              <div><strong>Email:</strong> {user?.email}</div>
              <div><strong>Member ID:</strong> {user?.membershipId || 'LIB-ADM-2026-001'}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
