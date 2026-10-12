import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Menu, Bell, Search, LogOut, Shield, ChevronDown } from 'lucide-react';
import Sidebar from './Sidebar';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';

export default function Layout() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.info('Logged out successfully.');
    navigate('/login', { replace: true });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <Sidebar
        isMobileOpen={isMobileOpen}
        onCloseMobile={() => setIsMobileOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        {/* Top Navbar */}
        <header className="sticky top-0 z-30 h-20 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-6 sm:px-8 flex items-center justify-between gap-4">
          {/* Left: Mobile Toggle & Quick Search */}
          <div className="flex items-center gap-4 flex-1 max-w-lg">
            <button
              onClick={() => setIsMobileOpen(true)}
              className="p-2 -ml-2 rounded-xl text-slate-600 hover:bg-slate-100 lg:hidden cursor-pointer"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Quick Search */}
            <div className="relative w-full hidden sm:block">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search books, authors, members..."
                className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-slate-100/70 border border-slate-200/60 rounded-xl focus:outline-none focus:border-[#0bad96] focus:bg-white transition-all"
              />
            </div>
          </div>

          {/* Right: Notifications & User Profile */}
          <div className="flex items-center gap-3">
            {/* Notification Bell */}
            <button className="relative p-2.5 rounded-xl text-slate-500 hover:bg-slate-100 transition-colors cursor-pointer">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#0bad96] ring-2 ring-white" />
            </button>

            {/* User Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-3 p-1.5 pr-2.5 rounded-2xl hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#0bad96] to-emerald-400 text-white flex items-center justify-center font-bold text-sm shadow-xs">
                  {user?.name ? user.name.charAt(0) : 'P'}
                </div>
                <div className="hidden md:block text-left">
                  <div className="text-xs font-bold text-slate-800 leading-tight">
                    {user?.name || 'Pavan Kumar'}
                  </div>
                  <div className="text-[10px] text-emerald-600 font-semibold tracking-wide">
                    Library Portal
                  </div>
                </div>
                <ChevronDown className="w-4 h-4 text-slate-400 hidden md:block" />
              </button>

              {/* Dropdown Menu */}
              {isProfileOpen && (
                <>
                  <div
                    onClick={() => setIsProfileOpen(false)}
                    className="fixed inset-0 z-30"
                  />
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 p-2 z-40 animate-in fade-in zoom-in-95 duration-100">
                    <div className="px-3 py-2 border-b border-slate-100">
                      <p className="text-xs font-bold text-slate-800">{user?.name}</p>
                      <p className="text-[11px] text-slate-400 truncate">{user?.email}</p>
                    </div>

                    <div className="py-1">
                      <div className="px-3 py-1.5 text-xs text-slate-600 flex items-center gap-2">
                        <Shield className="w-3.5 h-3.5 text-[#0bad96]" />
                        <span className="font-semibold capitalize">{user?.role} Access</span>
                      </div>
                    </div>

                    <div className="pt-1 border-t border-slate-100">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Content Body */}
        <main className="p-6 sm:p-8 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
