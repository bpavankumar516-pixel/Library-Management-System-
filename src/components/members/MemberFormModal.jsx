import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { UserPlus, UserCheck, X, Upload, Camera, Calendar, Check } from 'lucide-react';

export default function MemberFormModal({ isOpen, onClose, onSubmit, initialMember = null }) {
  const isEdit = Boolean(initialMember);
  const [photoPreview, setPhotoPreview] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: '',
      membershipId: '',
      email: '',
      mobile: '',
      address: '',
      joinDate: '11 Oct 2025',
      status: 'Active',
      avatarUrl: '',
    },
  });

  useEffect(() => {
    if (initialMember) {
      reset({
        name: initialMember.name || '',
        membershipId: initialMember.membershipId || '',
        email: initialMember.email || '',
        mobile: initialMember.mobile || '',
        address: initialMember.address || '',
        joinDate: initialMember.joinDate || '10 Jan 2025',
        status: initialMember.status || 'Active',
        avatarUrl: initialMember.avatarUrl || '',
      });
      setPhotoPreview(initialMember.avatarUrl || '');
    } else {
      reset({
        name: '',
        membershipId: '',
        email: '',
        mobile: '',
        address: '',
        joinDate: '11 Oct 2025',
        status: 'Active',
        avatarUrl: '',
      });
      setPhotoPreview('');
    }
  }, [initialMember, reset, isOpen]);

  // Handle local photo upload / selection
  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPhotoPreview(url);
      setValue('avatarUrl', url);
    }
  };

  if (!isOpen) return null;

  const onFormSubmit = async (data) => {
    await onSubmit({
      ...data,
      avatarUrl: photoPreview || data.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=256&q=80',
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl p-6 sm:p-7 w-full max-w-2xl shadow-2xl border border-slate-100 my-auto animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-[#0bad96] flex items-center justify-center">
              {isEdit ? <UserCheck className="w-4 h-4 stroke-[2]" /> : <UserPlus className="w-4 h-4 stroke-[2]" />}
            </div>
            <div className="text-left">
              <h2 className="text-base font-bold text-slate-900">
                {isEdit ? 'Edit Member' : 'Add New Member'}
              </h2>
              <p className="text-[11px] text-slate-400">
                {isEdit ? 'Update the member information' : 'Fill in the details to register a new member'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-3.5 text-xs">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
            {/* Left Column: Photo Upload / Avatar */}
            <div className="md:col-span-4 flex flex-col items-center justify-center">
              {isEdit ? (
                /* Edit Mode: Circular Photo + Change Photo Button */
                <div className="flex flex-col items-center gap-2.5">
                  <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-2 border-emerald-500/30 p-1 bg-slate-50 shadow-md">
                    <img
                      src={photoPreview || initialMember?.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=256&q=80'}
                      alt="Member"
                      className="w-full h-full object-cover rounded-full"
                    />
                  </div>
                  <label className="text-[11px] font-bold text-[#0bad96] hover:text-[#099884] cursor-pointer">
                    <span>Change Photo</span>
                    <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                  </label>
                </div>
              ) : (
                /* Add Mode: Upload Box matching Panel 1 of screenshot */
                <label className="w-full h-44 rounded-2xl border-2 border-dashed border-slate-200 hover:border-emerald-400 bg-slate-50/70 hover:bg-emerald-50/20 transition-all flex flex-col items-center justify-center p-3 text-center cursor-pointer group">
                  {photoPreview ? (
                    <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-[#0bad96] shadow-xs">
                      <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <>
                      <div className="w-10 h-10 rounded-xl bg-slate-100 group-hover:bg-emerald-100 text-slate-400 group-hover:text-[#0bad96] flex items-center justify-center mb-2 transition-colors">
                        <Camera className="w-5 h-5 stroke-[1.8]" />
                      </div>
                      <span className="font-bold text-slate-700 text-xs">Upload Photo</span>
                      <span className="text-[10px] text-slate-400 mt-0.5">JPG, PNG (Max 2MB)</span>
                    </>
                  )}
                  <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                </label>
              )}
            </div>

            {/* Right Column: Inputs */}
            <div className="md:col-span-8 space-y-3">
              {/* Row 1: Full Name & Membership ID */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter full name"
                    {...register('name', { required: 'Full name is required' })}
                    className={`w-full p-2.5 rounded-xl border ${
                      errors.name ? 'border-red-400' : 'border-slate-200 focus:border-[#0bad96]'
                    } focus:outline-none focus:ring-2 focus:ring-emerald-50 text-slate-800`}
                  />
                  {errors.name && (
                    <span className="text-[10px] text-red-500 font-medium">{errors.name.message}</span>
                  )}
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Membership ID <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter membership ID"
                    {...register('membershipId', { required: 'Membership ID is required' })}
                    className={`w-full p-2.5 rounded-xl border ${
                      errors.membershipId ? 'border-red-400' : 'border-slate-200 focus:border-[#0bad96]'
                    } focus:outline-none focus:ring-2 focus:ring-emerald-50 text-slate-800 font-mono text-xs`}
                  />
                  {errors.membershipId && (
                    <span className="text-[10px] text-red-500 font-medium">{errors.membershipId.message}</span>
                  )}
                </div>
              </div>

              {/* Row 2: Email & Mobile Number */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    placeholder="Enter email address"
                    {...register('email', {
                      required: 'Email is required',
                      pattern: { value: /\S+@\S+\.\S+/, message: 'Valid email required' },
                    })}
                    className={`w-full p-2.5 rounded-xl border ${
                      errors.email ? 'border-red-400' : 'border-slate-200 focus:border-[#0bad96]'
                    } focus:outline-none focus:ring-2 focus:ring-emerald-50 text-slate-800`}
                  />
                  {errors.email && (
                    <span className="text-[10px] text-red-500 font-medium">{errors.email.message}</span>
                  )}
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Mobile Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    placeholder="Enter mobile number"
                    {...register('mobile', { required: 'Mobile number is required' })}
                    className={`w-full p-2.5 rounded-xl border ${
                      errors.mobile ? 'border-red-400' : 'border-slate-200 focus:border-[#0bad96]'
                    } focus:outline-none focus:ring-2 focus:ring-emerald-50 text-slate-800`}
                  />
                  {errors.mobile && (
                    <span className="text-[10px] text-red-500 font-medium">{errors.mobile.message}</span>
                  )}
                </div>
              </div>

              {/* Row 3: Address */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Address <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows="2"
                  placeholder="Enter address"
                  {...register('address', { required: 'Address is required' })}
                  className={`w-full p-2.5 rounded-xl border ${
                    errors.address ? 'border-red-400' : 'border-slate-200 focus:border-[#0bad96]'
                  } focus:outline-none focus:ring-2 focus:ring-emerald-50 text-slate-800 resize-none`}
                />
                {errors.address && (
                  <span className="text-[10px] text-red-500 font-medium">{errors.address.message}</span>
                )}
              </div>

              {/* Row 4: Membership Date & Status (if edit) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Membership Date <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="e.g. 11 Oct 2025"
                      {...register('joinDate', { required: 'Date is required' })}
                      className="w-full p-2.5 pr-8 rounded-xl border border-slate-200 focus:border-[#0bad96] focus:outline-none focus:ring-2 focus:ring-emerald-50 text-slate-800"
                    />
                    <Calendar className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                {isEdit && (
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">
                      Status <span className="text-red-500">*</span>
                    </label>
                    <select
                      {...register('status')}
                      className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-[#0bad96] focus:outline-none focus:ring-2 focus:ring-emerald-50 text-slate-800 bg-white"
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-[#0bad96] hover:bg-[#099884] active:bg-[#077d6d] text-white font-bold flex items-center gap-2 shadow-xs transition-colors cursor-pointer disabled:opacity-70"
            >
              {isSubmitting ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : isEdit ? (
                <>
                  <Check className="w-4 h-4 stroke-[2.5]" />
                  <span>Update Member</span>
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4 stroke-[2.5]" />
                  <span>Add Member</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
