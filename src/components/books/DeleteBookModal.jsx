import React from 'react';
import { Trash2, X } from 'lucide-react';

export default function DeleteBookModal({ isOpen, onClose, onConfirm, book }) {
  if (!isOpen || !book) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 animate-in fade-in duration-100">
      <div className="bg-white rounded-3xl p-6 sm:p-7 w-full max-w-sm shadow-2xl border border-slate-100 text-center relative animate-in zoom-in-95 duration-150">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Big Red Trash Icon */}
        <div className="w-16 h-16 rounded-full bg-red-500 text-white flex items-center justify-center mx-auto mb-4 shadow-lg shadow-red-500/25">
          <Trash2 className="w-8 h-8 stroke-[2]" />
        </div>

        {/* Modal Title */}
        <h3 className="text-lg font-black text-slate-900 tracking-tight">
          Delete Book
        </h3>

        {/* Modal Message */}
        <p className="text-xs text-slate-500 mt-2 leading-relaxed">
          Are you sure you want to delete <strong className="text-slate-800">'{book.title}'</strong>?
          <span className="block text-[11px] text-slate-400 mt-1">This action cannot be undone.</span>
        </p>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => onConfirm(book)}
            className="flex-1 py-2.5 px-4 rounded-xl bg-red-500 hover:bg-red-600 active:bg-red-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-red-500/20 transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete</span>
          </button>
        </div>
      </div>
    </div>
  );
}
