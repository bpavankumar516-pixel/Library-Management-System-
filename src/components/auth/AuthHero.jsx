import React from 'react';
import { BookOpen, Users, BarChart3, ShieldCheck } from 'lucide-react';
import Logo from '../common/Logo';
import libraryBg from '../../assets/library_books_stack_hd.jpg';

export default function AuthHero() {
  const features = [
    { label: 'Manage Books', icon: BookOpen },
    { label: 'Track Members', icon: Users },
    { label: 'Get Reports', icon: BarChart3 },
    { label: 'Secure & Reliable', icon: ShieldCheck },
  ];

  return (
    <div className="relative w-full h-full flex flex-col justify-between p-8 sm:p-10 lg:p-12 xl:p-14 overflow-hidden select-none">
      {/* 1. Full HD Background Image (100% clarity, pure photographic colors, NO white color overlay) */}
      <img
        src={libraryBg}
        alt="Library Books"
        className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none select-none"
      />

      {/* 2. Soft Ambient Vignette for Sharp Contrast (Zero white haze) */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/35 to-transparent pointer-events-none" />

      {/* Top Header Logo (White text variant on dark photo) */}
      <div className="relative z-10 flex-shrink-0">
        <Logo size="large" variant="light" />
      </div>

      {/* Main Hero Showcase */}
      <div className="relative z-10 my-auto py-4 max-w-xl flex-shrink-0">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-[1.12] drop-shadow-md">
          More Books <br />
          Bigger <span className="text-emerald-400 drop-shadow-md">Dreams</span>
        </h1>

        <p className="mt-3 text-sm sm:text-base text-emerald-100 font-medium leading-relaxed max-w-md drop-shadow-sm">
          Manage your library, track books, members and more — all in one modern workspace.
        </p>

        {/* 4 Feature Badges */}
        <div className="grid grid-cols-4 gap-3 sm:gap-4 mt-6 max-w-md">
          {features.map((feat) => {
            const Icon = feat.icon;
            return (
              <div
                key={feat.label}
                className="flex flex-col items-center text-center group transition-transform hover:-translate-y-1 duration-200 cursor-default"
              >
                <div className="w-12 h-12 rounded-2xl bg-black/40 border border-white/20 backdrop-blur-md shadow-lg flex items-center justify-center text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-200">
                  <Icon className="w-5 h-5 stroke-[2]" />
                </div>
                <span className="mt-2 text-[11px] sm:text-xs font-bold text-white drop-shadow-sm leading-tight">
                  {feat.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Quote Banner in Frosted Deep Emerald */}
      <div className="relative z-10 flex-shrink-0 bg-black/50 border border-white/15 backdrop-blur-md text-white px-6 py-4 rounded-2xl shadow-xl flex items-center gap-4 max-w-md">
        <span className="text-3xl leading-none text-emerald-400 font-serif select-none flex-shrink-0">“</span>
        <div className="flex flex-col sm:flex-row sm:items-baseline sm:gap-2">
          <p className="text-xs sm:text-sm font-semibold text-emerald-50 leading-snug">
            A library is a hospital for the mind.
          </p>
          <span className="text-[11px] text-emerald-300 font-normal tracking-wide">
            — Anonymous
          </span>
        </div>
      </div>
    </div>
  );
}
