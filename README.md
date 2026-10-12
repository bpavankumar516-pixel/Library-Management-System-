# 📚 LibraBook — Library Management System

A modern, responsive, and robust **Library Management System** built with **React 19 (Vite 8)**, **Tailwind CSS v4**, and **Context API**.

---

## 🚀 Module 1: Authentication (Completed)

This module implements a complete static authentication module with enterprise SaaS UI patterns, pixel-perfect design alignment, and local storage session persistence:

- **Login UI:**
  - **Left Hero Panel:** Complete full background artwork featuring LibraBook branding, *"More Books, Bigger Dreams"*, 4 feature badges (Manage Books, Track Members, Get Reports, Secure & Reliable), curved library books photography, and dark teal quote banner.
  - **Right Interactive Card:** Elevated card featuring:
    - LibraBook logo & *"Welcome Back"*.
    - Real-time portal status badge.
    - **1-Click Auto Fill Demo Admin** button.
    - Email and Password inputs with icons & focus styling.
    - **Password Show / Hide** eye toggle.
    - **Remember me** checkbox (persisted in LocalStorage).
    - **Forgot Password?** navigation link.
    - Gradient Sign-In button with loading state & confetti celebration effect.
    - OR divider & Google Sign-In simulation.
    - Registration navigation link.
- **Demo Credentials:**
  - **Administrator Name:** Pavan Kumar
  - **Email:** `pavan@librabook.com` *(or `bpavankumar113011@gmail.com`)*
  - **Password:** `admin123`
- **Register Module (`/register`):**
  - Registration with Full Name, Email, Role selection (Administrator / Librarian), Password strength meter, Confirm Password validation, and Terms agreement.
  - Adds new accounts to LocalStorage user registry.
- **Forgot Password Module (`/forgot-password`):**
  - Multi-step flow: Email submission, verification simulation, and new password update.
- **Protected Routes & Session Persistence:**
  - `<ProtectedRoute />` guarding private portal routes (`/dashboard`).
  - Session state persisted across page reloads via **LocalStorage**.
- **Library Portal Dashboard (`/dashboard`):**
  - Responsive layout with Sidebar and top Navbar.
  - Displays authenticated admin profile (**Pavan Kumar**).
  - Key library metrics overview (Total Books, Members, Books Issued, Available, Overdue, Categories, Fines Collected).
  - Quick action cards and live activity feed.
  - Secure Logout action.

---

## 🛠️ Technology Stack

| Technology | Purpose |
|---|---|
| **React 19 (Vite 8)** | Fast modern frontend framework |
| **Tailwind CSS v4** | Utility-first responsive styling |
| **React Router v7** | Client-side routing with route guards |
| **Context API** | Centralized Authentication state management |
| **React Hook Form** | Performant form state & validation |
| **React Toastify** | User notifications & alerts |
| **Canvas Confetti** | Celebratory micro-interactions |
| **Lucide React** | Clean vector iconography |
| **LocalStorage** | Client-side persistence for session & accounts |

---

## 💻 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```

### 3. Open in Browser
Visit `http://localhost:5173` to explore the application.
Click the **"Auto Fill"** button on the Login page to instantly test with Pavan Kumar's demo credentials.
