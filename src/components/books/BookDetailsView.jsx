import React, { useState } from 'react';
import {
  ArrowLeft,
  User,
  BookOpen,
  Building,
  Tag,
  Calendar,
  Copy,
  Check,
  Edit,
  Trash2,
  Layers,
} from 'lucide-react';
import { toast } from 'react-toastify';

export default function BookDetailsView({ book, onBack, onEdit, onDelete }) {
  const [copied, setCopied] = useState(false);

  if (!book) return null;

  const handleCopyIsbn = () => {
    navigator.clipboard.writeText(book.isbn);
    setCopied(true);
    toast.info('ISBN copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const isAvailable = book.availableCopies > 2;
  const isLowStock = book.availableCopies > 0 && book.availableCopies <= 2;
  const isOutOfStock = book.availableCopies === 0;

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm max-w-4xl mx-auto animate-in fade-in zoom-in-95 duration-150">
      {/* Back button */}
      <div className="mb-6">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-[#0bad96] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
          <span>Back to Books</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 items-start">
        {/* Left Column: Book Cover Image */}
        <div className="md:col-span-4 flex justify-center">
          <div className="w-52 h-72 sm:w-56 sm:h-80 rounded-2xl overflow-hidden shadow-xl border border-slate-100 flex-shrink-0 bg-slate-50 relative group">
            <img
              src={book.coverUrl}
              alt={book.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              onError={(e) => {
                e.target.src = 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=400&q=80';
              }}
            />
          </div>
        </div>

        {/* Right Column: Metadata Details */}
        <div className="md:col-span-8 flex flex-col justify-between h-full space-y-4">
          <div>
            {/* Title & Status Badge */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                {book.title}
              </h1>
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold ${
                  isAvailable
                    ? 'bg-emerald-50 text-emerald-600 border border-emerald-200/60'
                    : isLowStock
                    ? 'bg-amber-50 text-amber-600 border border-amber-200/60'
                    : 'bg-red-50 text-red-600 border border-red-200/60'
                }`}
              >
                {isAvailable ? 'Available' : isLowStock ? 'Low Stock' : 'Out of Stock'}
              </span>
            </div>

            {/* Metadata Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 my-4 text-xs">
              <div className="flex items-center gap-2.5 text-slate-600">
                <User className="w-4 h-4 text-slate-400 stroke-[2]" />
                <span className="font-semibold text-slate-400">Author:</span>
                <span className="font-bold text-slate-800">{book.author}</span>
              </div>

              <div className="flex items-center gap-2 text-slate-600">
                <BookOpen className="w-4 h-4 text-slate-400 stroke-[2]" />
                <span className="font-semibold text-slate-400">ISBN:</span>
                <span className="font-bold text-[#0bad96] font-mono">{book.isbn}</span>
                <button
                  type="button"
                  onClick={handleCopyIsbn}
                  title="Copy ISBN"
                  className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-[#0bad96] transition-colors cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>

              <div className="flex items-center gap-2.5 text-slate-600">
                <Building className="w-4 h-4 text-slate-400 stroke-[2]" />
                <span className="font-semibold text-slate-400">Publisher:</span>
                <span className="font-bold text-slate-800">{book.publisher}</span>
              </div>

              <div className="flex items-center gap-2.5 text-slate-600">
                <Tag className="w-4 h-4 text-slate-400 stroke-[2]" />
                <span className="font-semibold text-slate-400">Category:</span>
                <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                  {book.category}
                </span>
              </div>

              <div className="flex items-center gap-2.5 text-slate-600">
                <Calendar className="w-4 h-4 text-slate-400 stroke-[2]" />
                <span className="font-semibold text-slate-400">Published Year:</span>
                <span className="font-bold text-slate-800">{book.year}</span>
              </div>
            </div>

            {/* Copies Badges matching screenshot Panel 1 */}
            <div className="flex flex-wrap items-center gap-3 my-4">
              <div className="flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-emerald-50/70 border border-emerald-100 flex-1 min-w-[140px]">
                <div className="w-8 h-8 rounded-xl bg-emerald-100/80 text-emerald-600 flex items-center justify-center">
                  <BookOpen className="w-4 h-4 stroke-[2]" />
                </div>
                <div>
                  <div className="text-lg font-black text-slate-900 leading-tight">{book.availableCopies}</div>
                  <div className="text-[11px] font-semibold text-slate-500">Available Copies</div>
                </div>
              </div>

              <div className="flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-teal-50/70 border border-teal-100 flex-1 min-w-[140px]">
                <div className="w-8 h-8 rounded-xl bg-teal-100/80 text-[#0bad96] flex items-center justify-center">
                  <Layers className="w-4 h-4 stroke-[2]" />
                </div>
                <div>
                  <div className="text-lg font-black text-slate-900 leading-tight">{book.totalCopies}</div>
                  <div className="text-[11px] font-semibold text-slate-500">Total Copies</div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="my-4">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                Description
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed bg-slate-50/60 p-4 rounded-2xl border border-slate-100">
                {book.description || 'No description available for this book.'}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => onEdit(book)}
              className="flex-1 py-2.5 px-4 rounded-xl bg-[#0bad96] hover:bg-[#099884] active:bg-[#077d6d] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer"
            >
              <Edit className="w-3.5 h-3.5" />
              <span>Edit Book</span>
            </button>

            <button
              type="button"
              onClick={() => onDelete(book)}
              className="py-2.5 px-4 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete Book</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
