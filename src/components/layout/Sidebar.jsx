import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  BookOpen,
  Users,
  Repeat,
  Coins,
  Search,
  BarChart2,
  Settings,
  ChevronRight,
} from 'lucide-react';
import Logo from '../common/Logo';
import sidebarSproutImg from '../../assets/sidebar_book_sprout_trans.png';

export default function Sidebar({ isMobileOpen, onCloseMobile }) {
  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, hasChevron: false },
    { name: 'Books', path: '/books', icon: BookOpen, hasChevron: true },
    { name: 'Members', path: '/members', icon: Users, hasChevron: true },
    { name: 'Issue / Return', path: '/issue-return', icon: Repeat, hasChevron: false },
    { name: 'Fines', path: '/fines', icon: Coins, hasChevron: false },
    { name: 'Search & Categories', path: '/categories', icon: Search, hasChevron: true },
    { name: 'Reports', path: '/reports', icon: BarChart2, hasChevron: true },
    { name: 'Settings', path: '/settings', icon: Settings, hasChevron: true },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-56 bg-white border-r border-slate-100 flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 select-none ${
          isMobileOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        }`}
      >
        {/* Top: Branding & Navigation Items */}
        <div className="flex-1 overflow-y-auto no-scrollbar">
          {/* Brand Header */}
          <div className="h-18 px-5 flex items-center border-b border-slate-50">
            <Logo size="default" />
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.name}
                  to={item.path}
                  onClick={onCloseMobile}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 ${
                      isActive
                        ? 'bg-[#e6f7f3] text-[#0bad96] font-bold shadow-xs'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`
                  }
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 stroke-[2]" />
                    <span>{item.name}</span>
                  </div>
                  {item.hasChevron && (
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400 stroke-[2]" />
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Bottom Artwork: "Good Books Build Better Tomorrows" + Stacked Books & Sprout */}
        <div className="p-3 relative overflow-hidden flex flex-col items-center justify-end text-center pointer-events-none select-none">
          <div className="w-full flex justify-center">
            <img
              src={sidebarSproutImg}
              alt="Good Books Build Better Tomorrows"
              className="w-36 max-h-48 object-contain drop-shadow-xs"
            />
          </div>
        </div>
      </aside>
    </>
  );
}
