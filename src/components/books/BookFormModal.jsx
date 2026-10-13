import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { BookOpen, X, PlusCircle, Check } from 'lucide-react';

const CATEGORIES = [
  'Self Help',
  'Programming',
  'Technology',
  'Fiction',
  'Science Fiction',
  'Finance',
  'Philosophy',
  'History',
];

export default function BookFormModal({ isOpen, onClose, onSubmit, initialBook = null }) {
  const isEdit = Boolean(initialBook);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      title: '',
      author: '',
      isbn: '',
      publisher: '',
      category: 'Self Help',
      year: new Date().getFullYear(),
      totalCopies: 5,
      availableCopies: 5,
      description: '',
      coverUrl: '',
    },
  });

  useEffect(() => {
    if (initialBook) {
      reset({
        title: initialBook.title || '',
        author: initialBook.author || '',
        isbn: initialBook.isbn || '',
        publisher: initialBook.publisher || '',
        category: initialBook.category || 'Self Help',
        year: initialBook.year || 2024,
        totalCopies: initialBook.totalCopies || 5,
        availableCopies: initialBook.availableCopies || 5,
        description: initialBook.description || '',
        coverUrl: initialBook.coverUrl || '',
      });
    } else {
      reset({
        title: '',
        author: '',
        isbn: '',
        publisher: '',
        category: 'Self Help',
        year: new Date().getFullYear(),
        totalCopies: 5,
        availableCopies: 5,
        description: '',
        coverUrl: '',
      });
    }
  }, [initialBook, reset, isOpen]);

  const watchCoverUrl = watch('coverUrl') || initialBook?.coverUrl;

  if (!isOpen) return null;

  const onFormSubmit = async (data) => {
    await onSubmit(data);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl p-6 sm:p-7 w-full max-w-2xl shadow-2xl border border-slate-100 my-auto animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-[#0bad96] flex items-center justify-center">
              <BookOpen className="w-4 h-4 stroke-[2]" />
            </div>
            <div className="text-left">
              <h2 className="text-base font-bold text-slate-900">
                {isEdit ? 'Edit Book' : 'Add New Book'}
              </h2>
              <p className="text-[11px] text-slate-400">
                {isEdit
                  ? 'Update book details'
                  : 'Fill in the details to add a new book to the library.'}
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
          {/* If Editing, display cover thumbnail preview row */}
          {isEdit && watchCoverUrl && (
            <div className="flex items-center gap-3 p-2.5 rounded-2xl bg-slate-50 border border-slate-100 mb-2">
              <img
                src={watchCoverUrl}
                alt="Book Preview"
                className="w-10 h-14 object-cover rounded-lg shadow-xs border border-slate-200"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
              <div className="text-left leading-tight">
                <div className="text-xs font-bold text-slate-800">{watch('title') || 'Book Title'}</div>
                <div className="text-[11px] text-slate-400">{watch('author') || 'Author'}</div>
              </div>
            </div>
          )}

          {/* Row 1: Book Title & Author Name */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Book Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Enter book title"
                {...register('title', { required: 'Book title is required' })}
                className={`w-full p-2.5 rounded-xl border ${
                  errors.title ? 'border-red-400' : 'border-slate-200 focus:border-[#0bad96]'
                } focus:outline-none focus:ring-2 focus:ring-emerald-50 text-slate-800`}
              />
              {errors.title && (
                <span className="text-[10px] text-red-500 font-medium">{errors.title.message}</span>
              )}
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Author Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Enter author name"
                {...register('author', { required: 'Author name is required' })}
                className={`w-full p-2.5 rounded-xl border ${
                  errors.author ? 'border-red-400' : 'border-slate-200 focus:border-[#0bad96]'
                } focus:outline-none focus:ring-2 focus:ring-emerald-50 text-slate-800`}
              />
              {errors.author && (
                <span className="text-[10px] text-red-500 font-medium">{errors.author.message}</span>
              )}
            </div>
          </div>

          {/* Row 2: ISBN & Publisher */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">
                ISBN Number <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Enter ISBN number (e.g. 9780132350884)"
                {...register('isbn', { required: 'ISBN is required' })}
                className={`w-full p-2.5 rounded-xl border ${
                  errors.isbn ? 'border-red-400' : 'border-slate-200 focus:border-[#0bad96]'
                } focus:outline-none focus:ring-2 focus:ring-emerald-50 text-slate-800`}
              />
              {errors.isbn && (
                <span className="text-[10px] text-red-500 font-medium">{errors.isbn.message}</span>
              )}
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Publisher <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Enter publisher name"
                {...register('publisher', { required: 'Publisher is required' })}
                className={`w-full p-2.5 rounded-xl border ${
                  errors.publisher ? 'border-red-400' : 'border-slate-200 focus:border-[#0bad96]'
                } focus:outline-none focus:ring-2 focus:ring-emerald-50 text-slate-800`}
              />
              {errors.publisher && (
                <span className="text-[10px] text-red-500 font-medium">{errors.publisher.message}</span>
              )}
            </div>
          </div>

          {/* Row 3: Category & Published Year */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                {...register('category', { required: 'Category is required' })}
                className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-[#0bad96] focus:outline-none focus:ring-2 focus:ring-emerald-50 text-slate-800 bg-white"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Published Year <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                placeholder="Enter year (e.g. 2024)"
                {...register('year', {
                  required: 'Published year is required',
                  min: { value: 1800, message: 'Invalid year' },
                  max: { value: 2099, message: 'Invalid year' },
                })}
                className={`w-full p-2.5 rounded-xl border ${
                  errors.year ? 'border-red-400' : 'border-slate-200 focus:border-[#0bad96]'
                } focus:outline-none focus:ring-2 focus:ring-emerald-50 text-slate-800`}
              />
              {errors.year && (
                <span className="text-[10px] text-red-500 font-medium">{errors.year.message}</span>
              )}
            </div>
          </div>

          {/* Row 4: Total Copies & Available Copies */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Total Copies <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                placeholder="Enter total copies"
                {...register('totalCopies', {
                  required: 'Total copies is required',
                  min: { value: 1, message: 'At least 1 copy required' },
                })}
                className={`w-full p-2.5 rounded-xl border ${
                  errors.totalCopies ? 'border-red-400' : 'border-slate-200 focus:border-[#0bad96]'
                } focus:outline-none focus:ring-2 focus:ring-emerald-50 text-slate-800`}
              />
              {errors.totalCopies && (
                <span className="text-[10px] text-red-500 font-medium">{errors.totalCopies.message}</span>
              )}
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Available Copies <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                placeholder="Enter available copies"
                {...register('availableCopies', {
                  required: 'Available copies is required',
                  min: { value: 0, message: 'Cannot be negative' },
                })}
                className={`w-full p-2.5 rounded-xl border ${
                  errors.availableCopies ? 'border-red-400' : 'border-slate-200 focus:border-[#0bad96]'
                } focus:outline-none focus:ring-2 focus:ring-emerald-50 text-slate-800`}
              />
              {errors.availableCopies && (
                <span className="text-[10px] text-red-500 font-medium">{errors.availableCopies.message}</span>
              )}
            </div>
          </div>

          {/* Row 5: Book Description */}
          <div>
            <label className="font-bold text-slate-700 block mb-1">Book Description</label>
            <textarea
              rows="3"
              placeholder="Enter book description..."
              {...register('description')}
              className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-[#0bad96] focus:outline-none focus:ring-2 focus:ring-emerald-50 text-slate-800 resize-none"
            />
          </div>

          {/* Row 6: Optional Cover Image URL */}
          <div>
            <label className="font-bold text-slate-700 block mb-1">Cover Image URL (Optional)</label>
            <input
              type="url"
              placeholder="https://example.com/cover.jpg"
              {...register('coverUrl')}
              className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-[#0bad96] focus:outline-none focus:ring-2 focus:ring-emerald-50 text-slate-800"
            />
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
                  <span>Update Book</span>
                </>
              ) : (
                <>
                  <PlusCircle className="w-4 h-4 stroke-[2.5]" />
                  <span>Add Book</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
