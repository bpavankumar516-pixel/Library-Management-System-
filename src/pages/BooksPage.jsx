import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Plus,
  Search,
  Filter,
  ArrowUpDown,
  LayoutGrid,
  List,
  Eye,
  Edit,
  Trash2,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Sparkles,
  Layers,
  Repeat,
  AlertTriangle,
} from 'lucide-react';
import { useBooks } from '../context/BookContext';
import BookDetailsView from '../components/books/BookDetailsView';
import BookFormModal from '../components/books/BookFormModal';
import DeleteBookModal from '../components/books/DeleteBookModal';

export default function BooksPage() {
  const {
    books,
    loading,
    stats,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    selectedAuthor,
    setSelectedAuthor,
    sortBy,
    setSortBy,
    viewMode,
    setViewMode,
    currentPage,
    setCurrentPage,
    categories,
    authors,
    filteredBooks,
    currentBooks,
    totalItems,
    totalPages,
    startIndex,
    endIndex,
    addBook,
    updateBook,
    deleteBook,
  } = useBooks();

  // Modals & Active Views
  const [viewingBook, setViewingBook] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [deletingBook, setDeletingBook] = useState(null);

  // Derived live viewingBook when books list updates
  const currentViewingBook = viewingBook
    ? books.find((b) => b.id === viewingBook.id) || viewingBook
    : null;

  // Handlers for CRUD
  const handleAddBook = async (bookData) => {
    await addBook(bookData);
  };

  const handleUpdateBook = async (bookData) => {
    if (!editingBook) return;
    const res = await updateBook(editingBook.id, bookData);
    if (res.success) {
      if (viewingBook?.id === editingBook.id) {
        setViewingBook(res.book);
      }
      setEditingBook(null);
    }
  };

  const handleDeleteBook = async (book) => {
    const res = await deleteBook(book.id);
    if (res.success) {
      if (viewingBook?.id === book.id) {
        setViewingBook(null);
      }
      setDeletingBook(null);
    }
  };

  // Category Badge Colors matching screenshot
  const getCategoryBadgeClass = (category) => {
    switch (category) {
      case 'Self Help':
        return 'bg-emerald-50 text-emerald-600 border border-emerald-100';
      case 'Programming':
        return 'bg-blue-50 text-blue-600 border border-blue-100';
      case 'Technology':
        return 'bg-purple-50 text-purple-600 border border-purple-100';
      case 'Fiction':
        return 'bg-pink-50 text-pink-600 border border-pink-100';
      case 'Science Fiction':
        return 'bg-cyan-50 text-cyan-600 border border-cyan-100';
      case 'Finance':
        return 'bg-violet-50 text-violet-600 border border-violet-100';
      default:
        return 'bg-slate-50 text-slate-600 border border-slate-200';
    }
  };

  // If in Book Details View mode (Panel 1 from screenshot)
  if (currentViewingBook) {
    return (
      <div className="space-y-4 max-w-[1520px] mx-auto select-none">
        <BookDetailsView
          book={currentViewingBook}
          onBack={() => setViewingBook(null)}
          onEdit={(b) => setEditingBook(b)}
          onDelete={(b) => setDeletingBook(b)}
        />

        {/* Edit Modal */}
        <BookFormModal
          isOpen={Boolean(editingBook)}
          onClose={() => setEditingBook(null)}
          onSubmit={handleUpdateBook}
          initialBook={editingBook}
        />

        {/* Delete Modal */}
        <DeleteBookModal
          isOpen={Boolean(deletingBook)}
          onClose={() => setDeletingBook(null)}
          onConfirm={handleDeleteBook}
          book={deletingBook}
        />
      </div>
    );
  }

  return (
    <div className="space-y-4 max-w-[1520px] mx-auto select-none">
      {/* 1. Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-[#0bad96] flex items-center justify-center flex-shrink-0 shadow-2xs">
            <BookOpen className="w-5 h-5 stroke-[2]" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Books Management
            </h1>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Manage your library books, add new books, edit details and track availability.
            </p>
          </div>
        </div>

        {/* + Add New Book Button */}
        <button
          type="button"
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-[#0bad96] hover:bg-[#099884] active:bg-[#077d6d] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer w-fit"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Add New Book</span>
        </button>
      </div>

      {/* 2. Top 4 Dynamic Metric Stats Bar for Books */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-2xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#0bad96] flex items-center justify-center flex-shrink-0">
            <BookOpen className="w-5 h-5 stroke-[2]" />
          </div>
          <div className="leading-tight">
            <div className="text-xs text-slate-500 font-semibold">Total Titles</div>
            <div className="text-xl font-black text-slate-900 mt-0.5">{stats.totalTitles} books</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-2xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center flex-shrink-0">
            <Layers className="w-5 h-5 stroke-[2]" />
          </div>
          <div className="leading-tight">
            <div className="text-xs text-slate-500 font-semibold">Available Copies</div>
            <div className="text-xl font-black text-slate-900 mt-0.5">{stats.availableCopies} in stock</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-2xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
            <Repeat className="w-5 h-5 stroke-[2]" />
          </div>
          <div className="leading-tight">
            <div className="text-xs text-slate-500 font-semibold">Issued Copies</div>
            <div className="text-xl font-black text-slate-900 mt-0.5">{stats.issuedCopies} loaned</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-2xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="w-5 h-5 stroke-[2]" />
          </div>
          <div className="leading-tight">
            <div className="text-xs text-slate-500 font-semibold">Low Stock Titles</div>
            <div className="text-xl font-black text-slate-900 mt-0.5">{stats.lowStockCount} titles</div>
          </div>
        </div>
      </div>

      {/* 3. Filters & Controls Bar matching screenshot */}
      <div className="bg-white rounded-2xl p-3 sm:p-3.5 border border-slate-100 shadow-2xs flex flex-col lg:flex-row items-center justify-between gap-3">
        {/* Search input */}
        <div className="relative w-full lg:max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title, author, ISBN..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 hover:bg-slate-100/60 focus:bg-white border border-slate-200/70 rounded-xl focus:outline-none focus:border-[#0bad96] transition-all text-slate-800 placeholder-slate-400"
          />
        </div>

        {/* Filter Dropdowns & View Mode Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto justify-end">
          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 text-xs font-medium text-slate-700 bg-slate-50 hover:bg-slate-100/60 border border-slate-200/70 rounded-xl focus:outline-none focus:border-[#0bad96] cursor-pointer"
          >
            <option value="All">All Categories</option>
            {categories
              .filter((c) => c !== 'All')
              .map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
          </select>

          {/* Author Filter */}
          <select
            value={selectedAuthor}
            onChange={(e) => setSelectedAuthor(e.target.value)}
            className="px-3 py-2 text-xs font-medium text-slate-700 bg-slate-50 hover:bg-slate-100/60 border border-slate-200/70 rounded-xl focus:outline-none focus:border-[#0bad96] cursor-pointer"
          >
            <option value="All">All Authors</option>
            {authors
              .filter((a) => a !== 'All')
              .map((auth) => (
                <option key={auth} value={auth}>
                  {auth}
                </option>
              ))}
          </select>

          {/* Sort Dropdown */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 text-xs font-medium text-slate-700 bg-slate-50 hover:bg-slate-100/60 border border-slate-200/70 rounded-xl focus:outline-none focus:border-[#0bad96] cursor-pointer"
          >
            <option value="title">Sort by Title</option>
            <option value="year_desc">Sort by Year (Newest)</option>
            <option value="year_asc">Sort by Year (Oldest)</option>
            <option value="available">Sort by Available Copies</option>
          </select>

          {/* View Mode Toggle: Grid vs Table */}
          <div className="flex items-center gap-1 p-1 bg-slate-100/80 rounded-xl border border-slate-200/60">
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              title="Grid View"
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-[#0bad96] text-white shadow-2xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('table')}
              title="Table View"
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                viewMode === 'table'
                  ? 'bg-[#0bad96] text-white shadow-2xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <List className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 3. Books Content View (Table or Grid) */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-2xs overflow-hidden">
        {loading ? (
          /* Skeleton Loader */
          <div className="p-8 space-y-4 animate-pulse">
            <div className="h-6 bg-slate-100 rounded-lg w-1/3" />
            <div className="h-10 bg-slate-50 rounded-xl w-full" />
            <div className="h-10 bg-slate-50 rounded-xl w-full" />
            <div className="h-10 bg-slate-50 rounded-xl w-full" />
          </div>
        ) : filteredBooks.length === 0 ? (
          /* Empty State */
          <div className="p-12 text-center">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
              <BookOpen className="w-6 h-6 stroke-[1.5]" />
            </div>
            <h3 className="text-sm font-bold text-slate-800">No books found</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              No matching books found for "{searchQuery}". Try adjusting your filters or search keywords.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
                setSelectedAuthor('All');
              }}
              className="mt-4 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : viewMode === 'table' ? (
          /* Table View matching screenshot columns exactly */
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50 text-slate-500 font-semibold text-[11px]">
                  <th className="py-3 px-4">Cover</th>
                  <th className="py-3 px-4">Title</th>
                  <th className="py-3 px-4">Author</th>
                  <th className="py-3 px-4">ISBN</th>
                  <th className="py-3 px-4">Publisher</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Year</th>
                  <th className="py-3 px-4 text-center">Available</th>
                  <th className="py-3 px-4 text-center">Total</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {currentBooks.map((book) => {
                  const isAvailable = book.availableCopies > 2;
                  const isLowStock = book.availableCopies > 0 && book.availableCopies <= 2;

                  return (
                    <tr
                      key={book.id}
                      className="hover:bg-slate-50/80 transition-colors group"
                    >
                      {/* Cover Thumbnail */}
                      <td className="py-2.5 px-4">
                        <div className="w-9 h-12 rounded-lg overflow-hidden bg-slate-100 shadow-2xs border border-slate-200 flex-shrink-0 cursor-pointer" onClick={() => setViewingBook(book)}>
                          <img
                            src={book.coverUrl}
                            alt={book.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                            onError={(e) => {
                              e.target.src = 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=150&q=80';
                            }}
                          />
                        </div>
                      </td>

                      {/* Title */}
                      <td className="py-2.5 px-4 font-bold text-slate-900 cursor-pointer hover:text-[#0bad96] transition-colors" onClick={() => setViewingBook(book)}>
                        <div className="text-xs font-bold text-slate-900 leading-tight">{book.title}</div>
                        <div className="text-[11px] text-slate-400 font-normal mt-0.5">{book.author}</div>
                      </td>

                      {/* Author */}
                      <td className="py-2.5 px-4 text-slate-600 font-medium">
                        {book.author}
                      </td>

                      {/* ISBN */}
                      <td className="py-2.5 px-4 font-mono text-[11px] text-slate-500">
                        {book.isbn}
                      </td>

                      {/* Publisher */}
                      <td className="py-2.5 px-4 text-slate-600 font-medium">
                        {book.publisher}
                      </td>

                      {/* Category Badge */}
                      <td className="py-2.5 px-4">
                        <span
                          className={`px-2.5 py-1 rounded-md text-[11px] font-bold ${getCategoryBadgeClass(
                            book.category
                          )}`}
                        >
                          {book.category}
                        </span>
                      </td>

                      {/* Year */}
                      <td className="py-2.5 px-4 text-slate-500 font-mono">
                        {book.year}
                      </td>

                      {/* Available Copies */}
                      <td className="py-2.5 px-4 text-center font-bold text-slate-800">
                        {book.availableCopies}
                      </td>

                      {/* Total Copies */}
                      <td className="py-2.5 px-4 text-center text-slate-500">
                        {book.totalCopies}
                      </td>

                      {/* Status Badge */}
                      <td className="py-2.5 px-4">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            isAvailable
                              ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                              : isLowStock
                              ? 'bg-amber-50 text-amber-600 border border-amber-100'
                              : 'bg-red-50 text-red-600 border border-red-100'
                          }`}
                        >
                          {isAvailable ? 'Available' : isLowStock ? 'Low Stock' : 'Out of Stock'}
                        </span>
                      </td>

                      {/* Action Icons matching screenshot */}
                      <td className="py-2.5 px-4">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => setViewingBook(book)}
                            title="View Book Details"
                            className="p-1.5 hover:bg-emerald-50 rounded-lg text-[#0bad96] hover:text-[#099884] transition-colors cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          <button
                            type="button"
                            onClick={() => setEditingBook(book)}
                            title="Edit Book"
                            className="p-1.5 hover:bg-emerald-50 rounded-lg text-[#0bad96] hover:text-[#099884] transition-colors cursor-pointer"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>

                          <button
                            type="button"
                            onClick={() => setDeletingBook(book)}
                            title="Delete Book"
                            className="p-1.5 hover:bg-red-50 rounded-lg text-red-400 hover:text-red-600 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>

                          <button
                            type="button"
                            onClick={() => setViewingBook(book)}
                            title="More options"
                            className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                          >
                            <MoreVertical className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          /* Grid View */
          <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {currentBooks.map((book) => {
              const isAvailable = book.availableCopies > 2;
              const isLowStock = book.availableCopies > 0 && book.availableCopies <= 2;

              return (
                <div
                  key={book.id}
                  className="bg-white rounded-2xl border border-slate-100 p-3.5 shadow-2xs hover:shadow-md hover:border-emerald-200 transition-all group flex flex-col justify-between"
                >
                  <div>
                    <div className="relative h-44 rounded-xl overflow-hidden bg-slate-50 mb-3 border border-slate-100">
                      <img
                        src={book.coverUrl}
                        alt={book.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=400&q=80';
                        }}
                      />
                      <span
                        className={`absolute top-2 right-2 px-2 py-0.5 rounded-full text-[9px] font-bold shadow-xs ${
                          isAvailable
                            ? 'bg-emerald-50 text-emerald-700'
                            : isLowStock
                            ? 'bg-amber-50 text-amber-700'
                            : 'bg-red-50 text-red-700'
                        }`}
                      >
                        {isAvailable ? 'Available' : isLowStock ? 'Low Stock' : 'Out of Stock'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span
                        className={`px-2 py-0.5 rounded-md text-[9px] font-bold ${getCategoryBadgeClass(
                          book.category
                        )}`}
                      >
                        {book.category}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">{book.year}</span>
                    </div>

                    <h3
                      onClick={() => setViewingBook(book)}
                      className="text-xs font-bold text-slate-900 group-hover:text-[#0bad96] transition-colors truncate cursor-pointer"
                    >
                      {book.title}
                    </h3>
                    <p className="text-[11px] text-slate-500 truncate mt-0.5">
                      {book.author}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 mt-3 flex items-center justify-between text-xs">
                    <div className="text-[11px] text-slate-600 font-semibold">
                      <span>Copies: </span>
                      <strong className="text-emerald-600">{book.availableCopies}</strong>
                      <span className="text-slate-400">/{book.totalCopies}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setViewingBook(book)}
                        className="p-1 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-[#0bad96]"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingBook(book)}
                        className="p-1 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-[#0bad96]"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeletingBook(book)}
                        className="p-1 hover:bg-red-50 rounded-lg text-slate-400 hover:text-red-500"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* 4. Bottom Pagination Bar matching screenshot */}
        {!loading && filteredBooks.length > 0 && (
          <div className="p-3.5 px-4 bg-slate-50/50 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
            <div>
              Showing <strong className="text-slate-800">{startIndex + 1}</strong> to{' '}
              <strong className="text-slate-800">{endIndex}</strong> of{' '}
              <strong className="text-slate-800">{totalItems}</strong> books
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="w-7 h-7 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 flex items-center justify-center text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  type="button"
                  onClick={() => setCurrentPage(page)}
                  className={`w-7 h-7 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                    currentPage === page
                      ? 'bg-[#0bad96] text-white shadow-2xs'
                      : 'border border-slate-200 bg-white hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  {page}
                </button>
              ))}

              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="w-7 h-7 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 flex items-center justify-center text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add Book Modal (Panel 2 from screenshot) */}
      <BookFormModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddBook}
        initialBook={null}
      />

      {/* Edit Book Modal (Panel 3 from screenshot) */}
      <BookFormModal
        isOpen={Boolean(editingBook)}
        onClose={() => setEditingBook(null)}
        onSubmit={handleUpdateBook}
        initialBook={editingBook}
      />

      {/* Delete Book Modal (Panel 4 from screenshot) */}
      <DeleteBookModal
        isOpen={Boolean(deletingBook)}
        onClose={() => setDeletingBook(null)}
        onConfirm={handleDeleteBook}
        book={deletingBook}
      />
    </div>
  );
}
