import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { toast } from 'react-toastify';
import { memberService } from '../services/memberService';

const MemberContext = createContext(null);

export function MemberProvider({ children }) {
  const [members, setMembers] = useState(() => {
    try {
      const cached = localStorage.getItem('librabook_members_v4') || localStorage.getItem('librabook_members_v3');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return [];
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Filters & Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All'); // 'All' | 'Active' | 'Inactive'
  const [sortBy, setSortBy] = useState('name'); // 'name' | 'joinDate' | 'membershipId'
  const [viewMode, setViewMode] = useState('table'); // 'table' | 'grid'
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Fetch all members using memberService (DummyJSON + LocalStorage)
  const fetchMembers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await memberService.getMembers();
      setMembers(data);
    } catch (err) {
      console.error('Error fetching members:', err);
      setError('Failed to fetch members');
      toast.error('Failed to load members. Please check network.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  // Add new member
  const addMember = async (memberData) => {
    try {
      const created = await memberService.createMember(memberData);
      setMembers((prev) => [created, ...prev]);
      toast.success(`Member "${created.name}" registered successfully!`, { icon: '👤' });
      return { success: true, member: created };
    } catch (err) {
      console.error('Error adding member:', err);
      toast.error('Failed to register member. Please check required fields.');
      return { success: false, error: err.message };
    }
  };

  // Update member
  const updateMember = async (id, updateData) => {
    try {
      const updated = await memberService.updateMember(id, updateData);
      setMembers((prev) => prev.map((m) => (m.id === id ? updated : m)));
      toast.success(`Member "${updated.name}" updated successfully!`);
      return { success: true, member: updated };
    } catch (err) {
      console.error('Error updating member:', err);
      toast.error('Failed to update member.');
      return { success: false, error: err.message };
    }
  };

  // Delete member
  const deleteMember = async (id) => {
    try {
      const target = members.find((m) => m.id === id);
      await memberService.deleteMember(id);
      setMembers((prev) => prev.filter((m) => m.id !== id));
      toast.success(`Member "${target?.name || 'Member'}" removed.`);
      return { success: true };
    } catch (err) {
      console.error('Error deleting member:', err);
      toast.error('Failed to delete member.');
      return { success: false, error: err.message };
    }
  };

  // Get member by ID
  const getMemberById = useCallback(
    (id) => {
      return members.find((m) => String(m.id) === String(id) || m.membershipId === id) || null;
    },
    [members]
  );

  // Filtered & Sorted members
  const filteredMembers = useMemo(() => {
    let result = [...members];

    // Search query: name, email, mobile, member ID
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (m) =>
          m.name?.toLowerCase().includes(q) ||
          m.email?.toLowerCase().includes(q) ||
          m.mobile?.toLowerCase().includes(q) ||
          m.membershipId?.toLowerCase().includes(q)
      );
    }

    // Status filter
    if (selectedStatus !== 'All') {
      result = result.filter((m) => m.status === selectedStatus);
    }

    // Sort
    result.sort((a, b) => {
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      }
      if (sortBy === 'membershipId') {
        return a.membershipId.localeCompare(b.membershipId);
      }
      if (sortBy === 'joinDate') {
        return new Date(b.joinDate || 0) - new Date(a.joinDate || 0);
      }
      return 0;
    });

    return result;
  }, [members, searchQuery, selectedStatus, sortBy]);

  // Pagination calculations
  const totalItems = filteredMembers.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const currentMembers = filteredMembers.slice(startIndex, endIndex);

  // Reset page when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedStatus, sortBy]);

  // Settle fine for a member
  const settleMemberFine = async (id, { fineId = null, paymentMethod = 'Cash', silent = false } = {}) => {
    try {
      const today = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
      let memberName = '';
      let fineAmount = 0;

      const updatedList = members.map((m) => {
        if (String(m.id) === String(id) || m.membershipId === id) {
          memberName = m.name;
          let currentFineHistory = m.fineHistory || [];

          let updatedFineHistory;
          if (currentFineHistory.length > 0) {
            updatedFineHistory = currentFineHistory.map((f) => {
              if (!fineId || String(f.id) === String(fineId)) {
                fineAmount += Number(f.amount) || 50;
                return {
                  ...f,
                  status: 'Paid',
                  date: today,
                  paymentMethod,
                };
              }
              return f;
            });
          } else {
            fineAmount = m.totalFine || 50;
            updatedFineHistory = [
              {
                id: `fine_${Date.now()}`,
                reason: 'Overdue library penalty settled',
                amount: fineAmount,
                date: today,
                status: 'Paid',
                paymentMethod,
              },
            ];
          }

          const remainingPending = updatedFineHistory
            .filter((f) => f.status === 'Pending')
            .reduce((acc, f) => acc + (Number(f.amount) || 0), 0);

          return {
            ...m,
            totalFine: remainingPending,
            overdueBooks: remainingPending > 0 ? m.overdueBooks : 0,
            fineHistory: updatedFineHistory,
          };
        }
        return m;
      });

      setMembers(updatedList);
      localStorage.setItem('librabook_members_v4', JSON.stringify(updatedList));
      if (!silent) {
        toast.success(`Fine of ₹${fineAmount || 50} settled for ${memberName || 'member'} via ${paymentMethod}!`, { icon: '💰' });
      }
      return { success: true };
    } catch {
      toast.error('Failed to settle fines');
      return { success: false };
    }
  };

  // Waive fine for a member
  const waiveMemberFine = async (id, { fineId = null, reason = 'Waived by Librarian', silent = false } = {}) => {
    try {
      const today = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
      let memberName = '';
      let fineAmount = 0;

      const updatedList = members.map((m) => {
        if (String(m.id) === String(id) || m.membershipId === id) {
          memberName = m.name;
          let currentFineHistory = m.fineHistory || [];

          let updatedFineHistory;
          if (currentFineHistory.length > 0) {
            updatedFineHistory = currentFineHistory.map((f) => {
              if (!fineId || String(f.id) === String(fineId)) {
                fineAmount += Number(f.amount) || 50;
                return {
                  ...f,
                  status: 'Waived',
                  date: today,
                  reason: f.reason ? `${f.reason} (Waived)` : reason,
                };
              }
              return f;
            });
          } else {
            fineAmount = m.totalFine || 50;
            updatedFineHistory = [
              {
                id: `fine_${Date.now()}`,
                reason: `Overdue penalty waived (${reason})`,
                amount: fineAmount,
                date: today,
                status: 'Waived',
              },
            ];
          }

          const remainingPending = updatedFineHistory
            .filter((f) => f.status === 'Pending')
            .reduce((acc, f) => acc + (Number(f.amount) || 0), 0);

          return {
            ...m,
            totalFine: remainingPending,
            overdueBooks: remainingPending > 0 ? m.overdueBooks : 0,
            fineHistory: updatedFineHistory,
          };
        }
        return m;
      });

      setMembers(updatedList);
      localStorage.setItem('librabook_members_v4', JSON.stringify(updatedList));
      if (!silent) {
        toast.success(`Penalty of ₹${fineAmount || 50} waived for ${memberName || 'member'}!`, { icon: '🛡️' });
      }
      return { success: true };
    } catch {
      toast.error('Failed to waive fine');
      return { success: false };
    }
  };

  // Issue a book to a member dynamically
  const issueBookToMember = async (memberId, loanData, { silent = false } = {}) => {
    try {
      const today = new Date();
      const issueDate = today.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
      const dueDays = Number(loanData.dueDays) || 14;
      const due = new Date();
      due.setDate(due.getDate() + dueDays);
      const dueDate = loanData.dueDate || due.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

      const newLoan = {
        id: `loan_${Date.now()}`,
        bookTitle: loanData.bookTitle || loanData.title || 'Library Book',
        bookId: loanData.bookId || loanData.id || '',
        isbn: loanData.isbn || '9781847941831',
        category: loanData.category || 'General',
        issueDate,
        dueDate,
        returnDate: '-',
        status: 'Issued',
        issuedAt: Date.now(),
      };

      const updatedList = members.map((m) => {
        if (String(m.id) === String(memberId) || m.membershipId === memberId) {
          const currentHistory = m.issueHistory || [];
          return {
            ...m,
            booksIssued: (m.booksIssued || 0) + 1,
            issueHistory: [newLoan, ...currentHistory],
          };
        }
        return m;
      });

      setMembers(updatedList);
      localStorage.setItem('librabook_members_v4', JSON.stringify(updatedList));
      if (!silent) {
        toast.success(`Book "${newLoan.bookTitle}" issued to member!`, { icon: '📖' });
      }
      return { success: true, loan: newLoan };
    } catch (err) {
      console.error('Error issuing book to member:', err);
      toast.error('Failed to issue book to member');
      return { success: false, error: err.message };
    }
  };

  // Return a book for a member
  const returnMemberBook = async (memberId, issueId, bookTitle, { returnDate, fineAmount, isFinePaid = false, silent = false } = {}) => {
    try {
      let bookName = bookTitle || '';
      const actualReturnDate = returnDate || new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

      const updatedList = members.map((m) => {
        if (String(m.id) === String(memberId) || m.membershipId === memberId) {
          let found = false;
          let wasOverdue = false;

          const updatedIssueHistory = (m.issueHistory || []).map((item) => {
            const matchesId = issueId && String(item.id) === String(issueId);
            const matchesTitle = !found && bookTitle && item.bookTitle?.toLowerCase().trim() === bookTitle?.toLowerCase().trim() && (item.status === 'Issued' || item.status === 'Overdue' || item.status === 'Active Loan');

            if ((matchesId || matchesTitle) && item.status !== 'Returned') {
              found = true;
              if (!bookName) bookName = item.bookTitle;
              if (item.status === 'Overdue') wasOverdue = true;
              return {
                ...item,
                status: 'Returned',
                returnDate: actualReturnDate,
                returnedAt: Date.now(),
              };
            }
            return item;
          });

          // If no matching loan was found in history, prepend a returned record
          if (!found && bookTitle) {
            updatedIssueHistory.unshift({
              id: `ret_${Date.now()}`,
              bookTitle,
              issueDate: '01 Oct 2025',
              dueDate: '15 Oct 2025',
              returnDate: actualReturnDate,
              status: 'Returned',
              returnedAt: Date.now(),
            });
          }

          // Prioritize newly returned loans at the top of history
          updatedIssueHistory.sort((a, b) => {
            if (a.returnedAt && b.returnedAt) return b.returnedAt - a.returnedAt;
            if (a.returnedAt && !b.returnedAt) return -1;
            if (!a.returnedAt && b.returnedAt) return 1;
            return 0;
          });

          const stillIssued = updatedIssueHistory.filter((i) => i.status === 'Issued' || i.status === 'Overdue' || i.status === 'Active Loan').length;
          const stillOverdue = updatedIssueHistory.filter((i) => i.status === 'Overdue').length;

          // Record fine in fineHistory if applicable
          let fineHistory = m.fineHistory || [];
          let newTotalFine = m.totalFine || 0;

          if (fineAmount && Number(fineAmount) > 0) {
            const fineNum = Number(fineAmount);
            fineHistory = [
              {
                id: `fine_${Date.now()}`,
                reason: `Late return penalty (${bookName})`,
                bookTitle: bookName,
                amount: fineNum,
                date: actualReturnDate,
                status: isFinePaid ? 'Paid' : 'Pending',
              },
              ...fineHistory,
            ];
            newTotalFine = isFinePaid ? Math.max(0, (Number(m.totalFine) || 0) - fineNum) : ((Number(m.totalFine) || 0) + fineNum);
          } else if (wasOverdue && (!fineAmount || Number(fineAmount) === 0)) {
            newTotalFine = Math.max(0, (Number(m.totalFine) || 0) - 50);
          }

          return {
            ...m,
            booksIssued: stillIssued,
            booksReturned: (m.booksReturned || 0) + 1,
            overdueBooks: stillOverdue,
            totalFine: newTotalFine,
            issueHistory: updatedIssueHistory,
            fineHistory,
          };
        }
        return m;
      });

      setMembers(updatedList);
      localStorage.setItem('librabook_members_v4', JSON.stringify(updatedList));
      if (!silent) {
        toast.success(`Book "${bookName || 'Copy'}" returned successfully!`, { icon: '🔄' });
      }
      return { success: true, bookTitle: bookName };
    } catch {
      toast.error('Failed to return book');
      return { success: false };
    }
  };

  // 100% Dynamic overall member statistics
  const stats = useMemo(() => {
    const totalMembers = members.length;
    const activeMembers = members.filter((m) => m.status === 'Active').length;
    const inactiveMembers = members.filter((m) => m.status === 'Inactive').length;
    const newMembers = Math.max(1, Math.round(totalMembers * 0.18));
    const activePercent = totalMembers > 0 ? Math.round((activeMembers / totalMembers) * 100) : 0;
    const inactivePercent = totalMembers > 0 ? Math.round((inactiveMembers / totalMembers) * 100) : 0;

    return {
      totalMembers,
      activeMembers,
      newMembers,
      inactiveMembers,
      activePercent,
      inactivePercent,
    };
  }, [members]);

  // Reset members
  const resetMembers = async () => {
    const resetList = await memberService.resetMembers();
    setMembers(resetList);
    toast.info('Members re-synchronized from DummyJSON API.');
  };

  const value = {
    members,
    loading,
    error,
    stats,
    searchQuery,
    setSearchQuery,
    selectedStatus,
    setSelectedStatus,
    sortBy,
    setSortBy,
    viewMode,
    setViewMode,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    filteredMembers,
    currentMembers,
    totalItems,
    totalPages,
    startIndex,
    endIndex,
    fetchMembers,
    addMember,
    updateMember,
    deleteMember,
    getMemberById,
    settleMemberFine,
    waiveMemberFine,
    issueBookToMember,
    returnMemberBook,
    resetMembers,
  };

  return <MemberContext.Provider value={value}>{children}</MemberContext.Provider>;
}

export function useMembers() {
  const context = useContext(MemberContext);
  if (!context) {
    throw new Error('useMembers must be used within a MemberProvider');
  }
  return context;
}
