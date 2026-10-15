import React, { useState, useMemo, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Coins,
  Search,
  CheckCircle2,
  AlertTriangle,
  Clock,
  User,
  BookOpen,
  Filter,
  DollarSign,
  Download,
  Receipt,
  X,
  CreditCard,
  ShieldAlert,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
} from 'lucide-react';
import { toast } from 'react-toastify';
import { useMembers } from '../context/MemberContext';
import { useBooks } from '../context/BookContext';

export default function FinesPage() {
  const { members, settleMemberFine, waiveMemberFine } = useMembers();
  const { books } = useBooks();
  const location = useLocation();

  const [highlightBanner, setHighlightBanner] = useState(() => {
    if (location.state && location.state.bookTitle && location.state.fineAmount) {
      return location.state;
    }
    return null;
  });

  const [searchQuery, setSearchQuery] = useState(() => {
    return location.state?.search || '';
  });
  const [statusFilter, setStatusFilter] = useState(() => {
    return location.state?.filter || 'All';
  });
  const [settlingFine, setSettlingFine] = useState(null); // modal state
  const [waivingFine, setWaivingFine] = useState(null); // waive confirm modal state
  const [paymentMethod, setPaymentMethod] = useState('Cash');

  // Fine status overrides with localStorage persistence
  const [fineOverrides, setFineOverrides] = useState(() => {
    try {
      const cached = localStorage.getItem('librabook_fine_overrides');
      if (cached) return JSON.parse(cached);
    } catch {}
    return {};
  });

  // Sync state if navigation state changes
  useEffect(() => {
    if (location.state) {
      if (location.state.filter) setStatusFilter(location.state.filter);
      if (location.state.search) setSearchQuery(location.state.search);
      if (location.state.bookTitle && location.state.fineAmount) {
        setHighlightBanner(location.state);
      }
    }
  }, [location.state]);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6);

  // Derive all fine records across members
  const allFineRecords = useMemo(() => {
    const list = [];
    const seenKeys = new Set();

    members.forEach((member) => {
      // 1. From member.fineHistory
      if (member.fineHistory && member.fineHistory.length > 0) {
        member.fineHistory.forEach((fine) => {
          const fineKey = `${member.id}_${fine.id || fine.reason}`;
          if (!seenKeys.has(fineKey)) {
            seenKeys.add(fineKey);
            list.push({
              id: fineKey,
              fineId: fine.id,
              memberId: member.id,
              memberName: member.name,
              membershipId: member.membershipId || 'M00123',
              memberAvatar: member.avatarUrl,
              reason: fine.reason || 'Late book return fee',
              amount: Number(fine.amount) || 50,
              date: fine.date || '10 Oct 2025',
              status: fine.status || 'Pending',
              paymentMethod: fine.paymentMethod || 'Cash',
            });
          }
        });
      } else if (member.totalFine > 0 || member.overdueBooks > 0) {
        // Fallback fine record if overdue
        const overdueLoan = (member.issueHistory || []).find((h) => h.status === 'Overdue');
        const fineKey = `${member.id}_overdue_fine`;
        if (!seenKeys.has(fineKey)) {
          seenKeys.add(fineKey);
          list.push({
            id: fineKey,
            memberId: member.id,
            memberName: member.name,
            membershipId: member.membershipId || 'M00123',
            memberAvatar: member.avatarUrl,
            reason: overdueLoan ? `Late fee for "${overdueLoan.bookTitle}"` : 'Overdue book fine',
            amount: Number(member.totalFine) || 50,
            date: overdueLoan?.dueDate || '09 Oct 2025',
            status: 'Pending',
            paymentMethod: '-',
          });
        }
      }
    });

    // Seed historical & active transactions for complete demo ledger
    const seedFines = [
      {
        id: 'seed_fine_pending_1',
        memberId: 'm3',
        memberName: 'Sneha Patel',
        membershipId: 'LIB025',
        memberAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
        reason: 'Overdue return penalty (Clean Code)',
        amount: 75,
        date: '12 Oct 2025',
        status: 'Pending',
        paymentMethod: '-',
      },
      {
        id: 'seed_fine_pending_2',
        memberId: 'm4',
        memberName: 'Vikram Joshi',
        membershipId: 'LIB026',
        memberAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
        reason: 'Damaged page penalty (Deep Work)',
        amount: 120,
        date: '14 Oct 2025',
        status: 'Pending',
        paymentMethod: '-',
      },
      {
        id: 'hist_fine_1',
        memberId: 'm1',
        memberName: 'Rahul Verma',
        membershipId: 'LIB021',
        memberAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
        reason: 'Late return fee (Atomic Habits)',
        amount: 25,
        date: '05 Oct 2025',
        status: 'Paid',
        paymentMethod: 'UPI',
      },
      {
        id: 'hist_fine_2',
        memberId: 'm2',
        memberName: 'Priya Sharma',
        membershipId: 'LIB022',
        memberAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
        reason: 'Lost library badge replacement',
        amount: 100,
        date: '02 Oct 2025',
        status: 'Paid',
        paymentMethod: 'Card',
      },
      {
        id: 'hist_fine_3',
        memberId: 'm5',
        memberName: 'Karan Mehta',
        membershipId: 'LIB027',
        memberAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
        reason: 'Book cover wear fee (Dune)',
        amount: 50,
        date: '28 Sep 2025',
        status: 'Waived',
        paymentMethod: 'Discretionary',
      },
    ];

    seedFines.forEach((s) => {
      if (!seenKeys.has(s.id)) {
        list.push(s);
      }
    });

    // Apply any interactive overrides saved for fine records
    const mapped = list.map((item) => {
      const override = fineOverrides[item.id] || (item.fineId && fineOverrides[`${item.memberId}_${item.fineId}`]);
      if (override) {
        return {
          ...item,
          status: override.status,
          paymentMethod: override.paymentMethod || item.paymentMethod,
          date: override.date || item.date,
        };
      }
      return item;
    });

    // Ensure newest fines or fines for returned book appear on top
    mapped.sort((a, b) => {
      if (highlightBanner?.bookTitle) {
        const aMatches = a.reason?.toLowerCase().includes(highlightBanner.bookTitle.toLowerCase());
        const bMatches = b.reason?.toLowerCase().includes(highlightBanner.bookTitle.toLowerCase());
        if (aMatches && !bMatches) return -1;
        if (!aMatches && bMatches) return 1;
      }
      const aIsNew = String(a.id).includes('fine_');
      const bIsNew = String(b.id).includes('fine_');
      if (aIsNew && !bIsNew) return -1;
      if (!aIsNew && bIsNew) return 1;
      return 0;
    });

    return mapped;
  }, [members, fineOverrides, highlightBanner]);

  // Summary Metrics
  const totalFineCollected = useMemo(() => {
    const paidSum = allFineRecords.filter((f) => f.status === 'Paid').reduce((acc, f) => acc + (Number(f.amount) || 0), 0);
    return 2450 + paidSum;
  }, [allFineRecords]);

  const pendingFines = useMemo(() => {
    return allFineRecords.filter((f) => f.status === 'Pending').reduce((acc, f) => acc + (Number(f.amount) || 0), 0);
  }, [allFineRecords]);

  const overdueMembersCount = useMemo(() => {
    const pendingMemberIds = new Set(
      allFineRecords.filter((f) => f.status === 'Pending').map((f) => f.memberId || f.membershipId)
    );
    return pendingMemberIds.size;
  }, [allFineRecords]);

  const waivedFines = useMemo(() => {
    return allFineRecords.filter((f) => f.status === 'Waived').reduce((acc, f) => acc + (Number(f.amount) || 0), 0);
  }, [allFineRecords]);

  // Tab counts
  const tabCounts = useMemo(() => {
    return {
      All: allFineRecords.length,
      Pending: allFineRecords.filter((f) => f.status === 'Pending').length,
      Paid: allFineRecords.filter((f) => f.status === 'Paid').length,
      Waived: allFineRecords.filter((f) => f.status === 'Waived').length,
    };
  }, [allFineRecords]);

  // Filtered List
  const filteredFines = useMemo(() => {
    return allFineRecords.filter((f) => {
      if (statusFilter !== 'All' && f.status !== statusFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        return (
          f.memberName.toLowerCase().includes(q) ||
          f.membershipId.toLowerCase().includes(q) ||
          f.reason.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [allFineRecords, searchQuery, statusFilter]);

  // Reset page when filter or search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, searchQuery, itemsPerPage]);

  // Pagination Slice
  const totalItems = filteredFines.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(Math.max(1, totalPages));
    }
  }, [totalPages, currentPage]);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const paginatedFines = filteredFines.slice(startIndex, endIndex);

  // Settle Fine Handler (Pay)
  const handleSettleFineSubmit = async (e) => {
    e.preventDefault();
    if (!settlingFine) return;

    const today = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

    // 1. Persist override for this specific fine in state & localStorage
    setFineOverrides((prev) => {
      const updated = {
        ...prev,
        [settlingFine.id]: {
          status: 'Paid',
          paymentMethod,
          date: today,
        },
      };
      if (settlingFine.fineId) {
        updated[`${settlingFine.memberId}_${settlingFine.fineId}`] = {
          status: 'Paid',
          paymentMethod,
          date: today,
        };
      }
      try {
        localStorage.setItem('librabook_fine_overrides', JSON.stringify(updated));
      } catch {}
      return updated;
    });

    // 2. Call MemberContext to update member debt & fine history
    if (settleMemberFine && settlingFine.memberId) {
      await settleMemberFine(settlingFine.memberId, {
        fineId: settlingFine.fineId,
        paymentMethod,
        silent: true,
      });
    }

    // 3. Single clean Toast
    toast.success(`Fine of ₹${settlingFine.amount} paid by ${settlingFine.memberName} via ${paymentMethod}!`, {
      icon: '💰',
    });

    // 4. Close modal
    setSettlingFine(null);
  };

  // Waive Fine Handler
  const handleConfirmWaive = async () => {
    if (!waivingFine) return;

    const today = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

    // 1. Persist override for this specific fine in state & localStorage
    setFineOverrides((prev) => {
      const updated = {
        ...prev,
        [waivingFine.id]: {
          status: 'Waived',
          paymentMethod: 'Discretionary',
          date: today,
        },
      };
      if (waivingFine.fineId) {
        updated[`${waivingFine.memberId}_${waivingFine.fineId}`] = {
          status: 'Waived',
          paymentMethod: 'Discretionary',
          date: today,
        };
      }
      try {
        localStorage.setItem('librabook_fine_overrides', JSON.stringify(updated));
      } catch {}
      return updated;
    });

    // 2. Call MemberContext to excuse member debt
    if (waiveMemberFine && waivingFine.memberId) {
      await waiveMemberFine(waivingFine.memberId, {
        fineId: waivingFine.fineId,
        reason: waivingFine.reason || 'Waived by Librarian',
        silent: true,
      });
    }

    // 3. Single clean Toast
    toast.success(`Penalty of ₹${waivingFine.amount} waived for ${waivingFine.memberName}!`, {
      icon: '🛡️',
    });

    // 4. Close modals
    setWaivingFine(null);
    if (settlingFine) setSettlingFine(null);
  };

  return (
    <div className="space-y-4 max-w-[1520px] mx-auto select-none">
      {/* 1. Header & Summary Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center flex-shrink-0 shadow-2xs">
            <Coins className="w-5 h-5 stroke-[2]" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Fines Management</h1>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Track overdue penalties, fine collections, waivers, and member payment history.
            </p>
          </div>
        </div>

        {/* 4 Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-white rounded-2xl p-3 sm:px-4 sm:py-3 border border-slate-100 shadow-2xs flex items-center gap-3 min-w-[140px]">
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center flex-shrink-0">
              <Coins className="w-4.5 h-4.5 stroke-[2]" />
            </div>
            <div className="leading-tight">
              <span className="text-[10px] text-slate-400 font-bold block">Fine Collected</span>
              <span className="text-lg font-black text-slate-900 mt-0.5 block">₹ {totalFineCollected.toLocaleString()}</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-3 sm:px-4 sm:py-3 border border-slate-100 shadow-2xs flex items-center gap-3 min-w-[140px]">
            <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="w-4.5 h-4.5 stroke-[2]" />
            </div>
            <div className="leading-tight">
              <span className="text-[10px] text-slate-400 font-bold block">Pending Fines</span>
              <span className="text-lg font-black text-rose-600 mt-0.5 block">₹ {pendingFines.toLocaleString()}</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-3 sm:px-4 sm:py-3 border border-slate-100 shadow-2xs flex items-center gap-3 min-w-[140px]">
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center flex-shrink-0">
              <User className="w-4.5 h-4.5 stroke-[2]" />
            </div>
            <div className="leading-tight">
              <span className="text-[10px] text-slate-400 font-bold block">Overdue Members</span>
              <span className="text-lg font-black text-slate-900 mt-0.5 block">{overdueMembersCount}</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-3 sm:px-4 sm:py-3 border border-slate-100 shadow-2xs flex items-center gap-3 min-w-[140px]">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-[#0bad96] flex items-center justify-center flex-shrink-0">
              <CheckCircle2 className="w-4.5 h-4.5 stroke-[2]" />
            </div>
            <div className="leading-tight">
              <span className="text-[10px] text-slate-400 font-bold block">Waived Fines</span>
              <span className="text-lg font-black text-slate-900 mt-0.5 block">₹ {waivedFines}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Dynamic Highlight Banner when navigated from Return Book with Fine */}
      {highlightBanner && (
        <div className="bg-gradient-to-r from-purple-50 via-indigo-50/50 to-purple-50 border border-purple-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center flex-shrink-0 shadow-xs">
              <Coins className="w-5 h-5 stroke-[2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-purple-950">Fine Incurred on Book Return</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-700">
                  {highlightBanner.filter || 'Pending'}
                </span>
              </div>
              <p className="text-xs text-purple-700 font-medium mt-0.5">
                Returned Book: <strong>"{highlightBanner.bookTitle}"</strong> | Member: <strong>{highlightBanner.memberName}</strong> | Fine Due:{' '}
                <strong className="text-purple-950 font-black">₹ {highlightBanner.fineAmount}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              type="button"
              onClick={() => {
                setHighlightBanner(null);
                setSearchQuery('');
                setStatusFilter('All');
              }}
              className="px-3.5 py-1.5 rounded-xl border border-purple-200 bg-white hover:bg-purple-100/50 text-purple-700 text-xs font-bold transition-colors cursor-pointer"
            >
              Show All Records
            </button>
            <button
              type="button"
              onClick={() => setHighlightBanner(null)}
              className="p-1.5 rounded-xl hover:bg-purple-100 text-purple-400 hover:text-purple-700 cursor-pointer"
              title="Dismiss"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* 2. Search & Filter Bar with Dynamic Count Badges */}
      <div className="bg-white rounded-2xl p-3 sm:p-4 border border-slate-100 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by member name, ID, or penalty reason..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200/90 text-xs text-slate-800 focus:outline-none focus:border-purple-600 transition-colors"
          />
        </div>

        {/* Status Filter Tabs with Live Badges */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
          {['All', 'Pending', 'Paid', 'Waived'].map((tab) => {
            const count = tabCounts[tab] || 0;
            const isActive = statusFilter === tab;
            return (
              <button
                key={tab}
                type="button"
                onClick={() => setStatusFilter(tab)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  isActive
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <span>{tab}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    isActive ? 'bg-white/20 text-white' : 'bg-slate-200/80 text-slate-600'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Fines Ledger Table */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-100 shadow-2xs">
        <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-50">
          <div className="flex items-center gap-2">
            <Receipt className="w-4 h-4 text-purple-600" />
            <h2 className="text-sm font-bold text-slate-900">Penalties & Collection Ledger</h2>
          </div>
          <span className="text-xs text-slate-400 font-semibold">{filteredFines.length} records found</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-2.5 px-3">#</th>
                <th className="py-2.5 px-3">Member</th>
                <th className="py-2.5 px-3">Penalty Reason</th>
                <th className="py-2.5 px-3">Date</th>
                <th className="py-2.5 px-3 text-right">Amount</th>
                <th className="py-2.5 px-3 text-center">Status</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-xs">
              {paginatedFines.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400 font-medium">
                    <Receipt className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    No fine records found matching the criteria.
                  </td>
                </tr>
              ) : (
                paginatedFines.map((item, index) => {
                  const isMatch = highlightBanner && (
                    (highlightBanner.bookTitle && item.reason?.toLowerCase().includes(highlightBanner.bookTitle.toLowerCase())) ||
                    (highlightBanner.memberName && item.memberName?.toLowerCase().includes(highlightBanner.memberName.toLowerCase()))
                  );
                  return (
                    <tr
                      key={item.id}
                      className={`transition-colors ${
                        isMatch
                          ? 'bg-purple-50/80 border-l-4 border-l-purple-600'
                          : 'hover:bg-slate-50/70'
                      }`}
                    >
                      <td className="py-3 px-3 font-bold text-slate-400">{startIndex + index + 1}</td>

                      {/* Member */}
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={item.memberAvatar || 'https://i.pravatar.cc/150'}
                            alt={item.memberName}
                            className="w-8 h-8 rounded-full object-cover border border-slate-100 flex-shrink-0"
                            onError={(e) => {
                              e.target.src = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150';
                            }}
                          />
                          <div className="leading-tight">
                            <span className="font-bold text-slate-900 block">{item.memberName}</span>
                            <span className="text-[10px] text-slate-400 font-mono">{item.membershipId}</span>
                          </div>
                        </div>
                      </td>

                      {/* Reason */}
                      <td className="py-3 px-3 font-medium text-slate-700 max-w-[260px]">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="truncate">{item.reason}</span>
                          {isMatch && (
                            <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-purple-100 text-purple-700 whitespace-nowrap">
                              Returned Book
                            </span>
                          )}
                        </div>
                      </td>

                    {/* Date */}
                    <td className="py-3 px-3 text-slate-500 font-medium whitespace-nowrap">{item.date}</td>

                    {/* Amount */}
                    <td className="py-3 px-3 text-right font-black text-slate-900 whitespace-nowrap">
                      ₹ {item.amount}
                    </td>

                    {/* Status */}
                    <td className="py-3 px-3 text-center whitespace-nowrap">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                          item.status === 'Paid'
                            ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                            : item.status === 'Pending'
                            ? 'bg-rose-50 text-rose-600 border border-rose-100'
                            : 'bg-slate-100 text-slate-600 border border-slate-200'
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-3 text-right whitespace-nowrap">
                      {item.status === 'Pending' ? (
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Settle / Pay Button */}
                          <button
                            type="button"
                            onClick={() => setSettlingFine(item)}
                            className="px-2.5 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 active:bg-purple-800 text-white font-bold text-[11px] shadow-2xs transition-colors cursor-pointer flex items-center gap-1"
                          >
                            <CreditCard className="w-3 h-3" />
                            <span>Settle</span>
                          </button>

                          {/* Waive Button */}
                          <button
                            type="button"
                            onClick={() => setWaivingFine(item)}
                            className="px-2 py-1.5 rounded-lg border border-slate-200 hover:border-amber-400 bg-white hover:bg-amber-50/50 text-slate-600 hover:text-amber-700 font-bold text-[11px] transition-colors cursor-pointer flex items-center gap-1"
                            title="Waive penalty"
                          >
                            <ShieldAlert className="w-3 h-3" />
                            <span>Waive</span>
                          </button>
                        </div>
                      ) : item.status === 'Paid' ? (
                        <span className="text-[11px] text-emerald-600 font-bold inline-flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 stroke-[2.5]" />
                          <span>Paid ({item.paymentMethod || 'Cash'})</span>
                        </span>
                      ) : (
                        <span className="text-[11px] text-slate-400 font-semibold inline-flex items-center gap-1">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span>Waived</span>
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })
              )}
            </tbody>
          </table>
        </div>

        {/* 4. Interactive Pagination Controls */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span>Show</span>
            <select
              value={itemsPerPage}
              onChange={(e) => setItemsPerPage(Number(e.target.value))}
              className="px-2 py-1 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 bg-white focus:outline-none focus:border-purple-600 cursor-pointer"
            >
              <option value={5}>5</option>
              <option value={6}>6</option>
              <option value={8}>8</option>
              <option value={10}>10</option>
            </select>
            <span>
              Showing {totalItems > 0 ? startIndex + 1 : 0} to {endIndex} of {totalItems} fines
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className={`p-1.5 rounded-lg border text-xs font-semibold transition-colors ${
                currentPage <= 1
                  ? 'border-slate-100 text-slate-300 cursor-not-allowed'
                  : 'border-slate-200 text-slate-600 hover:bg-slate-50 cursor-pointer'
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => (
              <button
                key={pg}
                type="button"
                onClick={() => setCurrentPage(pg)}
                className={`w-7 h-7 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  currentPage === pg
                    ? 'bg-purple-600 text-white shadow-2xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {pg}
              </button>
            ))}

            <button
              type="button"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className={`p-1.5 rounded-lg border text-xs font-semibold transition-colors ${
                currentPage >= totalPages
                  ? 'border-slate-100 text-slate-300 cursor-not-allowed'
                  : 'border-slate-200 text-slate-600 hover:bg-slate-50 cursor-pointer'
              }`}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Settle Fine Interactive Modal */}
      {settlingFine && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl w-full max-w-md p-5 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Coins className="w-5 h-5 text-purple-600" />
                <h3 className="text-base font-bold text-slate-900">Settle Fine Payment</h3>
              </div>
              <button
                type="button"
                onClick={() => setSettlingFine(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSettleFineSubmit} className="mt-4 space-y-4">
              <div className="bg-purple-50/60 p-3.5 rounded-xl border border-purple-100 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-500 font-semibold block">Member</span>
                  <span className="text-sm font-bold text-slate-900">{settlingFine.memberName}</span>
                  <span className="text-xs text-slate-400 font-mono block mt-0.5">{settlingFine.membershipId}</span>
                  <span className="text-[11px] text-purple-700 font-medium block mt-1">{settlingFine.reason}</span>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-500 font-semibold block">Fine Due</span>
                  <span className="text-xl font-black text-purple-600">₹ {settlingFine.amount}</span>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Payment Method</label>
                <div className="grid grid-cols-3 gap-2">
                  {['Cash', 'UPI / Online', 'Card'].map((method) => (
                    <button
                      key={method}
                      type="button"
                      onClick={() => setPaymentMethod(method)}
                      className={`py-2 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                        paymentMethod === method
                          ? 'border-purple-600 bg-purple-50 text-purple-700'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {method}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    const target = settlingFine;
                    setSettlingFine(null);
                    setWaivingFine(target);
                  }}
                  className="px-3 py-2 rounded-xl text-xs font-bold text-amber-600 hover:bg-amber-50 border border-amber-200 transition-colors cursor-pointer"
                >
                  Waive Fine Instead
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setSettlingFine(null)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-sm transition-colors cursor-pointer"
                  >
                    Confirm & Settle (₹ {settlingFine.amount})
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Waive Fine Confirmation Modal */}
      {waivingFine && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl w-full max-w-sm p-5 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0">
                <ShieldAlert className="w-5 h-5 stroke-[2]" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Waive Penalty Fine?</h3>
                <p className="text-xs text-slate-500">Excusing penalty fee of ₹{waivingFine.amount}</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100 mb-4 leading-relaxed">
              Are you sure you want to waive the late fee of <strong>₹{waivingFine.amount}</strong> for member{' '}
              <strong>{waivingFine.memberName}</strong> ({waivingFine.membershipId})? This will mark the fine as Waived
              and clear member debt.
            </p>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setWaivingFine(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmWaive}
                className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
              >
                Confirm Waive
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
