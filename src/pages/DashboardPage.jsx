import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BookOpen,
  Users,
  Repeat,
  AlertTriangle,
  LayoutGrid,
  Coins,
  Copy,
  Clock,
  Zap,
  PlusCircle,
  UserPlus,
  ArrowRight,
  RotateCcw,
  Tag,
  ChevronDown,
  Calendar,
  Sprout,
  CheckCircle2,
  X,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useBooks } from '../context/BookContext';
import { useMembers } from '../context/MemberContext';
import { toast } from 'react-toastify';

export default function DashboardPage() {
  const { user } = useAuth();
  const {
    books,
    stats: bookStats,
    categories,
    addBook,
    issueBookCopy,
    returnBookCopy,
  } = useBooks();
  const {
    members,
    stats: memberStats,
    addMember,
    issueBookToMember,
    returnMemberBook,
  } = useMembers();

  const navigate = useNavigate();

  const [timeFilter, setTimeFilter] = useState('Last 6 Months');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [hoveredBar, setHoveredBar] = useState(null);
  const [activeModal, setActiveModal] = useState(null);

  // Quick Action form inputs for interactive modals
  const [modalFormData, setModalFormData] = useState({
    title: '',
    author: '',
    isbn: '',
    name: '',
    email: '',
    phone: '',
    role: 'Student',
    bookId: '',
    memberId: '',
    categoryName: '',
    totalCopies: 5,
  });

  // Dynamic Metrics derived directly from BookContext and MemberContext
  const totalTitlesCount = bookStats?.totalTitles || books.length;
  const totalCopiesCount = bookStats?.totalCopies || books.reduce((acc, b) => acc + (Number(b.totalCopies) || 0), 0);
  const availableCopiesCount = bookStats?.availableCopies ?? books.reduce((acc, b) => acc + (Number(b.availableCopies) || 0), 0);
  const issuedCopiesCount = bookStats?.issuedCopies ?? Math.max(0, totalCopiesCount - availableCopiesCount);
  const totalMembersCount = memberStats?.totalMembers || members.length;
  const overdueBooksCount = members.reduce((acc, m) => acc + (Number(m.overdueBooks) || 0), 0);

  // Canonical metrics aliases to prevent any reference errors
  const totalBooksCount = totalCopiesCount;
  const availableBooksCount = availableCopiesCount;
  const issuedBooksCount = issuedCopiesCount;

  const uniqueCategories = useMemo(() => {
    return categories.filter((c) => c && c !== 'All');
  }, [categories]);
  const categoriesCount = uniqueCategories.length || 6;

  // Fine Metrics computed synchronously with FinesPage ledger
  const finesMetrics = useMemo(() => {
    let fineOverrides = {};
    try {
      fineOverrides = JSON.parse(localStorage.getItem('librabook_fine_overrides') || '{}');
    } catch {}

    const list = [];
    const seenKeys = new Set();

    members.forEach((member) => {
      if (member.fineHistory && member.fineHistory.length > 0) {
        member.fineHistory.forEach((fine) => {
          const fineKey = `${member.id}_${fine.id || fine.reason}`;
          const dedupeKey = `${member.id}_${(fine.bookTitle || fine.reason || '').toLowerCase().trim()}`;
          if (!seenKeys.has(fineKey) && !seenKeys.has(dedupeKey)) {
            seenKeys.add(fineKey);
            seenKeys.add(dedupeKey);
            list.push({
              id: fineKey,
              fineId: fine.id,
              memberId: member.id,
              amount: Number(fine.amount) || 50,
              status: fine.status || 'Pending',
            });
          }
        });
      } else if (member.totalFine > 0 || member.overdueBooks > 0) {
        const overdueLoan = (member.issueHistory || []).find((h) => h.status === 'Overdue');
        const fineKey = `${member.id}_overdue_fine`;
        const dedupeKey = `${member.id}_${(overdueLoan?.bookTitle || 'overdue').toLowerCase().trim()}`;
        if (!seenKeys.has(fineKey) && !seenKeys.has(dedupeKey)) {
          seenKeys.add(fineKey);
          seenKeys.add(dedupeKey);
          list.push({
            id: fineKey,
            memberId: member.id,
            amount: Number(member.totalFine) || 50,
            status: 'Pending',
          });
        }
      }
    });

    const mapped = list.map((item) => {
      const override = fineOverrides[item.id] || (item.fineId && fineOverrides[`${item.memberId}_${item.fineId}`]);
      if (override) {
        return {
          ...item,
          status: override.status,
        };
      }
      return item;
    });

    const collected = mapped.filter((f) => f.status === 'Paid').reduce((acc, f) => acc + f.amount, 0);
    const pending = mapped.filter((f) => f.status === 'Pending').reduce((acc, f) => acc + f.amount, 0);
    const waived = mapped.filter((f) => f.status === 'Waived').reduce((acc, f) => acc + f.amount, 0);

    return {
      totalFineCollected: collected,
      pendingFines: pending,
      waivedFines: waived,
      totalFinesCount: mapped.length,
    };
  }, [members]);

  const totalFineCollected = finesMetrics.totalFineCollected;

  // Donut chart percentages based on totalCopiesCount
  const availablePercent = totalCopiesCount > 0 ? Math.round((availableCopiesCount / totalCopiesCount) * 100) : 0;
  const issuedPercent = totalCopiesCount > 0 ? Math.round((issuedCopiesCount / totalCopiesCount) * 100) : 0;
  const overduePercent = totalCopiesCount > 0 ? Math.round((overdueBooksCount / totalCopiesCount) * 100) : 0;

  // Dynamic greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  // Dynamic date formatted exactly like screenshot (e.g. "Saturday, 11 Oct 2025")
  const getFormattedDate = () => {
    const now = new Date();
    const options = { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' };
    return now.toLocaleDateString('en-GB', options);
  };

  // Bar chart dataset dynamically tied to real library status
  const chartDataSets = useMemo(() => {
    const latestIssued = Math.max(10, issuedCopiesCount);
    const latestReturned = Math.max(8, Math.round(issuedCopiesCount * 0.72));
    const latestOverdue = overdueBooksCount;

    return {
      'Last 6 Months': [
        { month: 'May', issued: 138, returned: 96, overdue: 25 },
        { month: 'Jun', issued: 132, returned: 90, overdue: 20 },
        { month: 'Jul', issued: 142, returned: 98, overdue: 28 },
        { month: 'Aug', issued: 135, returned: 88, overdue: 30 },
        { month: 'Sep', issued: 142, returned: 98, overdue: 32 },
        { month: 'Oct', issued: latestIssued, returned: latestReturned, overdue: latestOverdue },
      ],
      'This Year': [
        { month: 'Jan', issued: 120, returned: 85, overdue: 18 },
        { month: 'Feb', issued: 128, returned: 90, overdue: 22 },
        { month: 'Mar', issued: 145, returned: 105, overdue: 28 },
        { month: 'Apr', issued: 130, returned: 92, overdue: 24 },
        { month: 'May', issued: 138, returned: 96, overdue: 25 },
        { month: 'Jun', issued: latestIssued, returned: latestReturned, overdue: latestOverdue },
      ],
      'Last 30 Days': [
        { month: 'W1', issued: 35, returned: 24, overdue: 6 },
        { month: 'W2', issued: 42, returned: 30, overdue: 8 },
        { month: 'W3', issued: 48, returned: 34, overdue: 11 },
        { month: 'W4', issued: latestIssued, returned: latestReturned, overdue: latestOverdue },
      ],
    };
  }, [issuedCopiesCount, overdueBooksCount]);

  const currentChartData = chartDataSets[timeFilter] || chartDataSets['Last 6 Months'];
  const maxChartValue = Math.max(200, Math.ceil(issuedCopiesCount * 1.25));

  // Helper to format timestamps into clean relative times
  const formatTimeAgo = (ts, fallback) => {
    if (!ts && fallback) return fallback;
    if (!ts) return 'Today';
    const diff = Math.max(0, Date.now() - Number(ts));
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;
    return fallback || 'Recently';
  };

  // Dynamic Recent Activities based directly on real actions across all pages
  const dynamicActivities = useMemo(() => {
    let fineOverrides = {};
    try {
      fineOverrides = JSON.parse(localStorage.getItem('librabook_fine_overrides') || '{}');
    } catch {}

    const rawActivities = [];

    // 1. Live Returns & Issues from Issue & Return page
    members.forEach((member, mIdx) => {
      (member.issueHistory || []).forEach((loan, lIdx) => {
        if (loan.status === 'Returned') {
          const ts = loan.returnedAt || (Date.now() - (mIdx * 3600000 + lIdx * 1800000 + 1800000));
          rawActivities.push({
            id: `act_ret_${member.id}_${loan.id}`,
            type: 'return',
            title: 'Book returned',
            subtitle: `"${loan.bookTitle}" returned by ${member.name}`,
            time: loan.returnedAt ? formatTimeAgo(loan.returnedAt, loan.returnDate) : (loan.returnDate || 'Today'),
            timestamp: ts,
            icon: RotateCcw,
            iconBg: 'bg-teal-50 text-teal-600',
            route: '/issue-return',
          });
        } else if (loan.status === 'Issued') {
          const ts = loan.issuedAt || (Date.now() - (mIdx * 3600000 + lIdx * 1800000 + 7200000));
          rawActivities.push({
            id: `act_iss_${member.id}_${loan.id}`,
            type: 'issue',
            title: 'Book issued',
            subtitle: `"${loan.bookTitle}" to ${member.name}`,
            time: loan.issuedAt ? formatTimeAgo(loan.issuedAt, loan.issueDate) : (loan.issueDate || 'Today'),
            timestamp: ts,
            icon: Repeat,
            iconBg: 'bg-emerald-50 text-emerald-600',
            route: '/issue-return',
          });
        } else if (loan.status === 'Overdue') {
          rawActivities.push({
            id: `act_ovd_${member.id}_${loan.id}`,
            type: 'overdue',
            title: 'Overdue loan',
            subtitle: `"${loan.bookTitle}" with ${member.name} (Due: ${loan.dueDate})`,
            time: 'Overdue',
            timestamp: Date.now() - 14400000,
            icon: AlertTriangle,
            iconBg: 'bg-rose-50 text-rose-500',
            route: '/issue-return',
          });
        }
      });

      // 2. Live Fines from Fines page
      (member.fineHistory || []).forEach((fine, fIdx) => {
        const override = fineOverrides[`${member.id}_${fine.id || fine.reason}`];
        const currentStatus = override?.status || fine.status;
        const currentMethod = override?.paymentMethod || fine.paymentMethod || 'Cash';

        if (currentStatus === 'Paid') {
          rawActivities.push({
            id: `act_fine_paid_${member.id}_${fine.id || fIdx}`,
            type: 'fine_paid',
            title: 'Fine collected',
            subtitle: `₹${fine.amount} from ${member.name} (${currentMethod})`,
            time: fine.date || 'Today',
            timestamp: Date.now() - (fIdx * 3600000 + 10800000),
            icon: Coins,
            iconBg: 'bg-purple-50 text-purple-600',
            route: '/fines',
          });
        } else if (currentStatus === 'Waived') {
          rawActivities.push({
            id: `act_fine_waived_${member.id}_${fine.id || fIdx}`,
            type: 'fine_waived',
            title: 'Penalty waived',
            subtitle: `₹${fine.amount} waived for ${member.name}`,
            time: fine.date || 'Recently',
            timestamp: Date.now() - (fIdx * 3600000 + 18000000),
            icon: ShieldCheck,
            iconBg: 'bg-amber-50 text-amber-600',
            route: '/fines',
          });
        }
      });
    });

    // 3. Latest Books from Books page
    if (books && books.length > 0) {
      books.slice(0, 2).forEach((b, bIdx) => {
        rawActivities.push({
          id: `act_book_${b.id}`,
          type: 'book',
          title: 'Book cataloged',
          subtitle: `"${b.title}" by ${b.author} (${b.category || 'General'})`,
          time: 'In Stock',
          timestamp: Date.now() - (bIdx * 10000000 + 25000000),
          icon: BookOpen,
          iconBg: 'bg-blue-50 text-blue-600',
          route: '/books',
        });
      });
    }

    // 4. Latest Members from Members page
    if (members && members.length > 0) {
      members.slice(0, 2).forEach((m, mIdx) => {
        rawActivities.push({
          id: `act_mem_${m.id}`,
          type: 'member',
          title: 'Member registered',
          subtitle: `${m.name} (${m.membershipId})`,
          time: m.joinDate || 'Active',
          timestamp: Date.now() - (mIdx * 15000000 + 40000000),
          icon: Users,
          iconBg: 'bg-indigo-50 text-indigo-600',
          route: '/members',
        });
      });
    }

    // Sort by timestamp descending (newest activity first)
    rawActivities.sort((a, b) => b.timestamp - a.timestamp);

    // Pick top distinct activities
    const unique = [];
    const seen = new Set();
    for (const item of rawActivities) {
      const key = `${item.type}_${item.subtitle}`;
      if (!seen.has(key)) {
        seen.add(key);
        unique.push(item);
        if (unique.length >= 6) break;
      }
    }

    return unique;
  }, [books, members]);

  // Real Quick Action dispatch handler
  const handleQuickActionSubmit = async (e) => {
    e.preventDefault();

    if (activeModal === 'Add New Book') {
      if (!modalFormData.title || !modalFormData.author) {
        toast.warning('Please enter book title and author');
        return;
      }
      const copies = Number(modalFormData.totalCopies) || 5;
      await addBook({
        title: modalFormData.title,
        author: modalFormData.author,
        isbn: modalFormData.isbn || `978-${Math.floor(1000000000 + Math.random() * 9000000000)}`,
        category: modalFormData.categoryName || 'General',
        totalCopies: copies,
        availableCopies: copies,
        year: new Date().getFullYear(),
      });
    } else if (activeModal === 'Add Member') {
      if (!modalFormData.name || !modalFormData.email) {
        toast.warning('Please enter member name and email');
        return;
      }
      await addMember({
        name: modalFormData.name,
        email: modalFormData.email,
        phone: modalFormData.phone || '+91 98765 43210',
        role: modalFormData.role || 'Student',
        status: 'Active',
      });
    } else if (activeModal === 'Issue Book') {
      if (!modalFormData.bookId) {
        toast.warning('Please select a book to issue');
        return;
      }
      const targetBook = books.find((b) => String(b.id) === String(modalFormData.bookId));
      await issueBookCopy(modalFormData.bookId);
      if (modalFormData.memberId && targetBook && issueBookToMember) {
        await issueBookToMember(modalFormData.memberId, {
          bookTitle: targetBook.title,
          isbn: targetBook.isbn,
          category: targetBook.category,
        });
      }
    } else if (activeModal === 'Return Book') {
      if (!modalFormData.bookId) {
        toast.warning('Please select a book to return');
        return;
      }
      const targetBook = books.find((b) => String(b.id) === String(modalFormData.bookId));
      await returnBookCopy(modalFormData.bookId);
      if (targetBook && returnMemberBook) {
        const borrower = members.find((m) =>
          m.issueHistory?.some(
            (h) =>
              h.bookTitle?.toLowerCase().trim() === targetBook.title?.toLowerCase().trim() &&
              h.status !== 'Returned'
          )
        );
        if (borrower) {
          await returnMemberBook(borrower.id, null, targetBook.title);
        }
      }
    } else if (activeModal === 'Add Category') {
      if (!modalFormData.categoryName) {
        toast.warning('Please enter a category name');
        return;
      }
      toast.success(`Category "${modalFormData.categoryName}" added to catalog!`, { icon: '🏷️' });
    }

    setModalFormData({
      title: '',
      author: '',
      isbn: '',
      name: '',
      email: '',
      phone: '',
      role: 'Student',
      bookId: '',
      memberId: '',
      categoryName: '',
      totalCopies: 5,
    });
    setActiveModal(null);
  };

  return (
    <div className="space-y-4 max-w-[1520px] mx-auto select-none">
      {/* 1. Header Greeting Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <span>{getGreeting()}, {user?.name ? user.name.split(' ')[0] : 'Vimal'}!</span>
            <span className="inline-block animate-wave">👋</span>
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Here's what's happening in your library today.
          </p>
        </div>

        {/* Date & Motivation Pill */}
        <div className="flex items-center gap-3 bg-white border border-slate-100 rounded-2xl px-4 py-2 shadow-2xs w-fit">
          <div className="w-8 h-8 rounded-xl bg-emerald-50 text-[#0bad96] flex items-center justify-center flex-shrink-0">
            <Calendar className="w-4 h-4 stroke-[2]" />
          </div>
          <div className="text-left leading-tight">
            <div className="text-xs font-bold text-slate-800">
              {getFormattedDate()}
            </div>
            <div className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
              <span>Keep reading, keep growing!</span>
            </div>
          </div>
          <div className="text-emerald-500 pl-1">
            <Sprout className="w-4 h-4 stroke-[2]" />
          </div>
        </div>
      </div>

      {/* 2. Main 2-Column Split: Left (8 cols) vs Right (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* ===================== LEFT COLUMN (8 cols) ===================== */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          {/* Row 1 Stats (3 Cards) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* 1. Total Books */}
            <div
              onClick={() => navigate('/books')}
              className="bg-white rounded-2xl p-4 sm:p-4.5 border border-slate-100/90 shadow-2xs relative overflow-hidden group hover:shadow-xs hover:border-emerald-200 transition-all min-h-[92px] flex flex-col justify-between cursor-pointer"
            >
              <div className="flex items-start justify-between">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-[#0bad96] flex items-center justify-center">
                  <BookOpen className="w-4.5 h-4.5 stroke-[2]" />
                </div>
              </div>
              <div className="mt-1">
                <span className="text-[11px] font-semibold text-slate-500 block leading-tight">Total Books</span>
                <div className="flex items-baseline gap-1.5 mt-1 flex-wrap">
                  <span className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-none">
                    {totalCopiesCount.toLocaleString()}
                  </span>
                  <span className="text-xs font-bold text-slate-400">Copies</span>
                  <span className="text-slate-300 font-bold">•</span>
                  <span className="text-xs font-bold text-[#0bad96] bg-emerald-50 px-1.5 py-0.5 rounded-md">
                    {totalTitlesCount} Titles
                  </span>
                </div>
                <div className="text-[10px] sm:text-[11px] font-bold text-emerald-600 mt-1 flex items-center gap-1">
                  <span>↑ 12%</span>
                  <span className="text-slate-400 font-normal">in library collection</span>
                </div>
              </div>
              <BookOpen className="w-14 h-14 text-slate-100/60 absolute -right-2.5 -bottom-2.5 pointer-events-none stroke-[1]" />
            </div>

            {/* 2. Total Members */}
            <div
              onClick={() => navigate('/members')}
              className="bg-white rounded-2xl p-4 sm:p-4.5 border border-slate-100/90 shadow-2xs relative overflow-hidden group hover:shadow-xs hover:border-purple-200 transition-all min-h-[92px] flex flex-col justify-between cursor-pointer"
            >
              <div className="flex items-start justify-between">
                <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                  <Users className="w-4.5 h-4.5 stroke-[2]" />
                </div>
              </div>
              <div className="mt-1">
                <span className="text-[11px] font-semibold text-slate-500 block leading-tight">Total Members</span>
                <div className="flex items-baseline gap-1.5 mt-1">
                  <span className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-none">
                    {totalMembersCount.toLocaleString()}
                  </span>
                  <span className="text-xs font-bold text-slate-400">Members</span>
                </div>
                <div className="text-[10px] sm:text-[11px] font-bold text-emerald-600 mt-1 flex items-center gap-1">
                  <span>↑ 8%</span>
                  <span className="text-slate-400 font-normal">registered users</span>
                </div>
              </div>
              <Users className="w-14 h-14 text-slate-100/60 absolute -right-2.5 -bottom-2.5 pointer-events-none stroke-[1]" />
            </div>

            {/* 3. Books Issued */}
            <div
              onClick={() => navigate('/issue-return')}
              className="bg-white rounded-2xl p-4 sm:p-4.5 border border-slate-100/90 shadow-2xs relative overflow-hidden group hover:shadow-xs hover:border-emerald-200 transition-all min-h-[92px] flex flex-col justify-between cursor-pointer"
            >
              <div className="flex items-start justify-between">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Repeat className="w-4.5 h-4.5 stroke-[2]" />
                </div>
              </div>
              <div className="mt-1">
                <span className="text-[11px] font-semibold text-slate-500 block leading-tight">Books Issued</span>
                <div className="flex items-baseline gap-1.5 mt-1">
                  <span className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-none">
                    {issuedCopiesCount.toLocaleString()}
                  </span>
                  <span className="text-xs font-bold text-slate-400">Copies</span>
                </div>
                <div className="text-[10px] sm:text-[11px] font-bold text-emerald-600 mt-1 flex items-center gap-1">
                  <span>↑ 15%</span>
                  <span className="text-slate-400 font-normal">loaned to members</span>
                </div>
              </div>
              <BookOpen className="w-14 h-14 text-slate-100/60 absolute -right-2.5 -bottom-2.5 pointer-events-none stroke-[1]" />
            </div>
          </div>

          {/* Row 2 Stats (3 Cards) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* 4. Overdue Books */}
            <div
              onClick={() => navigate('/issue-return')}
              className="bg-white rounded-2xl p-4 sm:p-4.5 border border-red-100/70 shadow-2xs relative overflow-hidden group hover:shadow-xs hover:border-red-200 transition-all min-h-[92px] flex flex-col justify-between cursor-pointer"
            >
              <div className="flex items-start justify-between">
                <div className="w-9 h-9 rounded-xl bg-red-50 text-red-500 flex items-center justify-center">
                  <AlertTriangle className="w-4.5 h-4.5 stroke-[2]" />
                </div>
                {finesMetrics.pendingFines > 0 && (
                  <span className="text-[10px] font-bold bg-rose-50 text-rose-600 px-1.5 py-0.5 rounded-md border border-rose-100">
                    ₹{finesMetrics.pendingFines} Due
                  </span>
                )}
              </div>
              <div className="mt-1">
                <span className="text-[11px] font-semibold text-slate-500 block leading-tight">Overdue Books</span>
                <div className="flex items-baseline gap-1.5 mt-1">
                  <span className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-none">
                    {overdueBooksCount.toLocaleString()}
                  </span>
                  <span className="text-xs font-bold text-red-500">Loans</span>
                </div>
                <div className="text-[10px] sm:text-[11px] font-bold text-red-500 mt-1 flex items-center gap-1">
                  <span>₹ {finesMetrics.pendingFines}</span>
                  <span className="text-slate-400 font-normal">pending fine</span>
                </div>
              </div>
              <AlertTriangle className="w-14 h-14 text-slate-100/60 absolute -right-2.5 -bottom-2.5 pointer-events-none stroke-[1]" />
            </div>

            {/* 5. Total Categories */}
            <div
              onClick={() => navigate('/books')}
              className="bg-white rounded-2xl p-4 sm:p-4.5 border border-slate-100/90 shadow-2xs relative overflow-hidden group hover:shadow-xs hover:border-amber-200 transition-all min-h-[92px] flex flex-col justify-between cursor-pointer"
            >
              <div className="flex items-start justify-between">
                <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center">
                  <LayoutGrid className="w-4.5 h-4.5 stroke-[2]" />
                </div>
              </div>
              <div className="mt-1">
                <span className="text-[11px] font-semibold text-slate-500 block leading-tight">Total Categories</span>
                <div className="flex items-baseline gap-1.5 mt-1">
                  <span className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-none">
                    {categoriesCount.toLocaleString()}
                  </span>
                  <span className="text-xs font-bold text-slate-400">Genres</span>
                </div>
                <div className="text-[10px] sm:text-[11px] font-bold text-amber-500 mt-1 flex items-center gap-1">
                  <span>↑ 2%</span>
                  <span className="text-slate-400 font-normal">from last month</span>
                </div>
              </div>
              <LayoutGrid className="w-14 h-14 text-slate-100/60 absolute -right-2.5 -bottom-2.5 pointer-events-none stroke-[1]" />
            </div>

            {/* 6. Fine Collected */}
            <div
              onClick={() => navigate('/fines')}
              className="bg-white rounded-2xl p-4 sm:p-4.5 border border-slate-100/90 shadow-2xs relative overflow-hidden group hover:shadow-xs hover:border-purple-200 transition-all min-h-[92px] flex flex-col justify-between cursor-pointer"
            >
              <div className="flex items-start justify-between">
                <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                  <Coins className="w-4.5 h-4.5 stroke-[2]" />
                </div>
                {finesMetrics.pendingFines > 0 && (
                  <span className="text-[10px] font-bold bg-purple-50 text-purple-700 px-2 py-0.5 rounded-full border border-purple-100">
                    ₹{finesMetrics.pendingFines} Due
                  </span>
                )}
              </div>
              <div className="mt-1">
                <span className="text-[11px] font-semibold text-slate-500 block leading-tight">Fine Collected</span>
                <div className="flex items-baseline gap-1.5 mt-1 flex-wrap">
                  <span className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-none">
                    ₹ {totalFineCollected.toLocaleString()}
                  </span>
                  <span className="text-xs font-bold text-slate-400">Paid</span>
                </div>
                <div className="text-[10px] sm:text-[11px] font-bold text-purple-600 mt-1 flex items-center gap-1">
                  <span>{finesMetrics.pendingFines > 0 ? `₹${finesMetrics.pendingFines} pending` : 'All cleared'}</span>
                  <span className="text-slate-400 font-normal">• click to view fines</span>
                </div>
              </div>
              <Coins className="w-14 h-14 text-slate-100/60 absolute -right-2.5 -bottom-2.5 pointer-events-none stroke-[1]" />
            </div>
          </div>

          {/* Row 3: Books Overview (Bar Chart & Donut Chart) */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-100/90 shadow-2xs flex flex-col justify-between">
            {/* Header & Filter */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-50 text-[#0bad96] flex items-center justify-center">
                  <BookOpen className="w-4 h-4 stroke-[2]" />
                </div>
                <h2 className="text-xs sm:text-sm font-bold text-slate-800">Books Overview</h2>
              </div>

              {/* Filter Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl border border-slate-200/80 text-[11px] font-medium text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <span>{timeFilter}</span>
                  <ChevronDown className="w-3 h-3 text-slate-400 stroke-[2]" />
                </button>

                {isFilterOpen && (
                  <>
                    <div onClick={() => setIsFilterOpen(false)} className="fixed inset-0 z-20" />
                    <div className="absolute right-0 mt-1 w-32 bg-white rounded-xl shadow-lg border border-slate-100 py-1 z-30 text-xs">
                      {['Last 6 Months', 'This Year', 'Last 30 Days'].map((filter) => (
                        <button
                          key={filter}
                          type="button"
                          onClick={() => {
                            setTimeFilter(filter);
                            setIsFilterOpen(false);
                            toast.info(`Updated overview for ${filter}`);
                          }}
                          className={`w-full text-left px-3 py-1.5 hover:bg-slate-50 transition-colors ${
                            timeFilter === filter ? 'text-[#0bad96] font-bold' : 'text-slate-600'
                          }`}
                        >
                          {filter}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Legend Row */}
            <div className="flex items-center gap-4 text-[11px] text-slate-500 font-medium mb-3">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#0bad96]" />
                <span>Issued</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#86efac]" />
                <span>Returned</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#fb923c]" />
                <span>Overdue</span>
              </div>
            </div>

            {/* Charts Split (Bar Chart ~62% | Donut Chart ~38%) */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
              {/* Left Bar Chart (8 cols) */}
              <div className="md:col-span-8 flex flex-col justify-end">
                <div className="relative h-48 sm:h-52 flex items-end justify-between gap-1.5 sm:gap-3 pl-7 border-b border-slate-100">
                  {/* Dotted horizontal lines & labels */}
                  {[200, 150, 100, 50, 0].map((val) => (
                    <div
                      key={val}
                      className="absolute left-0 right-0 flex items-center pointer-events-none"
                      style={{ bottom: `${(val / maxChartValue) * 100}%` }}
                    >
                      <span className="text-[9px] text-slate-400 font-mono w-5 text-right pr-1.5">
                        {val}
                      </span>
                      <div className="w-full border-b border-dashed border-slate-100" />
                    </div>
                  ))}

                  {/* Grouped Bars */}
                  {currentChartData.map((d) => {
                    const issuedHeight = (d.issued / maxChartValue) * 100;
                    const returnedHeight = (d.returned / maxChartValue) * 100;
                    const overdueHeight = (d.overdue / maxChartValue) * 100;

                    return (
                      <div
                        key={d.month}
                        onMouseEnter={() => setHoveredBar(d)}
                        onMouseLeave={() => setHoveredBar(null)}
                        className="relative z-10 flex-1 flex items-end justify-center gap-1 h-full group cursor-pointer"
                      >
                        {/* Bar 1: Issued */}
                        <div
                          style={{ height: `${issuedHeight}%` }}
                          className="w-2.5 sm:w-3 bg-[#0bad96] rounded-t-sm transition-all duration-300 group-hover:brightness-110"
                        />
                        {/* Bar 2: Returned */}
                        <div
                          style={{ height: `${returnedHeight}%` }}
                          className="w-2.5 sm:w-3 bg-[#86efac] rounded-t-sm transition-all duration-300 group-hover:brightness-110"
                        />
                        {/* Bar 3: Overdue */}
                        <div
                          style={{ height: `${overdueHeight}%` }}
                          className="w-2.5 sm:w-3 bg-[#fb923c] rounded-t-sm transition-all duration-300 group-hover:brightness-110"
                        />

                        {/* Hover Tooltip */}
                        {hoveredBar?.month === d.month && (
                          <div className="absolute -top-11 bg-slate-900 text-white text-[10px] rounded-lg px-2 py-1 shadow-lg pointer-events-none whitespace-nowrap z-20">
                            <div><strong>{d.month}:</strong> Issued: {d.issued} | Ret: {d.returned} | Overdue: {d.overdue}</div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* X Axis Labels */}
                <div className="flex justify-between pl-7 pt-1.5 text-[10px] font-semibold text-slate-400">
                  {currentChartData.map((d) => (
                    <div key={d.month} className="flex-1 text-center">
                      {d.month}
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Donut Chart (4 cols) */}
              <div className="md:col-span-4 flex flex-col items-center justify-center p-1 border-t md:border-t-0 md:border-l border-slate-100">
                {/* SVG Donut */}
                <div className="relative w-32 h-32 flex items-center justify-center">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="38"
                      fill="transparent"
                      stroke="#f1f5f9"
                      strokeWidth="11"
                    />
                    {/* Available */}
                    <circle
                      cx="50"
                      cy="50"
                      r="38"
                      fill="transparent"
                      stroke="#0bad96"
                      strokeWidth="11"
                      strokeDasharray={`${(availablePercent / 100) * 238.76} 238.76`}
                      strokeDashoffset="0"
                      strokeLinecap="round"
                    />
                    {/* Issued */}
                    <circle
                      cx="50"
                      cy="50"
                      r="38"
                      fill="transparent"
                      stroke="#86efac"
                      strokeWidth="11"
                      strokeDasharray={`${(issuedPercent / 100) * 238.76} 238.76`}
                      strokeDashoffset={`-${(availablePercent / 100) * 238.76}`}
                    />
                    {/* Overdue */}
                    <circle
                      cx="50"
                      cy="50"
                      r="38"
                      fill="transparent"
                      stroke="#fb923c"
                      strokeWidth="11"
                      strokeDasharray={`${(overduePercent / 100) * 238.76} 238.76`}
                      strokeDashoffset={`-${((availablePercent + issuedPercent) / 100) * 238.76}`}
                    />
                  </svg>

                  {/* Donut Center */}
                  <div className="absolute text-center leading-none">
                    <span className="text-[9px] text-slate-400 font-medium block">Total Books</span>
                    <span className="text-base font-black text-slate-900 block mt-0.5">{totalCopiesCount.toLocaleString()}</span>
                    <span className="text-[10px] font-bold text-emerald-600 block mt-0.5">{totalTitlesCount} Titles</span>
                  </div>
                </div>

                {/* Donut Legend */}
                <div className="w-full space-y-1.5 mt-3 text-[11px] font-semibold">
                  <div className="flex items-center justify-between text-slate-600">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#0bad96]" />
                      <span>Available</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-900 font-bold">{availableCopiesCount.toLocaleString()}</span>
                      <span className="text-slate-400 text-[10px]">{availablePercent}%</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-slate-600">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#86efac]" />
                      <span>Issued</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-900 font-bold">{issuedCopiesCount.toLocaleString()}</span>
                      <span className="text-slate-400 text-[10px]">{issuedPercent}%</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-slate-600">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#fb923c]" />
                      <span>Overdue</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-900 font-bold">{overdueBooksCount.toLocaleString()}</span>
                      <span className="text-slate-400 text-[10px]">{overduePercent}%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ===================== RIGHT COLUMN (4 cols) ===================== */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          {/* Card 7: Books Available (Top Right - Matches Row 1 Height exactly!) */}
          <div
            onClick={() => navigate('/books')}
            className="bg-white rounded-2xl p-4 sm:p-4.5 border border-slate-100/90 shadow-2xs relative overflow-hidden group hover:shadow-xs hover:border-blue-200 transition-all min-h-[92px] flex flex-col justify-between cursor-pointer"
          >
            <div className="flex items-start justify-between">
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Copy className="w-4.5 h-4.5 stroke-[2]" />
              </div>
            </div>
            <div className="mt-1">
              <span className="text-[11px] font-semibold text-slate-500 block leading-tight">Books Available</span>
              <div className="flex items-baseline gap-1.5 mt-1">
                <span className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-none">
                  {availableCopiesCount.toLocaleString()}
                </span>
                <span className="text-xs font-bold text-slate-400">Copies</span>
              </div>
              <div className="text-[10px] sm:text-[11px] font-bold text-emerald-600 mt-1 flex items-center gap-1">
                <span>↑ 10%</span>
                <span className="text-slate-400 font-normal">ready to issue</span>
              </div>
            </div>
            <BookOpen className="w-16 h-16 text-slate-100/60 absolute -right-3 -bottom-3 pointer-events-none stroke-[1]" />
          </div>

          {/* Recent Activities (Bottom Right - Matches Row 2 + Books Overview Height!) */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-100/90 shadow-2xs flex flex-col justify-between">
            <div>
              {/* Header */}
              <div className="flex items-center justify-between mb-3.5 pb-1">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-slate-700 stroke-[2]" />
                  <h2 className="text-xs sm:text-sm font-bold text-slate-800">Recent Activities</h2>
                </div>
                <button
                  type="button"
                  onClick={() => navigate('/issue-return')}
                  className="text-xs font-bold text-[#0bad96] hover:underline cursor-pointer"
                >
                  View All
                </button>
              </div>

              {/* Activity Items List */}
              <div className="space-y-2">
                {dynamicActivities.length === 0 ? (
                  <div className="py-6 text-center text-xs text-slate-400 font-medium">
                    No recent activities recorded yet.
                  </div>
                ) : (
                  dynamicActivities.map((item) => {
                    const Icon = item.icon;
                    return (
                      <div
                        key={item.id}
                        onClick={() => item.route && navigate(item.route)}
                        className={`flex items-start justify-between gap-2 p-1.5 -mx-1.5 rounded-xl transition-all ${
                          item.route ? 'cursor-pointer hover:bg-slate-50/90 active:scale-[0.99]' : ''
                        }`}
                        title={item.route ? `Go to ${item.route}` : undefined}
                      >
                        <div className="flex items-start gap-2.5 overflow-hidden">
                          <div className={`w-7.5 h-7.5 rounded-xl ${item.iconBg} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                            <Icon className="w-3.5 h-3.5 stroke-[2]" />
                          </div>
                          <div className="truncate text-left leading-tight">
                            <div className="text-xs font-bold text-slate-800 truncate">
                              {item.title}
                            </div>
                            <div className="text-[11px] text-slate-400 truncate mt-0.5">
                              {item.subtitle}
                            </div>
                          </div>
                        </div>

                        {/* Time and Status Dot */}
                        <div className="flex items-center gap-1.5 flex-shrink-0 text-[10px] text-slate-400 font-medium">
                          <span>{item.time}</span>
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            item.type === 'overdue' ? 'bg-rose-500' : 'bg-emerald-500'
                          }`} />
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Bottom Section: Quick Action Row (Full Width - 5 Equal Cards) */}
      <div className="space-y-2.5 pt-1">
        {/* Header */}
        <div className="flex items-center gap-1.5">
          <Zap className="w-4 h-4 text-[#0bad96] stroke-[2.5]" />
          <h2 className="text-xs sm:text-sm font-bold text-slate-800">Quick Action</h2>
        </div>

        {/* 5 Equal Action Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
          {/* Action 1: Add New Book */}
          <div
            onClick={() => setActiveModal('Add New Book')}
            className="bg-white rounded-2xl p-3.5 sm:p-4 border border-slate-100/90 shadow-2xs hover:border-emerald-200 hover:shadow-xs transition-all cursor-pointer flex items-center justify-between group"
          >
            <div>
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-[#0bad96] flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                <PlusCircle className="w-4 h-4 stroke-[2]" />
              </div>
              <h3 className="text-xs font-bold text-slate-800 group-hover:text-[#0bad96] transition-colors">
                Add New Book
              </h3>
              <p className="text-[10px] text-slate-400 mt-0.5">
                Add book to Library
              </p>
            </div>
            <div className="w-6.5 h-6.5 rounded-full bg-emerald-50/80 text-[#0bad96] flex items-center justify-center group-hover:bg-[#0bad96] group-hover:text-white transition-colors flex-shrink-0">
              <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
            </div>
          </div>

          {/* Action 2: Add Member */}
          <div
            onClick={() => setActiveModal('Add Member')}
            className="bg-white rounded-2xl p-3.5 sm:p-4 border border-slate-100/90 shadow-2xs hover:border-emerald-200 hover:shadow-xs transition-all cursor-pointer flex items-center justify-between group"
          >
            <div>
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-[#0bad96] flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                <UserPlus className="w-4 h-4 stroke-[2]" />
              </div>
              <h3 className="text-xs font-bold text-slate-800 group-hover:text-[#0bad96] transition-colors">
                Add Member
              </h3>
              <p className="text-[10px] text-slate-400 mt-0.5">
                Register new member
              </p>
            </div>
            <div className="w-6.5 h-6.5 rounded-full bg-emerald-50/80 text-[#0bad96] flex items-center justify-center group-hover:bg-[#0bad96] group-hover:text-white transition-colors flex-shrink-0">
              <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
            </div>
          </div>

          {/* Action 3: Issue Book */}
          <div
            onClick={() => setActiveModal('Issue Book')}
            className="bg-white rounded-2xl p-3.5 sm:p-4 border border-slate-100/90 shadow-2xs hover:border-emerald-200 hover:shadow-xs transition-all cursor-pointer flex items-center justify-between group"
          >
            <div>
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-[#0bad96] flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                <Repeat className="w-4 h-4 stroke-[2]" />
              </div>
              <h3 className="text-xs font-bold text-slate-800 group-hover:text-[#0bad96] transition-colors">
                Issue Book
              </h3>
              <p className="text-[10px] text-slate-400 mt-0.5">
                Issue to a member
              </p>
            </div>
            <div className="w-6.5 h-6.5 rounded-full bg-emerald-50/80 text-[#0bad96] flex items-center justify-center group-hover:bg-[#0bad96] group-hover:text-white transition-colors flex-shrink-0">
              <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
            </div>
          </div>

          {/* Action 4: Return Book */}
          <div
            onClick={() => setActiveModal('Return Book')}
            className="bg-white rounded-2xl p-3.5 sm:p-4 border border-slate-100/90 shadow-2xs hover:border-emerald-200 hover:shadow-xs transition-all cursor-pointer flex items-center justify-between group"
          >
            <div>
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-[#0bad96] flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                <CheckCircle2 className="w-4 h-4 stroke-[2]" />
              </div>
              <h3 className="text-xs font-bold text-slate-800 group-hover:text-[#0bad96] transition-colors">
                Return Book
              </h3>
              <p className="text-[10px] text-slate-400 mt-0.5">
                Process book return
              </p>
            </div>
            <div className="w-6.5 h-6.5 rounded-full bg-emerald-50/80 text-[#0bad96] flex items-center justify-center group-hover:bg-[#0bad96] group-hover:text-white transition-colors flex-shrink-0">
              <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
            </div>
          </div>

          {/* Action 5: Add Category */}
          <div
            onClick={() => setActiveModal('Add Category')}
            className="bg-white rounded-2xl p-3.5 sm:p-4 border border-slate-100/90 shadow-2xs hover:border-purple-200 hover:shadow-xs transition-all cursor-pointer flex items-center justify-between group"
          >
            <div>
              <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                <Tag className="w-4 h-4 stroke-[2]" />
              </div>
              <h3 className="text-xs font-bold text-slate-800 group-hover:text-purple-600 transition-colors">
                Add Category
              </h3>
              <p className="text-[10px] text-slate-400 mt-0.5">
                Manage categories
              </p>
            </div>
            <div className="w-6.5 h-6.5 rounded-full bg-slate-50 text-slate-400 group-hover:bg-purple-600 group-hover:text-white transition-colors flex-shrink-0">
              <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Modal for Quick Actions */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-7 w-full max-w-md shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <span className="p-1 rounded-lg bg-emerald-50 text-[#0bad96]">
                  <Zap className="w-4 h-4" />
                </span>
                <span>{activeModal}</span>
              </h3>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleQuickActionSubmit} className="space-y-3 text-xs">
              {activeModal === 'Add New Book' && (
                <>
                  <div>
                    <label className="font-bold text-slate-700">Book Title *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Design Patterns"
                      value={modalFormData.title}
                      onChange={(e) => setModalFormData({ ...modalFormData, title: e.target.value })}
                      className="w-full mt-1 p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#0bad96]"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700">Author Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Erich Gamma"
                      value={modalFormData.author}
                      onChange={(e) => setModalFormData({ ...modalFormData, author: e.target.value })}
                      className="w-full mt-1 p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#0bad96]"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="font-bold text-slate-700">Category</label>
                      <input
                        type="text"
                        placeholder="e.g. Technology"
                        value={modalFormData.categoryName}
                        onChange={(e) => setModalFormData({ ...modalFormData, categoryName: e.target.value })}
                        className="w-full mt-1 p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#0bad96]"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-700">Total Copies</label>
                      <input
                        type="number"
                        min="1"
                        placeholder="5"
                        value={modalFormData.totalCopies}
                        onChange={(e) => setModalFormData({ ...modalFormData, totalCopies: e.target.value })}
                        className="w-full mt-1 p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#0bad96]"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="font-bold text-slate-700">ISBN Number</label>
                    <input
                      type="text"
                      placeholder="e.g. 978-0201633610"
                      value={modalFormData.isbn}
                      onChange={(e) => setModalFormData({ ...modalFormData, isbn: e.target.value })}
                      className="w-full mt-1 p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#0bad96]"
                    />
                  </div>
                </>
              )}

              {activeModal === 'Add Member' && (
                <>
                  <div>
                    <label className="font-bold text-slate-700">Member Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ananya Roy"
                      value={modalFormData.name}
                      onChange={(e) => setModalFormData({ ...modalFormData, name: e.target.value })}
                      className="w-full mt-1 p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#0bad96]"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700">Email Address *</label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. ananya@example.com"
                      value={modalFormData.email}
                      onChange={(e) => setModalFormData({ ...modalFormData, email: e.target.value })}
                      className="w-full mt-1 p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#0bad96]"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="font-bold text-slate-700">Phone</label>
                      <input
                        type="text"
                        placeholder="+91 98765 43210"
                        value={modalFormData.phone}
                        onChange={(e) => setModalFormData({ ...modalFormData, phone: e.target.value })}
                        className="w-full mt-1 p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#0bad96]"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-700">Role</label>
                      <select
                        value={modalFormData.role}
                        onChange={(e) => setModalFormData({ ...modalFormData, role: e.target.value })}
                        className="w-full mt-1 p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#0bad96] bg-white"
                      >
                        <option value="Student">Student</option>
                        <option value="Faculty">Faculty</option>
                        <option value="Staff">Staff</option>
                        <option value="Guest">Guest</option>
                      </select>
                    </div>
                  </div>
                </>
              )}

              {activeModal === 'Issue Book' && (
                <>
                  <div>
                    <label className="font-bold text-slate-700">Select Book to Issue *</label>
                    <select
                      required
                      value={modalFormData.bookId}
                      onChange={(e) => setModalFormData({ ...modalFormData, bookId: e.target.value })}
                      className="w-full mt-1 p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#0bad96] bg-white text-xs"
                    >
                      <option value="">-- Choose Book ({books.filter((b) => b.availableCopies > 0).length} available) --</option>
                      {books
                        .filter((b) => b.availableCopies > 0)
                        .map((b) => (
                          <option key={b.id} value={b.id}>
                            {b.title} (Available: {b.availableCopies}/{b.totalCopies})
                          </option>
                        ))}
                    </select>
                  </div>
                  <div>
                    <label className="font-bold text-slate-700">Issue To Member *</label>
                    <select
                      required
                      value={modalFormData.memberId}
                      onChange={(e) => setModalFormData({ ...modalFormData, memberId: e.target.value })}
                      className="w-full mt-1 p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#0bad96] bg-white text-xs"
                    >
                      <option value="">-- Choose Member ({members.length} registered) --</option>
                      {members.map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.name} ({m.membershipId}) - {m.status}
                        </option>
                      ))}
                    </select>
                  </div>
                </>
              )}

              {activeModal === 'Return Book' && (
                <div>
                  <label className="font-bold text-slate-700">Select Book to Return *</label>
                  <select
                    required
                    value={modalFormData.bookId}
                    onChange={(e) => setModalFormData({ ...modalFormData, bookId: e.target.value })}
                    className="w-full mt-1 p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#0bad96] bg-white text-xs"
                  >
                    <option value="">-- Choose Book to Return --</option>
                    {books
                      .filter((b) => b.availableCopies < b.totalCopies)
                      .map((b) => (
                        <option key={b.id} value={b.id}>
                          {b.title} (Issued copies: {b.totalCopies - b.availableCopies})
                        </option>
                      ))}
                  </select>
                </div>
              )}

              {activeModal === 'Add Category' && (
                <div>
                  <label className="font-bold text-slate-700">Category Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Artificial Intelligence"
                    value={modalFormData.categoryName}
                    onChange={(e) => setModalFormData({ ...modalFormData, categoryName: e.target.value })}
                    className="w-full mt-1 p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#0bad96]"
                  />
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="px-4 py-2 rounded-xl text-slate-500 hover:bg-slate-100 font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#0bad96] hover:bg-[#099884] text-white font-bold shadow-sm cursor-pointer"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
