import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

const STORAGE_KEYS = {
  CURRENT_USER: 'librabook_current_user',
  USERS: 'librabook_users',
  REMEMBERED_EMAIL: 'librabook_remembered_email',
};

// Initial default Admin seeded with user Pavan Kumar
const DEFAULT_ADMIN = {
  id: 'usr_admin_01',
  name: 'Pavan Kumar',
  email: 'pavan@librabook.com',
  password: 'admin123',
  role: 'admin',
  department: 'Head of Library Operations',
  membershipId: 'LIB-ADM-2026-001',
  joinedDate: '2026-01-10',
  avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=256&q=80',
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize from LocalStorage
  useEffect(() => {
    try {
      const storedUsers = localStorage.getItem(STORAGE_KEYS.USERS);
      if (!storedUsers) {
        localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify([DEFAULT_ADMIN]));
      } else {
        const parsed = JSON.parse(storedUsers);
        const hasAdmin = parsed.some((u) => u.email.toLowerCase() === DEFAULT_ADMIN.email.toLowerCase());
        if (!hasAdmin) {
          parsed.unshift(DEFAULT_ADMIN);
          localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(parsed));
        }
      }

      // Restore active session
      const activeUser = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
      if (activeUser) {
        setUser(JSON.parse(activeUser));
      }
    } catch (err) {
      console.error('Error loading auth from localStorage:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Login handler
  const login = async (email, password, rememberMe = false) => {
    const cleanEmail = email.trim().toLowerCase();
    const storedUsers = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');

    const foundUser = storedUsers.find(
      (u) =>
        (u.email.toLowerCase() === cleanEmail ||
          (cleanEmail === 'bpavankumar113011@gmail.com' && u.email.toLowerCase() === DEFAULT_ADMIN.email.toLowerCase())) &&
        u.password === password
    );

    if (!foundUser) {
      return {
        success: false,
        message: 'Invalid email address or password. Please verify your credentials.',
      };
    }

    const sessionUser = {
      ...foundUser,
      lastLoginAt: new Date().toISOString(),
    };

    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(sessionUser));
    setUser(sessionUser);

    if (rememberMe) {
      localStorage.setItem(STORAGE_KEYS.REMEMBERED_EMAIL, cleanEmail);
    } else {
      localStorage.removeItem(STORAGE_KEYS.REMEMBERED_EMAIL);
    }

    return { success: true, user: sessionUser };
  };

  // Google OAuth Simulation
  const loginWithGoogle = async () => {
    const googleUser = {
      id: 'usr_google_01',
      name: 'Pavan Kumar',
      email: 'bpavankumar113011@gmail.com',
      role: 'admin',
      department: 'Google Verified Admin',
      membershipId: 'LIB-GGL-2026-001',
      joinedDate: '2026-10-12',
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=256&q=80',
      lastLoginAt: new Date().toISOString(),
    };

    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(googleUser));
    setUser(googleUser);
    return { success: true, user: googleUser };
  };

  // Register handler
  const register = async (newUserData) => {
    const storedUsers = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
    const cleanEmail = newUserData.email.trim().toLowerCase();

    if (storedUsers.some((u) => u.email.toLowerCase() === cleanEmail)) {
      return {
        success: false,
        message: 'An account with this email address already exists.',
      };
    }

    const newUser = {
      id: `usr_${Date.now()}`,
      name: newUserData.name.trim(),
      email: cleanEmail,
      password: newUserData.password,
      role: newUserData.role || 'admin',
      department: newUserData.department || 'Library Member',
      membershipId: `LIB-${Math.floor(1000 + Math.random() * 9000)}`,
      joinedDate: new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString(),
    };

    storedUsers.push(newUser);
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(storedUsers));

    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(newUser));
    setUser(newUser);

    return { success: true, user: newUser };
  };

  // Forgot password handler
  const resetPassword = async (email, newPassword) => {
    const cleanEmail = email.trim().toLowerCase();
    const storedUsers = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
    const userIndex = storedUsers.findIndex((u) => u.email.toLowerCase() === cleanEmail);

    if (userIndex === -1) {
      return {
        success: false,
        message: 'No registered account found with that email address.',
      };
    }

    storedUsers[userIndex].password = newPassword;
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(storedUsers));

    if (user && user.email.toLowerCase() === cleanEmail) {
      const updated = { ...user, password: newPassword };
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(updated));
      setUser(updated);
    }

    return { success: true };
  };

  // Logout handler
  const logout = () => {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    setUser(null);
  };

  const getRememberedEmail = () => {
    return localStorage.getItem(STORAGE_KEYS.REMEMBERED_EMAIL) || '';
  };

  const value = {
    user,
    loading,
    isAuthenticated: Boolean(user),
    isAdmin: user?.role?.toLowerCase() === 'admin',
    login,
    loginWithGoogle,
    register,
    resetPassword,
    logout,
    getRememberedEmail,
    defaultAdmin: DEFAULT_ADMIN,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
