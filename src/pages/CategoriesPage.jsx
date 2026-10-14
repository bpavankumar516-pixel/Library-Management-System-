import React, { useState, useMemo } from 'react';
import {
  Search,
  Tag,
  BookOpen,
  Plus,
  Layers,
  Sparkles,
  ChevronRight,
  Filter,
  CheckCircle2,
  X,
  Library,
} from 'lucide-react';
import { toast } from 'react-toastify';
import { useBooks } from '../context/BookContext';

export default function CategoriesPage() {
  const { books, categories, addBook } = useBooks();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatDesc, setNewCatDesc] = useState('');

  // Category counts and metadata
  const categoryStats = useMemo(() => {
    const rawCategories = categories.filter((c) => c && c !== 'All');
    return rawCategories.map((cat) => {
      const catBooks = books.filter((b) => b.category === cat);
      const totalTitles = catBooks.length;
      const totalCopies = catBooks.reduce((sum, b) => sum + (Number(b.totalCopies) || 0), 0);
      const availableCopies = catBooks.reduce((sum, b) => sum + (Number(b.availableCopies) || 0), 0);

      let colorClass = 'bg-blue-50 text-blue-600 border-blue-100';
      if (cat === 'Self Help') colorClass = 'bg-emerald-50 text-emerald-600 border-emerald-100';
      if (cat === 'Programming') colorClass = 'bg-blue-50 text-blue-600 border-blue-100';
      if (cat === 'Technology') colorClass = 'bg-purple-50 text-purple-600 border-purple-100';
      if (cat === 'Fiction') colorClass = 'bg-pink-50 text-pink-600 border-pink-100';
      if (cat === 'Science Fiction') colorClass = 'bg-cyan-50 text-cyan-600 border-cyan-100';
      if (cat === 'Finance') colorClass = 'bg-amber-50 text-amber-600 border-amber-100';

      return {
        name: cat,
        totalTitles,
        totalCopies,
        availableCopies,
        colorClass,
      };
    });
  }, [books, categories]);

  // Filtered books based on selected category & search query
  const filteredBooks = useMemo(() => {
    return books.filter((b) => {
      if (selectedCategory !== 'All' && b.category !== selectedCategory) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        return (
          b.title?.toLowerCase().includes(q) ||
          b.author?.toLowerCase().includes(q) ||
          b.isbn?.toLowerCase().includes(q) ||
          b.category?.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [books, selectedCategory, searchQuery]);

  const handleCreateCategory = (e) => {
    e.preventDefault();
    if (!newCatName.trim()) {
      toast.warning('Please enter a category name.');
      return;
    }
    toast.success(`Category "${newCatName.trim()}" created successfully!`, { icon: '🏷️' });
    setNewCatName('');
    setNewCatDesc('');
    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-4 max-w-[1520px] mx-auto select-none">
      {/* 1. Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0 shadow-2xs">
            <Tag className="w-5 h-5 stroke-[2]" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Search & Categories
            </h1>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Explore library collections by genres, search books catalog, and organize categories.
            </p>
          </div>
        </div>

        {/* Add New Category Button */}
        <button
          type="button"
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-[#0bad96] hover:bg-[#099884] active:bg-[#077d6d] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer w-fit"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Add New Category</span>
        </button>
      </div>

      {/* 2. Top Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-2xs">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search books by title, author, category, or ISBN across all library collections..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200/90 text-xs text-slate-800 focus:outline-none focus:border-[#0bad96]"
          />
        </div>
      </div>

      {/* 3. Category Cards Grid */}
      <div>
        <div className="flex items-center justify-between mb-2.5">
          <h2 className="text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-2">
            <span>Browse By Category</span>
            <span className="text-[11px] font-semibold text-slate-400">({categoryStats.length} Genres)</span>
          </h2>

          {selectedCategory !== 'All' && (
            <button
              type="button"
              onClick={() => setSelectedCategory('All')}
              className="text-xs font-bold text-[#0bad96] hover:underline cursor-pointer"
            >
              Clear Category Filter
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {categoryStats.map((cat) => {
            const isSelected = selectedCategory === cat.name;
            return (
              <div
                key={cat.name}
                onClick={() => setSelectedCategory(isSelected ? 'All' : cat.name)}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between min-h-[105px] ${
                  isSelected
                    ? 'bg-emerald-50/70 border-[#0bad96] shadow-xs'
                    : 'bg-white border-slate-100 shadow-2xs hover:border-slate-200 hover:shadow-xs'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs border ${cat.colorClass}`}
                  >
                    <Tag className="w-3.5 h-3.5" />
                  </div>
                  {isSelected && <CheckCircle2 className="w-4 h-4 text-[#0bad96]" />}
                </div>

                <div className="mt-2">
                  <span className="font-black text-slate-900 text-xs block leading-tight truncate">
                    {cat.name}
                  </span>
                  <span className="text-[10px] text-slate-400 font-semibold block mt-0.5">
                    {cat.totalTitles} Titles • {cat.totalCopies} Copies
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Filtered Books Table */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-100 shadow-2xs">
        <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-50">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-[#0bad96]" />
            <h3 className="text-sm font-bold text-slate-900">
              {selectedCategory === 'All' ? 'All Catalog Books' : `Books in "${selectedCategory}"`}
            </h3>
          </div>
          <span className="text-xs text-slate-400 font-semibold">{filteredBooks.length} books found</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-2.5 px-3">#</th>
                <th className="py-2.5 px-3">Book Title</th>
                <th className="py-2.5 px-3">Author</th>
                <th className="py-2.5 px-3">Category</th>
                <th className="py-2.5 px-3">ISBN</th>
                <th className="py-2.5 px-3 text-center">Available / Total</th>
                <th className="py-2.5 px-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-xs">
              {filteredBooks.map((b, idx) => (
                <tr key={b.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-3 font-bold text-slate-400">{idx + 1}</td>

                  {/* Title & Cover */}
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2.5">
                      {b.coverUrl ? (
                        <img
                          src={b.coverUrl}
                          alt={b.title}
                          className="w-7 h-9 object-cover rounded shadow-2xs border border-slate-100 flex-shrink-0"
                          onError={(e) => {
                            e.target.src = 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=150&q=80';
                          }}
                        />
                      ) : (
                        <div className="w-7 h-9 bg-slate-100 rounded flex items-center justify-center text-slate-400 flex-shrink-0">
                          <BookOpen className="w-3.5 h-3.5" />
                        </div>
                      )}
                      <div>
                        <span className="font-bold text-slate-900 block leading-tight">{b.title}</span>
                        <span className="text-[10px] text-slate-400">{b.publisher || 'Publisher'}</span>
                      </div>
                    </div>
                  </td>

                  <td className="py-3 px-3 text-slate-600 font-medium">{b.author}</td>

                  <td className="py-3 px-3">
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                      {b.category}
                    </span>
                  </td>

                  <td className="py-3 px-3 font-mono text-[11px] text-slate-500">{b.isbn}</td>

                  <td className="py-3 px-3 text-center font-bold text-slate-800">
                    <span className="text-emerald-600">{b.availableCopies}</span> / {b.totalCopies}
                  </td>

                  <td className="py-3 px-3 text-center">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        b.availableCopies > 0
                          ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                          : 'bg-rose-50 text-rose-600 border border-rose-100'
                      }`}
                    >
                      {b.availableCopies > 0 ? 'Available' : 'Out of Stock'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Category Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl w-full max-w-md p-5 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-[#0bad96]" />
                <h3 className="text-base font-bold text-slate-900">Add New Category</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateCategory} className="mt-4 space-y-3.5">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Category Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Artificial Intelligence, Biography, History"
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#0bad96]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Description (Optional)</label>
                <textarea
                  rows="3"
                  placeholder="Brief note about the types of books in this category..."
                  value={newCatDesc}
                  onChange={(e) => setNewCatDesc(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#0bad96] resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#0bad96] hover:bg-[#099884] text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
                >
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
