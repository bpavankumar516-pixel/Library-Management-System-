import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  BookOpen,
  Users,
  Repeat,
  Receipt,
  Search,
  BarChart3,
  Settings,
  LogOut,
  ShieldCheck,
} from 'lucide-react';
import Logo from '../common/Logo';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';

export default function Sidebar({ isMobileOpen, onCloseMobile }) {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    toast.info('You have been logged out securely.');
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, badge: 'Active' },
    { name: 'Book Management', path: '/books', icon: BookOpen, badge: 'Mod 3' },
    { name: 'Member Management', path: '/members', icon: Users, badge: 'Mod 4' },
    { name: 'Issue / Return', path: '/issue-return', icon: Repeat, badge: 'Mod 5' },
    { name: 'Fine Calculation', path: '/fines', icon: Receipt, badge: 'Mod 6' },
    { name: 'Search & Categories', path: '/categories', icon: Search, badge: 'Mod 7' },
    { name: 'Reports', path: '/reports', icon: BarChart3, badge: 'Mod 8' },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-40 lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-white border-r border-slate-200/80 flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Top Branding */}
        <div>
          <div className="h-20 px-6 flex items-center border-b border-slate-100">
            <Logo size="default" />
          </div>

          {/* Navigation Links */}
          <div className="px-3 py-4 space-y-1">
            <div className="px-3 mb-2 text-[10px] font-extrabold tracking-wider text-slate-400 uppercase">
              Main Menu
            </div>
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.name}
                  to={item.path}
                  onClick={onCloseMobile}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 ${
                      isActive
                        ? 'bg-emerald-50 text-[#0bad96]'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`
                  }
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-5 h-5 stroke-[1.8]" />
                    <span>{item.name}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                        item.badge === 'Active'
                          ? 'bg-[#0bad96] text-white'
                          : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </div>
        </div>

        {/* Bottom Current User & Logout */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50">
          <div className="p-3 rounded-2xl bg-white border border-slate-200/70 shadow-xs flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#0bad96] to-emerald-400 text-white flex items-center justify-center font-bold text-sm shadow-xs flex-shrink-0">
                {user?.name ? user.name.charAt(0) : 'P'}
              </div>
              <div className="truncate">
                <p className="text-xs font-bold text-slate-900 truncate">{user?.name || 'Pavan Kumar'}</p>
                <div className="flex items-center gap-1 text-[11px] text-[#0bad96] font-semibold">
                  <ShieldCheck className="w-3 h-3" />
                  <span className="capitalize">{user?.role || 'Admin'}</span>
                </div>
              </div>
            </div>

            <button
              onClick={handleLogout}
              title="Logout"
              className="p-2 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4 stroke-[2]" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
