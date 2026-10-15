import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider } from './context/AuthContext';
import { BookProvider } from './context/BookContext';
import { MemberProvider } from './context/MemberContext';
import ProtectedRoute from './components/layout/ProtectedRoute';
import Layout from './components/layout/Layout';

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import DashboardPage from './pages/DashboardPage';
import BooksPage from './pages/BooksPage';
import MembersPage from './pages/MembersPage';
import IssueReturnPage from './pages/IssueReturnPage';
import FinesPage from './pages/FinesPage';
import CategoriesPage from './pages/CategoriesPage';

export default function App() {
  return (
    <AuthProvider>
      <BookProvider>
        <MemberProvider>
          <Router>
            <Routes>
              {/* Public Authentication Routes */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />

              {/* Protected Library Portal */}
              <Route
                element={
                  <ProtectedRoute>
                    <Layout />
                  </ProtectedRoute>
                }
              >
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/books" element={<BooksPage />} />
                <Route path="/members" element={<MembersPage />} />
                <Route path="/issue-return" element={<IssueReturnPage />} />
                <Route path="/fines" element={<FinesPage />} />
                <Route path="/categories" element={<CategoriesPage />} />
                <Route path="/reports" element={<DashboardPage />} />
                <Route path="/settings" element={<DashboardPage />} />
              </Route>

          {/* Root and Fallback Route */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>

        {/* Global Toast Notifications */}
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
          </Router>
        </MemberProvider>
      </BookProvider>
    </AuthProvider>
  );
}
