import axios from 'axios';

const STORAGE_KEY = 'librabook_books_v2';

// Initial seed books matching screenshot exactly
const SEED_BOOKS = [
  {
    id: 'book_1',
    title: 'Atomic Habits',
    author: 'James Clear',
    isbn: '9781847941831',
    publisher: 'Random House',
    category: 'Self Help',
    year: 2018,
    availableCopies: 5,
    totalCopies: 10,
    coverUrl: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1655988385i/40121378.jpg',
    description: 'Atomic Habits is a practical guide to building good habits and breaking bad ones. James Clear shares simple, evidence-based strategies to help you make small changes that lead to remarkable results.',
  },
  {
    id: 'book_2',
    title: 'Clean Code',
    author: 'Robert C. Martin',
    isbn: '9780132350884',
    publisher: 'Prentice Hall',
    category: 'Programming',
    year: 2008,
    availableCopies: 2,
    totalCopies: 5,
    coverUrl: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1436202607i/3735293.jpg',
    description: 'Clean Code is a handbook of agile software craftsmanship. It introduces principles and practices for writing clean, maintainable, and reusable code.',
  },
  {
    id: 'book_3',
    title: 'Design Patterns',
    author: 'Erich Gamma',
    isbn: '9780201633610',
    publisher: 'Addison-Wesley',
    category: 'Technology',
    year: 1994,
    availableCopies: 4,
    totalCopies: 8,
    coverUrl: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1348027904i/85009.jpg',
    description: 'Design Patterns: Elements of Reusable Object-Oriented Software is a foundational software engineering book describing 23 classic design patterns.',
  },
  {
    id: 'book_4',
    title: 'The Alchemist',
    author: 'Paulo Coelho',
    isbn: '9780061122415',
    publisher: 'HarperOne',
    category: 'Fiction',
    year: 1988,
    availableCopies: 1,
    totalCopies: 5,
    coverUrl: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1654371463i/18144590.jpg',
    description: 'The Alchemist follows the journey of an Andalusian shepherd boy named Santiago who travels from Spain to Egypt in search of a treasure buried near the Pyramids.',
  },
  {
    id: 'book_5',
    title: 'Dune',
    author: 'Frank Herbert',
    isbn: '9780441172719',
    publisher: 'Ace Books',
    category: 'Science Fiction',
    year: 1965,
    availableCopies: 6,
    totalCopies: 10,
    coverUrl: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1555447414i/44767458.jpg',
    description: 'Set on the desert planet Arrakis, Dune tells the story of Paul Atreides as he navigates political betrayal, ecology, and human evolution.',
  },
  {
    id: 'book_6',
    title: 'Rich Dad Poor Dad',
    author: 'Robert T. Kiyosaki',
    isbn: '9781612680194',
    publisher: 'Plata Publishing',
    category: 'Finance',
    year: 1997,
    availableCopies: 3,
    totalCopies: 6,
    coverUrl: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1388211242i/69571.jpg',
    description: 'Rich Dad Poor Dad advocates the importance of financial literacy, financial independence, and building wealth through investing in assets and real estate.',
  },
  {
    id: 'book_7',
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    isbn: '9780060935467',
    publisher: 'Harper Perennial',
    category: 'Fiction',
    year: 1960,
    availableCopies: 7,
    totalCopies: 12,
    coverUrl: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1553383690i/2657.jpg',
    description: 'A powerful gripping story of coming of age and racial injustice in the Deep South.',
  },
  {
    id: 'book_8',
    title: 'The Pragmatic Programmer',
    author: 'David Thomas',
    isbn: '9780135957059',
    publisher: 'Addison-Wesley',
    category: 'Programming',
    year: 2019,
    availableCopies: 3,
    totalCopies: 7,
    coverUrl: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1401432508i/4099.jpg',
    description: 'Straight from the programming trenches, The Pragmatic Programmer cuts through the increasing specialization and technicalities of modern development.',
  },
  {
    id: 'book_9',
    title: 'Deep Work',
    author: 'Cal Newport',
    isbn: '9781455586691',
    publisher: 'Grand Central',
    category: 'Self Help',
    year: 2016,
    availableCopies: 4,
    totalCopies: 8,
    coverUrl: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1447957962i/25744928.jpg',
    description: 'Rules for focused success in a distracted world, teaching how to master complicated information and produce better results in less time.',
  },
  {
    id: 'book_10',
    title: 'Sapiens: A Brief History',
    author: 'Yuval Noah Harari',
    isbn: '9780062316097',
    publisher: 'Harper',
    category: 'Technology',
    year: 2014,
    availableCopies: 5,
    totalCopies: 9,
    coverUrl: 'https://m.media-amazon.com/images/I/713jIoMO3UL._AC_UF1000,1000_QL80_.jpg',
    description: 'From examining early human ancestors to the cognitive revolution, Harari surveys human history through anthropology and economics.',
  },
  {
    id: 'book_11',
    title: 'The Psychology of Money',
    author: 'Morgan Housel',
    isbn: '9780857197689',
    publisher: 'Harriman House',
    category: 'Finance',
    year: 2020,
    availableCopies: 8,
    totalCopies: 10,
    coverUrl: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1581527774i/41881472.jpg',
    description: 'Doing well with money isn’t necessarily about what you know. It’s about how you behave. Timeless lessons on wealth, greed, and happiness.',
  },
  {
    id: 'book_12',
    title: 'Foundation',
    author: 'Isaac Asimov',
    isbn: '9780553293357',
    publisher: 'Spectra',
    category: 'Science Fiction',
    year: 1951,
    availableCopies: 2,
    totalCopies: 6,
    coverUrl: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1417900846i/29579.jpg',
    description: 'The story of our world in and out of time, as psychohistorian Hari Seldon foresees the fall of the Galactic Empire.',
  },
];

