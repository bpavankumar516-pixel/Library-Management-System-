import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Menu, Bell, Search, LogOut, Shield, ChevronDown } from 'lucide-react';
import Sidebar from './Sidebar';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';

export default function Layout() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Handle Ctrl+K shortcut to focus search
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        const input = document.getElementById('global-search-input');
        if (input) input.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleLogout = () => {
    logout();
    toast.info('Logged out successfully.');
    navigate('/login', { replace: true });
  };

  return (
    <div className="min-h-screen bg-[#f4fbf8] flex selection:bg-[#0bad96]/20 selection:text-emerald-950">
      {/* Sidebar Navigation */}
      <Sidebar
        isMobileOpen={isMobileOpen}
        onCloseMobile={() => setIsMobileOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-56">
        {/* Top Navbar */}
        <header className="sticky top-0 z-30 h-16 bg-white/95 backdrop-blur-md border-b border-slate-100/90 px-6 sm:px-8 flex items-center justify-between gap-4">
          {/* Mobile Menu & Global Search Bar */}
          <div className="flex items-center gap-3 flex-1 max-w-xl">
            <button
              onClick={() => setIsMobileOpen(true)}
              className="p-2 -ml-2 rounded-xl text-slate-600 hover:bg-slate-100 lg:hidden cursor-pointer"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Global Search Bar with Ctrl+K shortcut badge */}
            <div className="relative w-full max-w-md hidden sm:block">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                id="global-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search books, members, ISBN, etc..."
                className="w-full pl-9 pr-18 py-2 text-xs bg-slate-50 hover:bg-slate-100/70 border border-slate-200/70 rounded-xl focus:outline-none focus:border-[#0bad96] focus:bg-white transition-all text-slate-800 placeholder-slate-400"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-0.5 px-2 py-0.5 rounded-md bg-white border border-slate-200 text-[10px] font-mono text-slate-400 font-semibold shadow-2xs pointer-events-none select-none">
                Ctrl + K
              </div>
            </div>
          </div>

          {/* Right Controls: Notifications & User Profile */}
          <div className="flex items-center gap-4">
            {/* Notification Bell with Badge '3' */}
            <button className="relative p-2 rounded-xl text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer">
              <Bell className="w-5 h-5 stroke-[1.8]" />
              <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-white">
                3
              </span>
            </button>

            {/* User Profile Badge */}
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2.5 p-1 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
              >
                {/* Circular Profile Avatar */}
                <div className="w-9 h-9 rounded-full overflow-hidden border border-slate-200 shadow-2xs flex-shrink-0 bg-emerald-100 flex items-center justify-center text-[#0bad96] font-bold text-sm">
                  {user?.avatarUrl ? (
                    <img
                      src={user.avatarUrl}
                      alt={user.name || 'User'}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span>{user?.name ? user.name.charAt(0) : 'V'}</span>
                  )}
                </div>

                {/* Name & Role */}
                <div className="hidden sm:block text-left leading-tight">
                  <div className="text-xs font-bold text-slate-800">
                    {user?.name || 'Vimal S'}
                  </div>
                  <div className="text-[10px] text-slate-400 font-medium">
                    Admin
                  </div>
                </div>

                <ChevronDown className="w-3.5 h-3.5 text-slate-400 stroke-[2] hidden sm:block" />
              </button>

              {/* Profile Dropdown Menu */}
              {isProfileOpen && (
                <>
                  <div
                    onClick={() => setIsProfileOpen(false)}
                    className="fixed inset-0 z-30"
                  />
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 p-2 z-40 animate-in fade-in zoom-in-95 duration-100">
                    <div className="px-3 py-2 border-b border-slate-100">
                      <p className="text-xs font-bold text-slate-800">{user?.name || 'Vimal S'}</p>
                      <p className="text-[11px] text-slate-400 truncate">{user?.email || 'admin@librabook.com'}</p>
                    </div>

                    <div className="py-1">
                      <div className="px-3 py-1.5 text-xs text-slate-600 flex items-center gap-2">
                        <Shield className="w-3.5 h-3.5 text-[#0bad96]" />
                        <span className="font-semibold capitalize">{user?.role || 'Admin'} Access</span>
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

        {/* Page Content Body */}
        <main className="p-5 sm:p-6 lg:p-7 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
