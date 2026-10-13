import React from 'react';

export default function Logo({ size = 'default', showSubtitle = true, variant = 'dark', className = '' }) {
  const isLarge = size === 'large';
  const isSmall = size === 'small';
  const isLight = variant === 'light';

  const iconSize = isLarge ? 'w-11 h-11' : isSmall ? 'w-7 h-7' : 'w-9 h-9';
  const titleSize = isLarge ? 'text-2xl' : isSmall ? 'text-lg' : 'text-xl';
  const subSize = isLarge ? 'text-[10px]' : 'text-[9px]';

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Stylized LibraBook Open Book Vector Icon */}
      <div className={`relative ${iconSize} flex-shrink-0 flex items-center justify-center`}>
        <svg
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-xs"
        >
          {/* Left Wing */}
          <path
            d="M22 10.5C16.8 7.8 9.5 8.2 5 11.2V37.5C9.5 34.5 16.8 34.1 22 36.8V10.5Z"
            fill="url(#tealGradLeft)"
          />
          {/* Left Inner Page Shade */}
          <path
            d="M22 13C17.2 10.5 10.8 10.9 7 13.5V36C10.8 33.4 17.2 33 22 35.5V13Z"
            fill="#06967f"
            opacity="0.3"
          />
          {/* Right Wing */}
          <path
            d="M26 10.5C31.2 7.8 38.5 8.2 43 11.2V37.5C38.5 34.5 31.2 34.1 26 36.8V10.5Z"
            fill="url(#tealGradRight)"
          />
          {/* Right Inner Page Shade */}
          <path
            d="M26 13C30.8 10.5 37.2 10.9 41 13.5V36C37.2 33.4 30.8 33 26 35.5V13Z"
            fill="#0a8874"
            opacity="0.25"
          />
          {/* Center Spine */}
          <rect x="23" y="10" width="2" height="27" rx="1" fill="#047867" />

          <defs>
            <linearGradient id="tealGradLeft" x1="5" y1="10" x2="22" y2="37" gradientUnits="userSpaceOnUse">
              <stop stopColor="#10b981" />
              <stop offset="1" stopColor="#0d9488" />
            </linearGradient>
            <linearGradient id="tealGradRight" x1="26" y1="10" x2="43" y2="37" gradientUnits="userSpaceOnUse">
              <stop stopColor="#0d9488" />
              <stop offset="1" stopColor="#088070" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Brand Typography */}
      <div className="flex flex-col text-left leading-none">
        <div className={`font-black tracking-tight ${titleSize} flex items-baseline`}>
          <span className={isLight ? 'text-white drop-shadow-sm' : 'text-slate-900'}>Libra</span>
          <span className="text-[#0bad96] drop-shadow-sm">Book</span>
        </div>
        {showSubtitle && (
          <span className={`font-bold tracking-[0.22em] uppercase mt-0.5 ${subSize} ${isLight ? 'text-emerald-200/90 drop-shadow-xs' : 'text-slate-400'}`}>
            LIBRARY MANAGEMENT SYSTEM
          </span>
        )}
      </div>
    </div>
  );
}
