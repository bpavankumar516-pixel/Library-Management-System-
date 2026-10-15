// Category Service for managing book categories with persistence
const STORAGE_KEY = 'librabook_categories_v2';

export const DEFAULT_CATEGORIES = [
  {
    id: 'cat_1',
    name: 'Fiction',
    description: 'Novels, stories and literary works',
    color: '#f43f5e',
    bgClass: 'bg-rose-50 text-rose-600 border-rose-100',
    iconName: 'BookOpen',
    status: 'Active',
    seedCount: 12,
  },
  {
    id: 'cat_2',
    name: 'Non-Fiction',
    description: 'Real events, facts and knowledge',
    color: '#f97316',
    bgClass: 'bg-orange-50 text-orange-600 border-orange-100',
    iconName: 'FileText',
    status: 'Active',
    seedCount: 8,
  },
  {
    id: 'cat_3',
    name: 'Programming',
    description: 'Coding, software and development',
    color: '#3b82f6',
    bgClass: 'bg-blue-50 text-blue-600 border-blue-100',
    iconName: 'Code',
    status: 'Active',
    seedCount: 10,
  },
  {
    id: 'cat_4',
    name: 'Science',
    description: 'Science and research related books',
    color: '#06b6d4',
    bgClass: 'bg-cyan-50 text-cyan-600 border-cyan-100',
    iconName: 'Atom',
    status: 'Active',
    seedCount: 6,
  },
  {
    id: 'cat_5',
    name: 'History',
    description: 'Historical events and biographies',
    color: '#8b5cf6',
    bgClass: 'bg-purple-50 text-purple-600 border-purple-100',
    iconName: 'Landmark',
    status: 'Active',
    seedCount: 4,
  },
  {
    id: 'cat_6',
    name: 'Technology',
    description: 'Modern technology and innovations',
    color: '#6366f1',
    bgClass: 'bg-indigo-50 text-indigo-600 border-indigo-100',
    iconName: 'Cpu',
    status: 'Active',
    seedCount: 7,
  },
  {
    id: 'cat_7',
    name: 'Self Help',
    description: 'Personal growth and motivation',
    color: '#10b981',
    bgClass: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    iconName: 'Sparkles',
    status: 'Active',
    seedCount: 5,
  },
  {
    id: 'cat_8',
    name: 'Business',
    description: 'Business, finance and management',
    color: '#eab308',
    bgClass: 'bg-amber-50 text-amber-600 border-amber-100',
    iconName: 'Briefcase',
    status: 'Active',
    seedCount: 3,
  },
];

const PALETTE = [
  { color: '#ec4899', bgClass: 'bg-pink-50 text-pink-600 border-pink-100', iconName: 'Bookmark' },
  { color: '#14b8a6', bgClass: 'bg-teal-50 text-teal-600 border-teal-100', iconName: 'Layers' },
  { color: '#84cc16', bgClass: 'bg-lime-50 text-lime-600 border-lime-100', iconName: 'Book' },
  { color: '#64748b', bgClass: 'bg-slate-50 text-slate-600 border-slate-100', iconName: 'Tag' },
];

export const categoryService = {
  getCategories: () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Failed to parse categories from localStorage', e);
    }
    // Initialize with default categories
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_CATEGORIES));
    return DEFAULT_CATEGORIES;
  },

  addCategory: ({ name, description }) => {
    const categories = categoryService.getCategories();
    const trimmedName = name.trim();
    if (categories.some((c) => c.name.toLowerCase() === trimmedName.toLowerCase())) {
      throw new Error(`Category "${trimmedName}" already exists.`);
    }

    const paletteIdx = categories.length % PALETTE.length;
    const style = PALETTE[paletteIdx];

    const newCategory = {
      id: `cat_${Date.now()}`,
      name: trimmedName,
      description: (description || '').trim() || 'General category for books',
      color: style.color,
      bgClass: style.bgClass,
      iconName: style.iconName,
      status: 'Active',
      seedCount: 0,
      createdAt: new Date().toISOString(),
    };

    const updated = [...categories, newCategory];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return newCategory;
  },

  updateCategory: (id, { name, description }) => {
    const categories = categoryService.getCategories();
    const trimmedName = name.trim();
    const existing = categories.find((c) => c.id === id);
    if (!existing) {
      throw new Error('Category not found');
    }

    if (
      categories.some(
        (c) => c.id !== id && c.name.toLowerCase() === trimmedName.toLowerCase()
      )
    ) {
      throw new Error(`Category "${trimmedName}" already exists.`);
    }

    const updated = categories.map((cat) => {
      if (cat.id === id) {
        return {
          ...cat,
          name: trimmedName,
          description: (description || '').trim() || cat.description,
        };
      }
      return cat;
    });

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated.find((c) => c.id === id);
  },

  deleteCategory: (id) => {
    const categories = categoryService.getCategories();
    const updated = categories.filter((c) => c.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return true;
  },

  resetCategories: () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_CATEGORIES));
    return DEFAULT_CATEGORIES;
  },
};
