import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, ArrowLeft, KeyRound, CheckCircle2, Lock, Eye, EyeOff } from 'lucide-react';
import { toast } from 'react-toastify';
import confetti from 'canvas-confetti';
import { useAuth } from '../../context/AuthContext';
import Logo from '../common/Logo';

export default function ForgotPasswordForm() {
  const { resetPassword, defaultAdmin } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [resetEmail, setResetEmail] = useState('');
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
      newPassword: '',
    },
  });

  const handleStep1 = async (data) => {
    setIsSubmitting(true);
    setResetEmail(data.email);
    setTimeout(() => {
      setIsSubmitting(false);
      setStep(2);
      toast.info('Verification code generated. Please set your new password.', {
        icon: '🔑',
      });
    }, 700);
  };

  const handleStep2 = async (data) => {
    setIsSubmitting(true);
    try {
      const res = await resetPassword(resetEmail, data.newPassword);
      if (res.success) {
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.7 },
        });
        setStep(3);
        toast.success('Password updated successfully! You can now log in.');
      } else {
        toast.error(res.message || 'Failed to update password');
      }
    } catch (err) {
      toast.error('Error updating password');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-[430px] mx-auto relative my-auto">
      {/* Back button */}
      <div className="mb-2">
        <Link
          to="/login"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-[#0bad96] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Sign In</span>
        </Link>
      </div>

      {/* Main Floating Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 xl:p-8 shadow-xl shadow-emerald-950/10 border border-slate-100/90 transition-all">
        {/* Centered Brand Logo */}
        <div className="flex justify-center">
          <Logo size="default" />
        </div>

        {/* Step 1: Request Reset */}
        {step === 1 && (
          <div>
            <div className="text-center mt-3 sm:mt-4">
              <h2 className="text-2xl sm:text-[26px] font-extrabold text-slate-900 tracking-tight leading-tight">
                Forgot Password?
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 font-normal leading-relaxed">
                Enter your registered administrator email address to reset your password.
              </p>
            </div>

            {/* Quick-fill demo button */}
            <div className="mt-3 p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs flex items-center justify-between">
              <span className="text-slate-600 font-medium">Demo Admin:</span>
              <button
                type="button"
                onClick={() => setValue('email', defaultAdmin.email)}
                className="text-[#0bad96] font-bold hover:underline cursor-pointer"
              >
                Use {defaultAdmin.email}
              </button>
            </div>

            <form onSubmit={handleSubmit(handleStep1)} className="mt-4 space-y-3">
              <div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    placeholder="Registered Email Address"
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

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#0bad96] to-[#099884] hover:from-[#099884] hover:to-[#077d6d] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20 transition-all duration-150 cursor-pointer disabled:opacity-70"
              >
                {isSubmitting ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <KeyRound className="w-4 h-4 stroke-[2.5]" />
                    <span>Send Verification Code</span>
                  </>
                )}
              </button>
            </form>
          </div>
        )}

        {/* Step 2: Set New Password */}
        {step === 2 && (
          <div>
            <div className="text-center mt-3 sm:mt-4">
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                Set New Password
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Account verified for: <span className="font-semibold text-slate-700">{resetEmail}</span>
              </p>
            </div>

            <form onSubmit={handleSubmit(handleStep2)} className="mt-4 space-y-3">
              <div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter New Password (min. 6 chars)"
                    {...register('newPassword', {
                      required: 'New password is required',
                      minLength: { value: 6, message: 'Password must be at least 6 characters' },
                    })}
                    className={`w-full pl-10 pr-10 py-2.5 bg-white border ${
                      errors.newPassword ? 'border-red-400' : 'border-slate-200 focus:border-[#0bad96]'
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
                {errors.newPassword && (
                  <p className="mt-1 text-xs text-red-500 font-medium pl-1">{errors.newPassword.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#0bad96] to-[#099884] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
              >
                {isSubmitting ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <span>Update Password</span>
                )}
              </button>
            </form>
          </div>
        )}

        {/* Step 3: Success Confirmation */}
        {step === 3 && (
          <div className="text-center py-3">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-[#0bad96] flex items-center justify-center mx-auto mb-3">
              <CheckCircle2 className="w-8 h-8 stroke-[2.2]" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Password Reset Complete!</h3>
            <p className="text-xs text-slate-600 mt-1">
              Your password has been successfully updated. You can now log in.
            </p>
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="mt-4 w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#0bad96] to-[#099884] text-white font-bold text-sm transition-all"
            >
              Proceed to Sign In
            </button>
          </div>
        )}

        <div className="mt-4 text-center text-xs text-slate-500">
          Remember your password?{' '}
          <Link to="/login" className="text-[#0bad96] font-bold hover:underline">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
