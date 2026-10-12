import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Lock, Eye, EyeOff, UserPlus, Shield, Check } from 'lucide-react';
import { toast } from 'react-toastify';
import confetti from 'canvas-confetti';
import { useAuth } from '../../context/AuthContext';
import Logo from '../common/Logo';

export default function RegisterForm() {
  const { register: registerAuth } = useAuth();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: 'admin',
      terms: true,
    },
  });

  const password = watch('password') || '';

  // Password strength calculation
  const getPasswordStrength = (pass) => {
    if (!pass) return { score: 0, text: '', color: 'bg-slate-200' };
    let score = 0;
    if (pass.length >= 6) score += 1;
    if (pass.length >= 8) score += 1;
    if (/[A-Z]/.test(pass) || /[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;

    switch (score) {
      case 1:
        return { score: 1, text: 'Weak', color: 'bg-red-400' };
      case 2:
        return { score: 2, text: 'Fair', color: 'bg-amber-400' };
      case 3:
        return { score: 3, text: 'Good', color: 'bg-blue-400' };
      case 4:
      default:
        return { score: 4, text: 'Strong', color: 'bg-emerald-500' };
    }
  };

  const strength = getPasswordStrength(password);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const res = await registerAuth({
        name: data.name,
        email: data.email,
        password: data.password,
        role: data.role,
      });

      if (res.success) {
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.7 },
        });

        toast.success(`Account created successfully! Welcome, ${res.user.name}.`, {
          icon: '🎉',
        });

        setTimeout(() => {
          navigate('/dashboard', { replace: true });
        }, 600);
      } else {
        toast.error(res.message || 'Registration failed');
      }
    } catch (err) {
      toast.error('An unexpected error occurred during registration.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-[430px] mx-auto relative my-auto">
      {/* Top Floating Pill */}
      <div className="hidden sm:flex justify-end mb-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/80 backdrop-blur-xs border border-emerald-100 text-xs font-semibold text-slate-700 shadow-xs">
          <Shield className="w-3.5 h-3.5 text-[#0bad96]" />
          <span>New Account Setup</span>
        </div>
      </div>

      {/* Main Floating Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 xl:p-8 shadow-xl shadow-emerald-950/10 border border-slate-100/90 transition-all">
        {/* Centered Brand Logo */}
        <div className="flex justify-center">
          <Logo size="default" />
        </div>

        {/* Heading */}
        <div className="text-center mt-3 sm:mt-4">
          <h2 className="text-2xl sm:text-[26px] font-extrabold text-slate-900 tracking-tight leading-tight">
            Create Account
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5 font-normal">
            Register as Library Administrator or Staff
          </p>
        </div>

        {/* Registration Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="mt-3.5 space-y-3">
          {/* Full Name */}
          <div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                placeholder="Full Name (e.g. Pavan Kumar)"
                {...register('name', {
                  required: 'Full name is required',
                  minLength: { value: 3, message: 'Name must be at least 3 characters' },
                })}
                className={`w-full pl-10 pr-4 py-2.5 bg-white border ${
                  errors.name ? 'border-red-400 focus:ring-red-200' : 'border-slate-200 focus:border-[#0bad96] focus:ring-emerald-100'
                } rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-3 transition-all duration-150`}
              />
            </div>
            {errors.name && (
              <p className="mt-1 text-xs text-red-500 font-medium pl-1">{errors.name.message}</p>
            )}
          </div>

          {/* Email Address */}
          <div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Mail className="w-4 h-4" />
              </div>
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
                className={`w-full pl-10 pr-4 py-2.5 bg-white border ${
                  errors.email ? 'border-red-400 focus:ring-red-200' : 'border-slate-200 focus:border-[#0bad96] focus:ring-emerald-100'
                } rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-3 transition-all duration-150`}
              />
            </div>
            {errors.email && (
              <p className="mt-1 text-xs text-red-500 font-medium pl-1">{errors.email.message}</p>
            )}
          </div>

          {/* Role selector */}
          <div>
            <div className="grid grid-cols-2 gap-2">
              <label className="flex items-center justify-center gap-2 p-2 rounded-xl border border-emerald-200 bg-emerald-50/60 text-[#0bad96] font-semibold text-xs cursor-pointer select-none">
                <input
                  type="radio"
                  value="admin"
                  {...register('role')}
                  className="accent-[#0bad96]"
                />
                <span>Administrator</span>
              </label>
              <label className="flex items-center justify-center gap-2 p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs cursor-pointer select-none">
                <input
                  type="radio"
                  value="librarian"
                  {...register('role')}
                  className="accent-[#0bad96]"
                />
                <span>Librarian</span>
              </label>
            </div>
          </div>

          {/* Password */}
          <div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password (min. 6 characters)"
                {...register('password', {
                  required: 'Password is required',
                  minLength: { value: 6, message: 'Password must be at least 6 characters' },
                })}
                className={`w-full pl-10 pr-10 py-2.5 bg-white border ${
                  errors.password ? 'border-red-400 focus:ring-red-200' : 'border-slate-200 focus:border-[#0bad96] focus:ring-emerald-100'
                } rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-3 transition-all duration-150`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {/* Password strength bar */}
            {password.length > 0 && (
              <div className="mt-1 flex items-center gap-1.5 px-1">
                <div className="flex-1 h-1 bg-slate-100 rounded-full overflow-hidden flex gap-1">
                  <div className={`h-full flex-1 rounded-full ${strength.score >= 1 ? strength.color : 'bg-slate-200'}`} />
                  <div className={`h-full flex-1 rounded-full ${strength.score >= 2 ? strength.color : 'bg-slate-200'}`} />
                  <div className={`h-full flex-1 rounded-full ${strength.score >= 3 ? strength.color : 'bg-slate-200'}`} />
                  <div className={`h-full flex-1 rounded-full ${strength.score >= 4 ? strength.color : 'bg-slate-200'}`} />
                </div>
                <span className="text-[10px] font-bold text-slate-500">{strength.text}</span>
              </div>
            )}
            {errors.password && (
              <p className="mt-1 text-xs text-red-500 font-medium pl-1">{errors.password.message}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Confirm Password"
                {...register('confirmPassword', {
                  required: 'Please confirm your password',
                  validate: (val) => val === password || 'Passwords do not match',
                })}
                className={`w-full pl-10 pr-10 py-2.5 bg-white border ${
                  errors.confirmPassword ? 'border-red-400 focus:ring-red-200' : 'border-slate-200 focus:border-[#0bad96] focus:ring-emerald-100'
                } rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-3 transition-all duration-150`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="mt-1 text-xs text-red-500 font-medium pl-1">{errors.confirmPassword.message}</p>
            )}
          </div>

          {/* Terms checkbox */}
          <div className="pt-0.5">
            <label className="flex items-start gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                {...register('terms', { required: 'You must agree to continue' })}
                className="mt-0.5 w-3.5 h-3.5 rounded border-slate-300 text-[#0bad96] focus:ring-[#0bad96] accent-[#0bad96]"
              />
              <span className="text-xs text-slate-600">
                I agree to the Library Management System policies.
              </span>
            </label>
            {errors.terms && (
              <p className="mt-1 text-xs text-red-500 font-medium pl-1">{errors.terms.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-[#0bad96] to-[#099884] hover:from-[#099884] hover:to-[#077d6d] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20 transition-all duration-150 cursor-pointer disabled:opacity-70"
          >
            {isSubmitting ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <UserPlus className="w-4 h-4 stroke-[2.5]" />
                <span>Create Account</span>
              </>
            )}
          </button>
        </form>

        {/* Bottom Link to Sign In */}
        <div className="mt-4 text-center text-xs text-slate-600">
          <span>Already have an account? </span>
          <Link
            to="/login"
            className="text-[#0bad96] hover:text-[#099884] font-bold hover:underline"
          >
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