// Initialize books in localStorage
function initializeStore() {
  const existing = localStorage.getItem(STORAGE_KEY);
  if (!existing) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_BOOKS));
    return SEED_BOOKS;
  }
  try {
    const parsed = JSON.parse(existing);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_BOOKS));
      return SEED_BOOKS;
    }
    // Auto-fix broken Sapiens cover URL if cached from earlier versions
    let hasUpdated = false;
    const sanitized = parsed.map((book) => {
      if (
        (book.id === 'book_10' || (book.title && book.title.toLowerCase().includes('sapiens'))) &&
        (!book.coverUrl || book.coverUrl.includes('goodreads.com') || book.coverUrl.includes('23692271'))
      ) {
        hasUpdated = true;
        return {
          ...book,
          coverUrl: 'https://m.media-amazon.com/images/I/713jIoMO3UL._AC_UF1000,1000_QL80_.jpg',
        };
      }
      return book;
    });

    if (hasUpdated) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sanitized));
      return sanitized;
    }
    return parsed;
  } catch (err) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_BOOKS));
    return SEED_BOOKS;
  }
}

export const bookService = {
  // Fetch all books (synchronizes with third-party API simulation)
  async getBooks() {
    // Simulate real network request
    await new Promise((r) => setTimeout(r, 200));

    // Optional third-party API check using axios
    try {
      // Test connectivity to external public API (JSONPlaceholder/ReqRes)
      await axios.get('https://jsonplaceholder.typicode.com/posts?_limit=1', { timeout: 2500 });
    } catch {
      // Fallback silently if offline
    }

    return initializeStore();
  },

  // Get single book
  async getBookById(id) {
    const books = initializeStore();
    const book = books.find((b) => String(b.id) === String(id));
    if (!book) throw new Error('Book not found');
    return book;
  },

  // Create new book
  async createBook(newBookData) {
    await new Promise((r) => setTimeout(r, 250));
    const books = initializeStore();

    const newBook = {
      ...newBookData,
      id: `book_${Date.now()}`,
      availableCopies: Number(newBookData.availableCopies),
      totalCopies: Number(newBookData.totalCopies),
      year: Number(newBookData.year),
      coverUrl: newBookData.coverUrl || 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=400&q=80',
    };

    const updated = [newBook, ...books];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return newBook;
  },

  // Update existing book
  async updateBook(id, updateData) {
    await new Promise((r) => setTimeout(r, 250));
    const books = initializeStore();
    const index = books.findIndex((b) => String(b.id) === String(id));

    if (index === -1) throw new Error('Book not found');

    const updatedBook = {
      ...books[index],
      ...updateData,
      availableCopies: Number(updateData.availableCopies),
      totalCopies: Number(updateData.totalCopies),
      year: Number(updateData.year),
    };

    books[index] = updatedBook;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
    return updatedBook;
  },

  // Delete book
  async deleteBook(id) {
    await new Promise((r) => setTimeout(r, 250));
    const books = initializeStore();
    const filtered = books.filter((b) => String(b.id) !== String(id));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return true;
  },

  // Reset to seed data
  resetBooks() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_BOOKS));
    return SEED_BOOKS;
  },
};
