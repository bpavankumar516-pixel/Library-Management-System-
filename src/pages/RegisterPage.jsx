import React from 'react';
import AuthHero from '../components/auth/AuthHero';
import RegisterForm from '../components/auth/RegisterForm';

export default function RegisterPage() {
  return (
    <div className="min-h-screen lg:h-screen w-full bg-[#edf9f5] flex flex-col lg:flex-row overflow-y-auto lg:overflow-hidden selection:bg-[#0bad96]/20 selection:text-emerald-950">
      {/* Left Column: Complete Hero Showcase */}
      <div className="w-full lg:w-[52%] xl:w-[50%] lg:h-full relative overflow-hidden flex-shrink-0">
        <AuthHero />
      </div>

      {/* Right Column: Register Card */}
      <div className="w-full lg:w-[48%] xl:w-[50%] lg:h-full bg-gradient-to-br from-[#edf9f5] via-[#f5fbf9] to-[#e2f5ee] flex items-center justify-center p-4 sm:p-6 lg:p-8 xl:p-10 relative overflow-y-auto">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-300/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-teal-200/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 w-full flex items-center justify-center py-4 lg:py-0">
          <RegisterForm />
        </div>
      </div>
    </div>
  );
}
