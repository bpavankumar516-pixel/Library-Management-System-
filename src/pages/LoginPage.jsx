import React from 'react';
import AuthHero from '../components/auth/AuthHero';
import LoginForm from '../components/auth/LoginForm';

export default function LoginPage() {
  return (
    <div className="min-h-screen lg:h-screen w-full bg-[#edf9f5] flex flex-col lg:flex-row overflow-y-auto lg:overflow-hidden selection:bg-[#0bad96]/20 selection:text-emerald-950">
      {/* Left Column: Full Clarity Hero Showcase (50%) */}
      <div className="w-full lg:w-1/2 lg:h-full relative overflow-hidden flex-shrink-0 border-b lg:border-b-0 lg:border-r border-emerald-100/80">
        <AuthHero />
      </div>

      {/* Right Column: Centered Login Card (50%) */}
      <div className="w-full lg:w-1/2 lg:h-full bg-gradient-to-br from-[#edf9f5] via-[#f5fbf9] to-[#e2f5ee] flex items-center justify-center p-6 sm:p-8 lg:p-10 xl:p-12 relative overflow-y-auto">
        {/* Subtle decorative glow blurs */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-300/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-teal-200/20 rounded-full blur-3xl pointer-events-none" />

        {/* Decorative Floating Leaves */}
        <div className="absolute top-8 left-8 text-emerald-300/40 select-none pointer-events-none text-2xl rotate-12">
          🍃
        </div>
        <div className="absolute bottom-10 right-10 text-emerald-400/30 select-none pointer-events-none text-3xl -rotate-45">
          🌿
        </div>

        {/* Card Component */}
        <div className="relative z-10 w-full flex items-center justify-center py-4 lg:py-0">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
