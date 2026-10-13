import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, LogIn, Sparkles, BookOpen } from 'lucide-react';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import Logo from '../common/Logo';

export default function LoginForm() {
  const { login, loginWithGoogle, defaultAdmin, getRememberedEmail } = useAuth();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  // Pre-fill remembered email
  useEffect(() => {
    const remembered = getRememberedEmail();
    if (remembered) {
      setValue('email', remembered);
      setValue('rememberMe', true);
    }
  }, [getRememberedEmail, setValue]);

  // 1-Click Auto Fill Demo Admin Credentials
  const handleQuickFill = () => {
    setValue('email', defaultAdmin.email);
    setValue('password', defaultAdmin.password);
    setValue('rememberMe', true);
    toast.info(`Auto-filled Demo Admin: ${defaultAdmin.name}`, {
      icon: '⚡',
      autoClose: 2500,
    });
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const res = await login(data.email, data.password, data.rememberMe);
      if (res.success) {
        toast.success(`Welcome back, ${res.user.name}!`);
        navigate('/dashboard', { replace: true });
      } else {
        toast.error(res.message || 'Login failed');
      }
    } catch (err) {
      toast.error('An unexpected error occurred during sign in.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsSubmitting(true);
    try {
      const res = await loginWithGoogle();
      if (res.success) {
        toast.success(`Welcome, ${res.user.name}!`);
        navigate('/dashboard', { replace: true });
      }
    } catch (err) {
      toast.error('Google Sign-In failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-[440px] mx-auto relative my-auto">
      {/* Top Floating Badge Outside Card */}
      <div className="flex justify-end mb-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 backdrop-blur-xs border border-emerald-100 text-xs font-bold text-slate-700 shadow-xs">
          <BookOpen className="w-3.5 h-3.5 text-[#0bad96]" />
          <span>Welcome Back!</span>
        </div>
      </div>

      {/* Main Floating Card */}
      <div className="bg-white rounded-3xl p-8 sm:p-9 shadow-2xl shadow-emerald-950/10 border border-slate-100/90 transition-all">
        {/* Centered Brand Logo */}
        <div className="flex justify-center mb-5">
          <Logo size="default" />
        </div>

        {/* Heading & Subtitle */}
        <div className="text-center mb-6">
          <h2 className="text-2xl sm:text-[28px] font-black text-slate-900 tracking-tight leading-tight">
            Welcome Back
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1.5 font-normal">
            Sign in to your account to continue
          </p>
        </div>

        {/* 1-Click Demo Admin Credentials Banner */}
        <div className="mb-6 p-3 rounded-2xl bg-emerald-50/80 border border-emerald-200/70 text-xs flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <span className="p-1 rounded-lg bg-emerald-100 text-[#0bad96] font-bold flex-shrink-0">
              <Sparkles className="w-3.5 h-3.5" />
            </span>
            <div className="truncate text-left">
              <span className="font-bold text-slate-800">Admin: </span>
              <span className="text-slate-600 font-semibold">Pavan Kumar</span>
              <span className="hidden sm:inline text-slate-400 text-[11px] ml-1">
                ({defaultAdmin.email})
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={handleQuickFill}
            className="flex-shrink-0 px-3 py-1.5 rounded-xl bg-[#0bad96] hover:bg-[#099884] text-white font-bold text-[11px] transition-colors shadow-xs cursor-pointer"
          >
            Auto Fill
          </button>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Email Input */}
          <div>
            <div className="relative flex items-center">
              <Mail className="w-5 h-5 text-slate-400 absolute left-4 pointer-events-none" />
              <input
                type="email"
                placeholder="Email Address"
                {...register('email', {
                  required: 'Email address is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address',
                  },
                })}
                className={`w-full pl-12 pr-4 h-12 bg-white border ${
                  errors.email ? 'border-red-400 focus:ring-red-200' : 'border-slate-200 focus:border-[#0bad96] focus:ring-emerald-500/15'
                } rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-4 transition-all duration-150`}
              />
            </div>
            {errors.email && (
              <p className="mt-1 text-xs text-red-500 font-medium pl-1 text-left">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password Input */}
          <div>
            <div className="relative flex items-center">
              <Lock className="w-5 h-5 text-slate-400 absolute left-4 pointer-events-none" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                {...register('password', {
                  required: 'Password is required',
                  minLength: {
                    value: 6,
                    message: 'Password must be at least 6 characters',
                  },
                })}
                className={`w-full pl-12 pr-12 h-12 bg-white border ${
                  errors.password ? 'border-red-400 focus:ring-red-200' : 'border-slate-200 focus:border-[#0bad96] focus:ring-emerald-500/15'
                } rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-4 transition-all duration-150`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 text-slate-400 hover:text-slate-600 cursor-pointer focus:outline-none"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-xs text-red-500 font-medium pl-1 text-left">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Remember me & Forgot Password Row */}
          <div className="flex items-center justify-between text-xs sm:text-sm pt-0.5">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                {...register('rememberMe')}
                className="w-4 h-4 rounded border-slate-300 text-[#0bad96] focus:ring-[#0bad96] accent-[#0bad96]"
              />
              <span className="text-slate-700 font-medium">Remember me</span>
            </label>

            <Link
              to="/forgot-password"
              className="text-[#0bad96] hover:text-[#099884] font-bold hover:underline"
            >
              Forgot Password?
            </Link>
          </div>

          {/* Sign In Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-12 rounded-xl bg-gradient-to-r from-[#0bad96] to-[#099884] hover:from-[#099884] hover:to-[#077d6d] text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/25 transition-all duration-150 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed mt-2"
          >
            {isSubmitting ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <LogIn className="w-5 h-5 stroke-[2.5]" />
                <span>Sign In</span>
              </>
            )}
          </button>
        </form>

        {/* OR Divider */}
        <div className="relative my-5 flex items-center justify-center">
          <div className="w-full border-t border-slate-200 absolute" />
          <span className="bg-white px-3 relative text-[11px] font-bold text-slate-400 uppercase tracking-widest">
            OR
          </span>
        </div>

        {/* Continue with Google Button */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={isSubmitting}
          className="w-full h-12 rounded-xl border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-bold text-sm flex items-center justify-center gap-3 transition-colors shadow-xs cursor-pointer disabled:opacity-70"
        >
          <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.15z"
            />
            <path
              fill="#34A853"
              d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.27v3.15C3.25 21.36 7.31 24 12 24z"
            />
            <path
              fill="#FBBC05"
              d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.27C.46 8.2 0 10.04 0 12s.46 3.8 1.27 5.42l4.01-3.15z"
            />
            <path
              fill="#EA4335"
              d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.25 2.64 1.27 6.58l4.01 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
            />
          </svg>
          <span>Continue with Google</span>
        </button>

        {/* Bottom Link to Register */}
        <div className="mt-6 text-center text-xs sm:text-sm text-slate-600">
          <span>Don't have an account?</span>
          <Link
            to="/register"
            className="text-[#0bad96] hover:text-[#099884] font-bold hover:underline ml-1.5"
          >
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}
