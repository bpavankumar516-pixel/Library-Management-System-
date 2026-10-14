import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { toast } from 'react-toastify';
import { bookService } from '../services/bookService';

const BookContext = createContext(null);

export function BookProvider({ children }) {
  const [books, setBooks] = useState(() => {
    try {
      const cached = localStorage.getItem('librabook_books_v2');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((book) => {
            if (
              (book.id === 'book_10' || (book.title && book.title.toLowerCase().includes('sapiens'))) &&
              (!book.coverUrl || book.coverUrl.includes('goodreads.com') || book.coverUrl.includes('23692271'))
            ) {
              return {
                ...book,
                coverUrl: 'https://m.media-amazon.com/images/I/713jIoMO3UL._AC_UF1000,1000_QL80_.jpg',
              };
            }
            return book;
          });
        }
      }
    } catch {}
    return [];
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Filters & Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedAuthor, setSelectedAuthor] = useState('All');
  const [sortBy, setSortBy] = useState('title');
  const [viewMode, setViewMode] = useState('table');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Fetch books using bookService
  const fetchBooks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await bookService.getBooks();
      setBooks(data);
    } catch (err) {
      console.error('Error fetching books:', err);
      setError('Failed to fetch books');
      toast.error('Failed to load books. Please check network connection.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  // Add new book
  const addBook = async (bookData) => {
    try {
      const created = await bookService.createBook(bookData);
      setBooks((prev) => [created, ...prev]);
      toast.success(`Book "${created.title}" added to library!`, { icon: '📚' });
      return { success: true, book: created };
    } catch (err) {
      console.error('Error adding book:', err);
      toast.error('Failed to add book. Please check required fields.');
      return { success: false, error: err.message };
    }
  };

  // Update existing book
  const updateBook = async (id, updateData) => {
    try {
      const updated = await bookService.updateBook(id, updateData);
      setBooks((prev) => prev.map((b) => (b.id === id ? updated : b)));
      toast.success(`Book "${updated.title}" updated successfully!`);
      return { success: true, book: updated };
    } catch (err) {
      console.error('Error updating book:', err);
      toast.error('Failed to update book.');
      return { success: false, error: err.message };
    }
  };

  // Delete book
  const deleteBook = async (id) => {
    try {
      const target = books.find((b) => b.id === id);
      await bookService.deleteBook(id);
      setBooks((prev) => prev.filter((b) => b.id !== id));
      toast.success(`Book "${target?.title || 'Book'}" removed from library.`);
      return { success: true };
    } catch (err) {
      console.error('Error deleting book:', err);
      toast.error('Failed to delete book.');
      return { success: false, error: err.message };
    }
  };

  // Issue copy dynamically
  const issueBookCopy = async (id, { silent = false } = {}) => {
    try {
      const target = books.find((b) => b.id === id);
      if (!target || target.availableCopies <= 0) {
        toast.warning('No available copies left in library to issue!');
        return { success: false };
      }
      const updated = { ...target, availableCopies: target.availableCopies - 1 };
      const updatedList = books.map((b) => (b.id === id ? updated : b));
      setBooks(updatedList);
      localStorage.setItem('librabook_books_v2', JSON.stringify(updatedList));
      if (!silent) {
        toast.success(`1 copy of "${target.title}" issued! Available: ${updated.availableCopies}`, { icon: '📖' });
      }
      return { success: true, book: updated };
    } catch {
      toast.error('Failed to issue copy');
      return { success: false };
    }
  };

  // Return copy dynamically
  const returnBookCopy = async (id, { silent = false } = {}) => {
    try {
      const target = books.find((b) => b.id === id);
      if (!target) return { success: false };
      if (target.availableCopies >= target.totalCopies) {
        toast.info('All copies of this book are already in the library inventory!');
        return { success: false };
      }
      const updated = { ...target, availableCopies: target.availableCopies + 1 };
      const updatedList = books.map((b) => (b.id === id ? updated : b));
      setBooks(updatedList);
      localStorage.setItem('librabook_books_v2', JSON.stringify(updatedList));
      if (!silent) {
        toast.success(`1 copy of "${target.title}" returned! Available: ${updated.availableCopies}`, { icon: '🔄' });
      }
      return { success: true, book: updated };
    } catch {
      toast.error('Failed to return copy');
      return { success: false };
    }
  };

  // Get single book by ID
  const getBookById = useCallback(
    (id) => {
      return books.find((b) => String(b.id) === String(id)) || null;
    },
    [books]
  );

  // Unique categories
  const categories = useMemo(() => {
    const set = new Set(books.map((b) => b.category).filter(Boolean));
    return ['All', ...Array.from(set)];
  }, [books]);

  // Unique authors
  const authors = useMemo(() => {
    const set = new Set(books.map((b) => b.author).filter(Boolean));
    return ['All', ...Array.from(set)];
  }, [books]);

  // Filtered & Sorted books
  const filteredBooks = useMemo(() => {
    let result = [...books];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (b) =>
          b.title?.toLowerCase().includes(q) ||
          b.author?.toLowerCase().includes(q) ||
          b.isbn?.toLowerCase().includes(q) ||
          b.publisher?.toLowerCase().includes(q)
      );
    }

    if (selectedCategory !== 'All') {
      result = result.filter((b) => b.category === selectedCategory);
    }

    if (selectedAuthor !== 'All') {
      result = result.filter((b) => b.author === selectedAuthor);
    }

    result.sort((a, b) => {
      if (sortBy === 'title') {
        return a.title.localeCompare(b.title);
      }
      if (sortBy === 'year_desc') {
        return Number(b.year) - Number(a.year);
      }
      if (sortBy === 'year_asc') {
        return Number(a.year) - Number(b.year);
      }
      if (sortBy === 'available') {
        return Number(b.availableCopies) - Number(a.availableCopies);
      }
      return 0;
    });

    return result;
  }, [books, searchQuery, selectedCategory, selectedAuthor, sortBy]);

  // Pagination calculations
  const totalItems = filteredBooks.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const currentBooks = filteredBooks.slice(startIndex, endIndex);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, selectedAuthor, sortBy]);

  // Library Statistics
  const stats = useMemo(() => {
    const totalTitles = books.length;
    const totalCopies = books.reduce((acc, b) => acc + (Number(b.totalCopies) || 0), 0);
    const availableCopies = books.reduce((acc, b) => acc + (Number(b.availableCopies) || 0), 0);
    const issuedCopies = Math.max(0, totalCopies - availableCopies);
    const lowStockCount = books.filter((b) => b.availableCopies > 0 && b.availableCopies <= 2).length;
    const outOfStockCount = books.filter((b) => b.availableCopies === 0).length;

    return {
      totalTitles,
      totalCopies,
      availableCopies,
      issuedCopies,
      lowStockCount,
      outOfStockCount,
    };
  }, [books]);

  // Reset to default seed
  const resetBooks = () => {
    const resetList = bookService.resetBooks();
    setBooks(resetList);
    toast.info('Book catalog reset to default seed records.');
  };

  const value = {
    books,
    loading,
    error,
    stats,
    categories,
    authors,
    // Filters & Pagination
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
    itemsPerPage,
    filteredBooks,
    currentBooks,
    totalItems,
    totalPages,
    startIndex,
    endIndex,
    // ACTIONS
    fetchBooks,
    addBook,
    updateBook,
    deleteBook,
    getBookById,
    issueBookCopy,
    returnBookCopy,
    resetBooks,
  };

  return <BookContext.Provider value={value}>{children}</BookContext.Provider>;
}

export function useBooks() {
  const context = useContext(BookContext);
  if (!context) {
    throw new Error('useBooks must be used within a BookProvider');
  }
  return context;
}