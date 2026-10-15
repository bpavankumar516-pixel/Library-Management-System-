import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  Search,
  Tag,
  BookOpen,
  Plus,
  Layers,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  X,
  Folder,
  Edit2,
  Trash2,
  Zap,
  SlidersHorizontal,
  ArrowUpDown,
  User,
  Code,
  Cpu,
  Briefcase,
  Landmark,
  FileText,
  Atom,
  ArrowRight,
  ArrowLeft,
  LayoutGrid,
  Check,
  AlertCircle,
  RotateCcw,
} from 'lucide-react';
import { toast } from 'react-toastify';
import { useBooks } from '../context/BookContext';
import { categoryService, DEFAULT_CATEGORIES } from '../services/categoryService';
import BookDetailsView from '../components/books/BookDetailsView';

export default function CategoriesPage() {
  const { books, updateBook, deleteBook: deleteBookContext } = useBooks();

  // Primary active view: 'search' (Search & Categories) or 'management' (Category Management)
  const [activeView, setActiveView] = useState('search');
  const [selectedBook, setSelectedBook] = useState(null);

  // Categories list with persistence
  const [categoriesList, setCategoriesList] = useState(() => categoryService.getCategories());

  // Ref to add category input for quick action focus
  const categoryNameInputRef = useRef(null);

  // Refresh categories from storage
  const refreshCategories = () => {
    setCategoriesList(categoryService.getCategories());
  };

  // -------------------------------------------------------------
  // Dynamic Book Count for each category
  // -------------------------------------------------------------
  const getCategoryBookCount = (cat) => {
    const matching = books.filter((b) => {
      if (!b.category) return false;
      const bCat = b.category.toLowerCase().trim();
      const cName = cat.name.toLowerCase().trim();
      if (bCat === cName) return true;
      if (cName === 'science' && bCat.includes('science')) return true;
      if (cName === 'business' && (bCat.includes('finance') || bCat.includes('business'))) return true;
      return false;
    });
    // Real count if books exist in library; fallback to screenshot seed count
    return matching.length > 0 ? matching.length : (cat.seedCount || 0);
  };

  // Helper for category badge color
  const getCategoryBadgeClass = (categoryName) => {
    const name = (categoryName || '').toLowerCase();
    if (name.includes('self')) return 'bg-emerald-50 text-emerald-600 border-emerald-100';
    if (name.includes('program') || name.includes('code')) return 'bg-blue-50 text-blue-600 border-blue-100';
    if (name.includes('tech')) return 'bg-purple-50 text-purple-600 border-purple-100';
    if (name.includes('fiction') && !name.includes('non')) return 'bg-rose-50 text-rose-600 border-rose-100';
    if (name.includes('non-fiction')) return 'bg-orange-50 text-orange-600 border-orange-100';
    if (name.includes('science')) return 'bg-cyan-50 text-cyan-600 border-cyan-100';
    if (name.includes('history')) return 'bg-purple-50 text-purple-600 border-purple-100';
    if (name.includes('business') || name.includes('finance')) return 'bg-amber-50 text-amber-600 border-amber-100';
    return 'bg-slate-50 text-slate-600 border-slate-100';
  };

  // Helper for category icon
  const renderCategoryIcon = (cat, size = 'w-3.5 h-3.5') => {
    const name = (cat.name || '').toLowerCase();
    if (name.includes('fiction') && !name.includes('non')) return <BookOpen className={size} />;
    if (name.includes('non-fiction')) return <FileText className={size} />;
    if (name.includes('program') || name.includes('code')) return <Code className={size} />;
    if (name.includes('science')) return <Atom className={size} />;
    if (name.includes('history')) return <Landmark className={size} />;
    if (name.includes('tech')) return <Cpu className={size} />;
    if (name.includes('self')) return <Sparkles className={size} />;
    if (name.includes('business') || name.includes('finance')) return <Briefcase className={size} />;
    return <Tag className={size} />;
  };

  // =============================================================
  // MODE 1: SEARCH & CATEGORIES STATE & LOGIC
  // =============================================================
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedAuthor, setSelectedAuthor] = useState('All');
  const [sortBy, setSortBy] = useState('title_asc');
  const [searchPage, setSearchPage] = useState(1);
  const searchItemsPerPage = 4; // Matches screenshot exact 4 cards per page

  // Unique authors from books catalog
  const uniqueAuthors = useMemo(() => {
    const set = new Set(books.map((b) => b.author).filter(Boolean));
    return ['All Authors', ...Array.from(set)];
  }, [books]);

  // Filtered & sorted books for Search page
  const filteredSearchBooks = useMemo(() => {
    let result = [...books];

    // 1. Text Search across title, author, isbn, publisher, description, category
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (b) =>
          b.title?.toLowerCase().includes(q) ||
          b.author?.toLowerCase().includes(q) ||
          b.isbn?.toLowerCase().includes(q) ||
          b.publisher?.toLowerCase().includes(q) ||
          b.category?.toLowerCase().includes(q) ||
          b.description?.toLowerCase().includes(q)
      );
    }

    // 2. Category Filter
    if (selectedCategory !== 'All') {
      const sel = selectedCategory.toLowerCase();
      result = result.filter((b) => {
        if (!b.category) return false;
        const bCat = b.category.toLowerCase();
        if (bCat === sel) return true;
        if (sel === 'science' && bCat.includes('science')) return true;
        if (sel === 'business' && (bCat.includes('finance') || bCat.includes('business'))) return true;
        return false;
      });
    }

    // 3. Author Filter
    if (selectedAuthor !== 'All' && selectedAuthor !== 'All Authors') {
      result = result.filter((b) => b.author === selectedAuthor);
    }

    // 4. Sorting
    result.sort((a, b) => {
      if (sortBy === 'title_asc') return (a.title || '').localeCompare(b.title || '');
      if (sortBy === 'title_desc') return (b.title || '').localeCompare(a.title || '');
      if (sortBy === 'year_desc') return Number(b.year || 0) - Number(a.year || 0);
      if (sortBy === 'year_asc') return Number(a.year || 0) - Number(b.year || 0);
      if (sortBy === 'available') return Number(b.availableCopies || 0) - Number(a.availableCopies || 0);
      return 0;
    });

    return result;
  }, [books, searchQuery, selectedCategory, selectedAuthor, sortBy]);

  // Reset pagination on filter change
  useEffect(() => {
    setSearchPage(1);
  }, [searchQuery, selectedCategory, selectedAuthor, sortBy]);

  // Search results pagination
  const totalSearchResults = filteredSearchBooks.length;
  const totalSearchPages = Math.ceil(totalSearchResults / searchItemsPerPage) || 1;
  const searchStartIndex = (searchPage - 1) * searchItemsPerPage;
  const currentSearchBooks = filteredSearchBooks.slice(
    searchStartIndex,
    searchStartIndex + searchItemsPerPage
  );

  // =============================================================
  // MODE 2: CATEGORY MANAGEMENT STATE & LOGIC
  // =============================================================
  const [catSearchQuery, setCatSearchQuery] = useState('');
  const [catSortBy, setCatSortBy] = useState('name_asc');
  const [catPage, setCatPage] = useState(1);
  const catItemsPerPage = 8;

  // Add / Edit Category Form State
  const [formCategory, setFormCategory] = useState({
    id: null,
    name: '',
    description: '',
  });
  const [isEditingCategory, setIsEditingCategory] = useState(false);

  // Handle Form Submit (Add or Update)
  const handleCategoryFormSubmit = (e) => {
    e.preventDefault();
    const name = formCategory.name.trim();
    if (!name) {
      toast.warning('Please enter a category name.');
      return;
    }

    try {
      if (isEditingCategory && formCategory.id) {
        const oldCat = categoriesList.find((c) => c.id === formCategory.id);
        const updated = categoryService.updateCategory(formCategory.id, {
          name,
          description: formCategory.description,
        });

        // Update books that had the old category name in memory
        if (oldCat && oldCat.name !== name) {
          books.forEach((b) => {
            if (b.category === oldCat.name) {
              updateBook(b.id, { ...b, category: name });
            }
          });
        }

        toast.success(`Category "${name}" updated successfully!`, { icon: '🏷️' });
      } else {
        categoryService.addCategory({
          name,
          description: formCategory.description,
        });
        toast.success(`Category "${name}" created successfully!`, { icon: '✨' });
      }

      refreshCategories();
      setFormCategory({ id: null, name: '', description: '' });
      setIsEditingCategory(false);
    } catch (err) {
      toast.error(err.message || 'Error saving category');
    }
  };

  const handleEditCategoryClick = (cat) => {
    setFormCategory({
      id: cat.id,
      name: cat.name,
      description: cat.description || '',
    });
    setIsEditingCategory(true);
    if (categoryNameInputRef.current) {
      categoryNameInputRef.current.focus();
    }
  };

  const handleCancelCategoryForm = () => {
    setFormCategory({ id: null, name: '', description: '' });
    setIsEditingCategory(false);
  };

  const handleDeleteCategoryClick = (cat) => {
    const count = getCategoryBookCount(cat);
    if (count > 0) {
      const confirmDelete = window.confirm(
        `Category "${cat.name}" has ${count} book(s) associated. Are you sure you want to delete it?`
      );
      if (!confirmDelete) return;
    }

    try {
      categoryService.deleteCategory(cat.id);
      refreshCategories();
      toast.success(`Category "${cat.name}" deleted.`);
      if (formCategory.id === cat.id) {
        handleCancelCategoryForm();
      }
    } catch {
      toast.error('Failed to delete category');
    }
  };

  // Filtered & Sorted Categories for Middle Table
  const filteredCategoriesList = useMemo(() => {
    let result = [...categoriesList];

    if (catSearchQuery.trim()) {
      const q = catSearchQuery.toLowerCase().trim();
      result = result.filter(
        (c) =>
          c.name?.toLowerCase().includes(q) ||
          c.description?.toLowerCase().includes(q)
      );
    }

    result.sort((a, b) => {
      if (catSortBy === 'name_asc') return (a.name || '').localeCompare(b.name || '');
      if (catSortBy === 'name_desc') return (b.name || '').localeCompare(a.name || '');
      if (catSortBy === 'count_desc') return getCategoryBookCount(b) - getCategoryBookCount(a);
      if (catSortBy === 'count_asc') return getCategoryBookCount(a) - getCategoryBookCount(b);
      return 0;
    });

    return result;
  }, [categoriesList, catSearchQuery, catSortBy, books]);

  const totalCatPages = Math.ceil(filteredCategoriesList.length / catItemsPerPage) || 1;
  const currentCategoriesPageItems = filteredCategoriesList.slice(
    (catPage - 1) * catItemsPerPage,
    catPage * catItemsPerPage
  );

  // -------------------------------------------------------------
  // DONUT CHART CALCULATIONS FOR CATEGORY STATISTICS
  // -------------------------------------------------------------
  const donutData = useMemo(() => {
    const totalCount = categoriesList.reduce((acc, cat) => acc + getCategoryBookCount(cat), 0) || 1;
    let accumulatedAngle = 0;
    const radius = 54;
    const circumference = 2 * Math.PI * radius; // ~339.29

    const segments = categoriesList.map((cat) => {
      const count = getCategoryBookCount(cat);
      const percentage = count / totalCount;
      const strokeLength = percentage * circumference;
      const strokeOffset = -accumulatedAngle;
      accumulatedAngle += strokeLength;

      return {
        ...cat,
        count,
        percentage: (percentage * 100).toFixed(1),
        strokeLength,
        strokeOffset,
        circumference,
      };
    });

    return {
      totalCount,
      radius,
      circumference,
      segments,
    };
  }, [categoriesList, books]);

  // Quick Action Switch to Management
  const handleSwitchToManagementAndAdd = () => {
    setActiveView('management');
    setSelectedBook(null);
    setIsEditingCategory(false);
    setFormCategory({ id: null, name: '', description: '' });
    setTimeout(() => {
      if (categoryNameInputRef.current) {
        categoryNameInputRef.current.focus();
      }
    }, 100);
  };

  // -------------------------------------------------------------
  // If a book details view is requested, render BookDetailsView
  // -------------------------------------------------------------
  if (selectedBook) {
    return (
      <div className="space-y-4 max-w-[1520px] mx-auto select-none">
        <button
          type="button"
          onClick={() => setSelectedBook(null)}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-[#0bad96]" />
          <span>Back to Search & Categories</span>
        </button>

        <BookDetailsView
          book={selectedBook}
          onBack={() => setSelectedBook(null)}
          onEdit={() => {}}
          onDelete={() => {
            deleteBookContext(selectedBook.id);
            setSelectedBook(null);
          }}
        />
      </div>
    );
  }

  return (
    <div className="space-y-4 max-w-[1520px] mx-auto select-none">
      {/* ========================================================
          TOP HEADER BANNER & VIEW SWITCHER
         ======================================================== */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-100 shadow-2xs relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left: Title & Subtitle */}
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-teal-50 text-[#0bad96] flex items-center justify-center flex-shrink-0 shadow-2xs">
            {activeView === 'search' ? (
              <Search className="w-6 h-6 stroke-[2.2]" />
            ) : (
              <LayoutGrid className="w-6 h-6 stroke-[2.2]" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-tight">
                {activeView === 'search' ? 'Search & Categories' : 'Category Management'}
              </h1>

              {/* View Switcher Pills */}
              <div className="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200/60 ml-1">
                <button
                  type="button"
                  onClick={() => {
                    setActiveView('search');
                    setSelectedBook(null);
                  }}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    activeView === 'search'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  <Search className="w-3.5 h-3.5 text-[#0bad96]" />
                  <span>Search</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveView('management');
                    setSelectedBook(null);
                  }}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    activeView === 'management'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  <LayoutGrid className="w-3.5 h-3.5 text-[#0bad96]" />
                  <span>Categories</span>
                </button>
              </div>
            </div>

            <p className="text-xs text-slate-500 font-medium mt-1">
              {activeView === 'search'
                ? 'Find books, authors, ISBNs or manage categories easily.'
                : 'Add, edit and manage book categories.'}
            </p>
          </div>
        </div>

        {/* Right: Custom Illustrated Artwork Banner matching screenshot */}
        <div className="flex items-center gap-2">
          {activeView === 'management' && (
            <button
              type="button"
              onClick={() => setActiveView('search')}
              className="px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs mr-2"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-[#0bad96]" />
              <span>Back to Search</span>
            </button>
          )}

          <div className="hidden sm:flex items-center gap-3 bg-gradient-to-r from-emerald-50/70 via-teal-50/40 to-emerald-50/60 border border-emerald-100/70 rounded-2xl px-4 py-2.5 shadow-2xs">
            <div className="w-9 h-9 rounded-xl bg-white shadow-2xs flex items-center justify-center text-[#0bad96] flex-shrink-0">
              {activeView === 'search' ? (
                <BookOpen className="w-4.5 h-4.5 stroke-[2.2]" />
              ) : (
                <Layers className="w-4.5 h-4.5 stroke-[2.2]" />
              )}
            </div>
            <div className="text-left">
              <div className="text-xs font-bold text-[#099884] tracking-tight italic font-serif">
                {activeView === 'search'
                  ? '"Search Smarter Read Better"'
                  : '"Organize Categories for Better Discovery"'}
              </div>
              <div className="text-[10px] text-slate-400 font-medium mt-0.5">
                {activeView === 'search'
                  ? 'Real-time library discovery'
                  : 'Intuitive taxonomy system'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================
          VIEW 1: SEARCH & CATEGORIES (TOP SCREEN IN IMAGE)
         ======================================================== */}
      {activeView === 'search' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5">
          {/* ----------------------------------------------------
              LEFT COLUMN (8 cols): Global Search & Search Results
             ---------------------------------------------------- */}
          <div className="lg:col-span-8 space-y-4">
            {/* 1. Global Search Box Card */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-100/90 shadow-2xs space-y-3.5">
              {/* Header */}
              <div>
                <div className="flex items-center gap-2">
                  <Search className="w-4 h-4 text-[#0bad96] stroke-[2.2]" />
                  <h2 className="text-sm font-bold text-slate-800">Global Search</h2>
                </div>
                <p className="text-xs text-slate-400 font-medium mt-0.5">
                  <span className="text-slate-600 font-semibold">Search</span> across books, authors, ISBN, and more...
                </p>
              </div>

              {/* Main Search Input & Teal Search Button */}
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Enter book title, author name, ISBN, or keyword..."
                    className="w-full pl-10 pr-9 py-2.5 rounded-xl border border-slate-200/90 text-xs text-slate-800 focus:outline-none focus:border-[#0bad96] focus:ring-2 focus:ring-emerald-50 transition-all placeholder:text-slate-400 font-medium"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer p-0.5"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => setSearchPage(1)}
                  className="px-5 py-2.5 rounded-xl bg-[#0bad96] hover:bg-[#099884] active:bg-[#077d6d] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer flex-shrink-0"
                >
                  <Search className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>Search</span>
                </button>
              </div>

              {/* Filter Row: 3 Dropdowns */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
                {/* 1. Category Filter Dropdown */}
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                    <BookOpen className="w-3.5 h-3.5" />
                  </div>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full pl-8.5 pr-8 py-2 rounded-xl border border-slate-200/90 text-xs font-semibold text-slate-700 bg-white focus:outline-none focus:border-[#0bad96] cursor-pointer appearance-none"
                  >
                    <option value="All">All Categories</option>
                    {categoriesList.map((cat) => (
                      <option key={cat.id} value={cat.name}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 rotate-90 pointer-events-none" />
                </div>

                {/* 2. Author Filter Dropdown */}
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                    <User className="w-3.5 h-3.5" />
                  </div>
                  <select
                    value={selectedAuthor}
                    onChange={(e) => setSelectedAuthor(e.target.value)}
                    className="w-full pl-8.5 pr-8 py-2 rounded-xl border border-slate-200/90 text-xs font-semibold text-slate-700 bg-white focus:outline-none focus:border-[#0bad96] cursor-pointer appearance-none truncate"
                  >
                    <option value="All">All Authors</option>
                    {uniqueAuthors
                      .filter((a) => a !== 'All Authors')
                      .map((author) => (
                        <option key={author} value={author}>
                          {author}
                        </option>
                      ))}
                  </select>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 rotate-90 pointer-events-none" />
                </div>

                {/* 3. Sort Dropdown */}
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                    <SlidersHorizontal className="w-3.5 h-3.5" />
                  </div>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full pl-8.5 pr-8 py-2 rounded-xl border border-slate-200/90 text-xs font-semibold text-slate-700 bg-white focus:outline-none focus:border-[#0bad96] cursor-pointer appearance-none"
                  >
                    <option value="title_asc">Sort by: Title (A-Z)</option>
                    <option value="title_desc">Sort by: Title (Z-A)</option>
                    <option value="year_desc">Sort by: Year (Newest)</option>
                    <option value="year_asc">Sort by: Year (Oldest)</option>
                    <option value="available">Sort by: Available Copies</option>
                  </select>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 rotate-90 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* 2. Search Results Card */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-100/90 shadow-2xs">
              {/* Results Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-50">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-xl bg-teal-50 text-[#0bad96] flex items-center justify-center">
                    <BookOpen className="w-3.5 h-3.5 stroke-[2.2]" />
                  </div>
                  <h2 className="text-xs sm:text-sm font-bold text-slate-800">
                    Search Results ({totalSearchResults} Books)
                  </h2>
                </div>

                {/* Active Filter Badges */}
                {(selectedCategory !== 'All' || selectedAuthor !== 'All' || searchQuery) && (
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCategory('All');
                      setSelectedAuthor('All');
                      setSearchQuery('');
                    }}
                    className="text-xs font-bold text-[#0bad96] hover:underline cursor-pointer flex items-center gap-1"
                  >
                    <span>Clear Filters</span>
                  </button>
                )}
              </div>

              {/* Book Cards Grid: 2 columns matching screenshot */}
              {currentSearchBooks.length === 0 ? (
                <div className="py-12 text-center">
                  <div className="w-12 h-12 rounded-2xl bg-slate-50 text-slate-400 flex items-center justify-center mx-auto mb-2">
                    <Search className="w-6 h-6 stroke-[1.5]" />
                  </div>
                  <div className="text-xs font-bold text-slate-700">No books found</div>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Try adjusting your keyword or filter options
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 mt-3.5">
                  {currentSearchBooks.map((book) => {
                    const isAvailable = Number(book.availableCopies || 0) > 0;
                    const badgeClass = getCategoryBadgeClass(book.category);

                    return (
                      <div
                        key={book.id}
                        onClick={() => setSelectedBook(book)}
                        className="p-3 sm:p-3.5 rounded-2xl border border-slate-100 hover:border-teal-200 hover:shadow-xs transition-all bg-white flex items-center justify-between gap-3 group relative cursor-pointer select-none"
                      >
                        {/* Left: Book Cover Image */}
                        <div className="w-16 h-22 rounded-xl overflow-hidden bg-slate-100 border border-slate-100 flex-shrink-0 relative shadow-2xs group-hover:scale-[1.03] transition-transform">
                          {book.coverUrl ? (
                            <img
                              src={book.coverUrl}
                              alt={book.title}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.src =
                                  'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=200&q=80';
                              }}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-300">
                              <BookOpen className="w-6 h-6 stroke-[1.5]" />
                            </div>
                          )}
                        </div>

                        {/* Middle: Book Details */}
                        <div className="flex-1 min-w-0 pr-1">
                          <h3 className="font-bold text-slate-900 text-xs sm:text-[13px] leading-snug line-clamp-1 group-hover:text-[#0bad96] transition-colors">
                            {book.title}
                          </h3>
                          <p className="text-[11px] text-slate-400 font-medium truncate mt-0.5">
                            {book.author}
                          </p>

                          {/* Category Badge */}
                          <div className="mt-1.5">
                            <span
                              className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-bold border ${badgeClass}`}
                            >
                              {book.category || 'General'}
                            </span>
                          </div>

                          {/* Metadata: ISBN & Year */}
                          <div className="text-[10px] text-slate-400 font-medium mt-1 truncate">
                            <span>ISBN: {book.isbn || 'N/A'}</span>
                            <span className="mx-1 font-bold">|</span>
                            <span>Year: {book.year || '2024'}</span>
                          </div>

                          {/* Status: Available or Out of Stock */}
                          <div className="flex items-center gap-1.5 mt-1 text-[10px] font-bold">
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                isAvailable ? 'bg-emerald-500' : 'bg-rose-500'
                              }`}
                            />
                            <span className={isAvailable ? 'text-emerald-600' : 'text-rose-500'}>
                              {isAvailable ? 'Available' : 'Out of Stock'}
                            </span>
                          </div>
                        </div>

                        {/* Right: Arrow Button */}
                        <div className="w-7 h-7 rounded-full bg-slate-50 text-slate-400 group-hover:bg-[#e6f7f3] group-hover:text-[#0bad96] flex items-center justify-center transition-colors flex-shrink-0">
                          <ArrowRight className="w-3.5 h-3.5 stroke-[2.2]" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Pagination Controls matching screenshot */}
              <div className="flex items-center justify-between pt-4 mt-3 border-t border-slate-50">
                <div className="text-xs text-slate-400 font-medium">
                  Showing {totalSearchResults === 0 ? 0 : searchStartIndex + 1} -{' '}
                  {Math.min(searchStartIndex + searchItemsPerPage, totalSearchResults)} of{' '}
                  {totalSearchResults} results
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    disabled={searchPage === 1}
                    onClick={() => setSearchPage((p) => Math.max(1, p - 1))}
                    className="w-7 h-7 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-30 disabled:pointer-events-none flex items-center justify-center transition-colors cursor-pointer text-xs"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>

                  {Array.from({ length: totalSearchPages }, (_, i) => i + 1).map((pg) => (
                    <button
                      key={pg}
                      type="button"
                      onClick={() => setSearchPage(pg)}
                      className={`w-7 h-7 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        searchPage === pg
                          ? 'bg-[#0bad96] text-white shadow-2xs'
                          : 'text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {pg}
                    </button>
                  ))}

                  <button
                    type="button"
                    disabled={searchPage === totalSearchPages}
                    onClick={() => setSearchPage((p) => Math.min(totalSearchPages, p + 1))}
                    className="w-7 h-7 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-30 disabled:pointer-events-none flex items-center justify-center transition-colors cursor-pointer text-xs"
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* ----------------------------------------------------
              RIGHT COLUMN (4 cols): Search by Category & Quick Actions
             ---------------------------------------------------- */}
          <div className="lg:col-span-4 space-y-4">
            {/* Card 1: Search by Category */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-100/90 shadow-2xs">
              {/* Header */}
              <div className="flex items-center justify-between mb-3 pb-1 border-b border-slate-50">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-teal-50 text-[#0bad96] flex items-center justify-center">
                    <BookOpen className="w-3.5 h-3.5 stroke-[2.2]" />
                  </div>
                  <h2 className="text-xs sm:text-sm font-bold text-slate-800">Search by Category</h2>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedCategory('All');
                    setSearchQuery('');
                  }}
                  className="text-xs font-bold text-[#0bad96] hover:underline cursor-pointer"
                >
                  View All
                </button>
              </div>

              {/* Category List Items */}
              <div className="space-y-1.5">
                {categoriesList.map((cat) => {
                  const isSelected = selectedCategory === cat.name;
                  const count = getCategoryBookCount(cat);

                  return (
                    <div
                      key={cat.id}
                      onClick={() => {
                        setSelectedCategory(isSelected ? 'All' : cat.name);
                        setSearchPage(1);
                      }}
                      className={`flex items-center justify-between p-2.5 rounded-xl cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-[#e6f7f3] text-[#0bad96] font-bold border-l-4 border-[#0bad96]'
                          : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 overflow-hidden">
                        <div
                          className={`w-6.5 h-6.5 rounded-lg flex items-center justify-center flex-shrink-0 ${cat.bgClass}`}
                        >
                          {renderCategoryIcon(cat, 'w-3 h-3')}
                        </div>
                        <span className="text-xs truncate">{cat.name}</span>
                      </div>

                      <span
                        className={`text-xs font-bold px-1.5 py-0.5 rounded-md ${
                          isSelected ? 'text-[#0bad96] font-black' : 'text-slate-400'
                        }`}
                      >
                        {count}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Card 2: Quick Category Actions */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-100/90 shadow-2xs space-y-3">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-[#0bad96] stroke-[2.2]" />
                <h2 className="text-xs sm:text-sm font-bold text-slate-800">
                  Quick Category Actions
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-2.5 pt-1">
                <button
                  type="button"
                  onClick={handleSwitchToManagementAndAdd}
                  className="w-full py-2.5 px-3 rounded-xl bg-[#0bad96] hover:bg-[#099884] active:bg-[#077d6d] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>Add Category</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveView('management');
                    setSelectedBook(null);
                  }}
                  className="w-full py-2.5 px-3 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <LayoutGrid className="w-3.5 h-3.5 text-slate-500" />
                  <span>Manage Categories</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          VIEW 2: CATEGORY MANAGEMENT (BOTTOM SCREEN IN IMAGE)
         ======================================================== */}
      {activeView === 'management' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5">
          {/* ----------------------------------------------------
              LEFT COLUMN (3.5 cols): Add / Edit New Category Form
             ---------------------------------------------------- */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-100/90 shadow-2xs space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-50">
                <div className="flex items-center gap-2">
                  <div className="w-6.5 h-6.5 rounded-lg bg-teal-50 text-[#0bad96] flex items-center justify-center">
                    {isEditingCategory ? (
                      <Edit2 className="w-3.5 h-3.5 stroke-[2.2]" />
                    ) : (
                      <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                    )}
                  </div>
                  <h2 className="text-xs sm:text-sm font-bold text-slate-800">
                    {isEditingCategory ? 'Edit Category' : 'Add New Category'}
                  </h2>
                </div>

                {isEditingCategory && (
                  <button
                    type="button"
                    onClick={handleCancelCategoryForm}
                    className="text-[10px] font-bold text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    Reset
                  </button>
                )}
              </div>

              <form onSubmit={handleCategoryFormSubmit} className="space-y-3.5">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">
                    Category Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    ref={categoryNameInputRef}
                    type="text"
                    required
                    placeholder="Enter category name"
                    value={formCategory.name}
                    onChange={(e) =>
                      setFormCategory((prev) => ({ ...prev, name: e.target.value }))
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-200/90 text-xs text-slate-800 focus:outline-none focus:border-[#0bad96] focus:ring-2 focus:ring-emerald-50 placeholder:text-slate-400 font-medium"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">
                    Description
                  </label>
                  <textarea
                    rows="4"
                    placeholder="Enter category description (optional)"
                    value={formCategory.description}
                    onChange={(e) =>
                      setFormCategory((prev) => ({ ...prev, description: e.target.value }))
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-200/90 text-xs text-slate-800 focus:outline-none focus:border-[#0bad96] focus:ring-2 focus:ring-emerald-50 placeholder:text-slate-400 font-medium resize-none"
                  />
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <button
                    type="button"
                    onClick={handleCancelCategoryForm}
                    className="flex-1 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-500 hover:bg-slate-50 cursor-pointer transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 rounded-xl bg-[#0bad96] hover:bg-[#099884] active:bg-[#077d6d] text-white text-xs font-bold shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    {isEditingCategory ? (
                      <>
                        <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                        <span>Update Category</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                        <span>Add Category</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* ----------------------------------------------------
              MIDDLE COLUMN (6 cols): Category List Table
             ---------------------------------------------------- */}
          <div className="lg:col-span-6">
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-100/90 shadow-2xs space-y-3.5">
              {/* Header Controls: Folder Title + Search Input + Sort Dropdown */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-2 border-b border-slate-50">
                <div className="flex items-center gap-2">
                  <div className="w-6.5 h-6.5 rounded-lg bg-teal-50 text-[#0bad96] flex items-center justify-center">
                    <Folder className="w-3.5 h-3.5 stroke-[2.2]" />
                  </div>
                  <h2 className="text-xs sm:text-sm font-bold text-slate-800">Category List</h2>
                </div>

                <div className="flex items-center gap-2">
                  {/* Category Search */}
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      placeholder="Search categories..."
                      value={catSearchQuery}
                      onChange={(e) => setCatSearchQuery(e.target.value)}
                      className="pl-7 pr-2.5 py-1.5 rounded-xl border border-slate-200/90 text-xs text-slate-700 focus:outline-none focus:border-[#0bad96] w-36 sm:w-44 placeholder:text-slate-400 font-medium"
                    />
                  </div>

                  {/* Sort Dropdown */}
                  <div className="relative">
                    <select
                      value={catSortBy}
                      onChange={(e) => setCatSortBy(e.target.value)}
                      className="pl-2.5 pr-6 py-1.5 rounded-xl border border-slate-200/90 text-xs font-semibold text-slate-700 bg-white focus:outline-none focus:border-[#0bad96] cursor-pointer appearance-none"
                    >
                      <option value="name_asc">Sort by: Name (A-Z)</option>
                      <option value="name_desc">Sort by: Name (Z-A)</option>
                      <option value="count_desc">Sort by: Count (High)</option>
                      <option value="count_asc">Sort by: Count (Low)</option>
                    </select>
                    <ChevronRight className="w-3 h-3 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 rotate-90 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      <th className="py-2 px-2.5 w-8">#</th>
                      <th className="py-2 px-2.5">Category Name</th>
                      <th className="py-2 px-2.5">Description</th>
                      <th className="py-2 px-2.5 text-center">Book Count</th>
                      <th className="py-2 px-2.5 text-center">Status</th>
                      <th className="py-2 px-2.5 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 text-xs font-medium">
                    {currentCategoriesPageItems.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="py-8 text-center text-slate-400 text-xs">
                          No categories match your search.
                        </td>
                      </tr>
                    ) : (
                      currentCategoriesPageItems.map((cat, idx) => {
                        const count = getCategoryBookCount(cat);
                        const rowNum = (catPage - 1) * catItemsPerPage + idx + 1;

                        return (
                          <tr
                            key={cat.id}
                            className="hover:bg-slate-50/70 transition-colors group"
                          >
                            <td className="py-2.5 px-2.5 font-bold text-slate-400 text-[11px]">
                              {rowNum}
                            </td>

                            {/* Category Name with Colored Icon */}
                            <td className="py-2.5 px-2.5">
                              <div className="flex items-center gap-2">
                                <div
                                  className={`w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0 ${cat.bgClass}`}
                                >
                                  {renderCategoryIcon(cat, 'w-3 h-3')}
                                </div>
                                <span className="font-bold text-slate-800 text-xs truncate max-w-[120px]">
                                  {cat.name}
                                </span>
                              </div>
                            </td>

                            {/* Description */}
                            <td className="py-2.5 px-2.5 text-slate-500 text-[11px] truncate max-w-[170px]">
                              {cat.description || 'General literature'}
                            </td>

                            {/* Book Count */}
                            <td className="py-2.5 px-2.5 text-center font-bold text-slate-800 text-xs">
                              {count}
                            </td>

                            {/* Status */}
                            <td className="py-2.5 px-2.5 text-center">
                              <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-100">
                                {cat.status || 'Active'}
                              </span>
                            </td>

                            {/* Actions: Edit & Delete */}
                            <td className="py-2.5 px-2.5 text-center">
                              <div className="flex items-center justify-center gap-1">
                                <button
                                  type="button"
                                  onClick={() => handleEditCategoryClick(cat)}
                                  className="p-1 rounded-lg text-slate-400 hover:text-teal-600 hover:bg-teal-50 transition-colors cursor-pointer"
                                  title="Edit Category"
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteCategoryClick(cat)}
                                  className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                                  title="Delete Category"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

              {/* Middle Table Footer */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-50 text-xs">
                <div className="text-[11px] text-slate-400 font-medium">
                  Showing 1 to {currentCategoriesPageItems.length} of{' '}
                  {filteredCategoriesList.length} categories
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    disabled={catPage === 1}
                    onClick={() => setCatPage((p) => Math.max(1, p - 1))}
                    className="w-6 h-6 rounded-md border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-30 disabled:pointer-events-none flex items-center justify-center cursor-pointer text-xs"
                  >
                    <ChevronLeft className="w-3 h-3" />
                  </button>
                  <span className="w-6 h-6 rounded-md bg-[#0bad96] text-white font-bold text-xs flex items-center justify-center">
                    {catPage}
                  </span>
                  <button
                    type="button"
                    disabled={catPage >= totalCatPages}
                    onClick={() => setCatPage((p) => Math.min(totalCatPages, p + 1))}
                    className="w-6 h-6 rounded-md border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-30 disabled:pointer-events-none flex items-center justify-center cursor-pointer text-xs"
                  >
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* ----------------------------------------------------
              RIGHT COLUMN (3 cols): Category Statistics with SVG Donut Chart
             ---------------------------------------------------- */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-100/90 shadow-2xs space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-50">
                <div className="w-6.5 h-6.5 rounded-lg bg-teal-50 text-[#0bad96] flex items-center justify-center">
                  <LayoutGrid className="w-3.5 h-3.5 stroke-[2.2]" />
                </div>
                <h2 className="text-xs sm:text-sm font-bold text-slate-800">
                  Category Statistics
                </h2>
              </div>

              {/* Donut Chart */}
              <div className="flex flex-col items-center justify-center pt-1">
                <div className="relative w-44 h-44 flex items-center justify-center">
                  <svg
                    viewBox="0 0 160 160"
                    className="w-full h-full -rotate-90 transform"
                  >
                    {/* Background Ring */}
                    <circle
                      cx="80"
                      cy="80"
                      r={donutData.radius}
                      stroke="#f1f5f9"
                      strokeWidth="14"
                      fill="transparent"
                    />

                    {/* Slices */}
                    {donutData.segments.map((seg) => (
                      <circle
                        key={seg.id}
                        cx="80"
                        cy="80"
                        r={donutData.radius}
                        stroke={seg.color}
                        strokeWidth="14"
                        fill="transparent"
                        strokeDasharray={`${seg.strokeLength} ${seg.circumference}`}
                        strokeDashoffset={seg.strokeOffset}
                        strokeLinecap="round"
                        className="transition-all duration-500 hover:opacity-85"
                      />
                    ))}
                  </svg>

                  {/* Center Text inside Donut */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center select-none pointer-events-none">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Total Categories
                    </span>
                    <span className="text-2xl font-black text-slate-900 tracking-tight leading-none mt-1">
                      {categoriesList.length}
                    </span>
                  </div>
                </div>
              </div>

              {/* Breakdown Legend matching screenshot */}
              <div className="space-y-2 pt-2 border-t border-slate-50">
                {categoriesList.map((cat) => {
                  const count = getCategoryBookCount(cat);

                  return (
                    <div
                      key={cat.id}
                      className="flex items-center justify-between text-xs font-semibold text-slate-600 hover:bg-slate-50/80 px-1.5 py-1 rounded-lg transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                          style={{ backgroundColor: cat.color }}
                        />
                        <span className="truncate text-slate-700">{cat.name}</span>
                      </div>
                      <span className="font-bold text-slate-900">{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
