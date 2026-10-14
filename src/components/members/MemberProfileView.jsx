import React, { useState } from 'react';
import {
  ArrowLeft,
  User,
  Edit,
  Trash2,
  Mail,
  Phone,
  MapPin,
  Calendar,
  BookOpen,
  RotateCcw,
  AlertTriangle,
  Coins,
  ShieldCheck,
  CheckCircle2,
  Copy,
  Check,
  CreditCard,
  Barcode,
  Sparkles,
} from 'lucide-react';
import { toast } from 'react-toastify';
import { useMembers } from '../../context/MemberContext';
import { useBooks } from '../../context/BookContext';

export default function MemberProfileView({ member, onBack, onEdit, onDelete }) {
  const { settleMemberFine, returnMemberBook } = useMembers();
  const { books, returnBookCopy } = useBooks();
  const [activeTab, setActiveTab] = useState('Issue History');
  const [copiedEmail, setCopiedEmail] = useState(false);

  if (!member) return null;

  const isMemberActive = member.status === 'Active';

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(member.email);
    setCopiedEmail(true);
    toast.info('Email copied to clipboard!');
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const handleSettleFine = async () => {
    await settleMemberFine(member.id);
  };

  const handleReturnBook = async (issueId) => {
    const loan = (member.issueHistory || []).find((i) => i.id === issueId);
    if (loan) {
      const targetBook = books.find(
        (b) =>
          b.title?.toLowerCase().trim() === loan.bookTitle?.toLowerCase().trim() ||
          String(b.id) === String(loan.bookId)
      );
      if (targetBook) {
        await returnBookCopy(targetBook.id);
      }
    }
    await returnMemberBook(member.id, issueId);
  };

  const issueHistory = member.issueHistory?.length
    ? member.issueHistory
    : [
        { id: 1, bookTitle: 'Atomic Habits', issueDate: '01 Oct 2025', dueDate: '15 Oct 2025', returnDate: '-', status: 'Issued' },
        { id: 2, bookTitle: 'Clean Code', issueDate: '20 Sep 2025', dueDate: '04 Oct 2025', returnDate: '04 Oct 2025', status: 'Returned' },
        { id: 3, bookTitle: 'The Alchemist', issueDate: '10 Sep 2025', dueDate: '24 Sep 2025', returnDate: '-', status: 'Overdue' },
      ];

  const fineHistory = member.fineHistory?.length
    ? member.fineHistory
    : [
        { id: 1, reason: 'Late return fee (The Alchemist)', amount: 50, date: '25 Sep 2025', status: member.totalFine > 0 ? 'Pending' : 'Paid' },
      ];

  return (
    <div className="space-y-4 max-w-[1520px] mx-auto select-none animate-in fade-in duration-150">
      {/* 1. Header Navigation & Quick Actions Bar */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-100 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          {/* Breadcrumb & Back */}
          <div className="flex items-center gap-2 text-xs mb-1.5">
            <button
              type="button"
              onClick={onBack}
              className="inline-flex items-center gap-1.5 font-bold text-slate-500 hover:text-[#0bad96] transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Back to Members</span>
            </button>
            <span className="text-slate-300">/</span>
            <span className="text-slate-400 font-medium">Member Profile</span>
            <span className="text-slate-300">/</span>
            <span className="text-[#0bad96] font-semibold truncate max-w-[200px]">{member.name}</span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {member.name}
            </h1>
            <span
              className={`px-3 py-0.5 rounded-full text-xs font-bold ${
                isMemberActive
                  ? 'bg-emerald-50 text-emerald-600 border border-emerald-200/60'
                  : 'bg-amber-50 text-amber-600 border border-amber-200/60'
              }`}
            >
              {member.status}
            </span>
            <span className="text-xs font-mono font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">
              {member.membershipId}
            </span>
          </div>
        </div>

        {/* Action Buttons: Edit, Settle Fines, Delete */}
        <div className="flex flex-wrap items-center gap-2">
          {member.totalFine > 0 && (
            <button
              type="button"
              onClick={handleSettleFine}
              className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
            >
              <Coins className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Settle Fine (₹{member.totalFine})</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => onEdit(member)}
            className="px-3.5 py-2 rounded-xl bg-[#0bad96] hover:bg-[#099884] active:bg-[#077d6d] text-white font-bold text-xs flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
          >
            <Edit className="w-3.5 h-3.5" />
            <span>Edit Profile</span>
          </button>

          <button
            type="button"
            onClick={() => onDelete(member)}
            className="px-3.5 py-2 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5 text-red-500" />
            <span>Delete</span>
          </button>
        </div>
      </div>

      {/* 2. Top Metric Stats Row (Full Width - 4 Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Card 1: Books Issued */}
        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-2xs flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-cyan-50 text-cyan-600 flex items-center justify-center flex-shrink-0">
            <BookOpen className="w-6 h-6 stroke-[2]" />
          </div>
          <div className="leading-tight">
            <div className="text-xs text-slate-500 font-semibold">Books Issued</div>
            <div className="text-2xl font-black text-slate-900 mt-0.5">{member.booksIssued ?? 5}</div>
            <div className="text-[10px] text-cyan-600 font-bold mt-0.5">Currently borrowed</div>
          </div>
        </div>

        {/* Card 2: Books Returned */}
        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-2xs flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
            <RotateCcw className="w-6 h-6 stroke-[2]" />
          </div>
          <div className="leading-tight">
            <div className="text-xs text-slate-500 font-semibold">Books Returned</div>
            <div className="text-2xl font-black text-slate-900 mt-0.5">{member.booksReturned ?? 4}</div>
            <div className="text-[10px] text-emerald-600 font-bold mt-0.5">Lifetime returns</div>
          </div>
        </div>

        {/* Card 3: Overdue Books */}
        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-2xs flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="w-6 h-6 stroke-[2]" />
          </div>
          <div className="leading-tight">
            <div className="text-xs text-slate-500 font-semibold">Overdue Books</div>
            <div className="text-2xl font-black text-slate-900 mt-0.5">{member.overdueBooks ?? 1}</div>
            <div className="text-[10px] text-red-500 font-bold mt-0.5">Pending returns</div>
          </div>
        </div>

        {/* Card 4: Total Fine */}
        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-2xs flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0">
            <Coins className="w-6 h-6 stroke-[2]" />
          </div>
          <div className="leading-tight">
            <div className="text-xs text-slate-500 font-semibold">Total Fine</div>
            <div className="text-2xl font-black text-slate-900 mt-0.5">₹ {member.totalFine ?? 50}</div>
            <div className="text-[10px] text-amber-600 font-bold mt-0.5">
              {member.totalFine > 0 ? 'Payment required' : 'All clear'}
            </div>
          </div>
        </div>
      </div>

      {/* 3. Main Content Split: Left (Profile & Contact) vs Right (Interactive Tabs & History) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* Left Column (4 cols): Profile Card & Verification */}
        <div className="lg:col-span-4 space-y-4">
          {/* Avatar Card */}
          <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-2xs flex flex-col items-center text-center">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-3 border-emerald-500/30 p-1 shadow-md bg-white">
              <img
                src={member.avatarUrl}
                alt={member.name}
                className="w-full h-full object-cover rounded-full"
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=256&q=80';
                }}
              />
            </div>
            <h2 className="text-base font-black text-slate-900 mt-3">{member.name}</h2>
            <p className="text-xs font-mono text-[#0bad96] font-bold mt-0.5">{member.membershipId}</p>
            <p className="text-[11px] text-slate-400 font-medium">Member since {member.joinDate}</p>
          </div>

          {/* Contact Details Card */}
          <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-2xs space-y-3 text-xs">
            <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px] pb-2 border-b border-slate-100">
              Contact & Membership Info
            </h4>

            <div className="flex items-center justify-between gap-2">
              <span className="text-slate-400 font-medium flex items-center gap-2">
                <Mail className="w-3.5 h-3.5" /> Email
              </span>
              <div className="flex items-center gap-1 font-bold text-slate-800 truncate max-w-[170px]">
                <span className="truncate">{member.email}</span>
                <button
                  type="button"
                  onClick={handleCopyEmail}
                  className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-[#0bad96] flex-shrink-0"
                >
                  {copiedEmail ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-400 font-medium flex items-center gap-2">
                <Phone className="w-3.5 h-3.5" /> Mobile
              </span>
              <span className="font-mono font-bold text-slate-800">{member.mobile}</span>
            </div>

            <div className="flex items-start justify-between gap-3">
              <span className="text-slate-400 font-medium flex items-center gap-2 flex-shrink-0">
                <MapPin className="w-3.5 h-3.5" /> Address
              </span>
              <span className="font-semibold text-slate-700 text-right text-[11px] leading-tight">
                {member.address}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-400 font-medium flex items-center gap-2">
                <Barcode className="w-3.5 h-3.5" /> RFID Tag
              </span>
              <span className="font-mono text-emerald-600 font-bold">RFID-{member.membershipId}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-400 font-medium flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5" /> Verification
              </span>
              <span className="text-emerald-600 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Verified Member
              </span>
            </div>
          </div>
        </div>

        {/* Right Column (8 cols): Interactive Tabs & Loan Tables */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-2xs overflow-hidden">
            {/* Tabs Header */}
            <div className="p-4 border-b border-slate-100 flex items-center gap-2 bg-slate-50/50">
              {['Issue History', 'Fine History', 'Personal Details'].map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                    activeTab === tab
                      ? 'bg-[#0bad96] text-white shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Tab 1: Issue History Table */}
            {activeTab === 'Issue History' && (
              <div className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-100 bg-slate-50/50 text-slate-500 font-semibold text-[11px]">
                        <th className="py-3 px-4 w-12 text-center">#</th>
                        <th className="py-3 px-4">Book Title</th>
                        <th className="py-3 px-4">Issue Date</th>
                        <th className="py-3 px-4">Due Date</th>
                        <th className="py-3 px-4">Return Date</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      {issueHistory.map((row, idx) => (
                        <tr key={row.id || idx} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-3 px-4 text-center text-slate-400 font-bold">{idx + 1}</td>
                          <td className="py-3 px-4 font-bold text-slate-900">{row.bookTitle}</td>
                          <td className="py-3 px-4 font-mono text-[11px] text-slate-500">{row.issueDate}</td>
                          <td className="py-3 px-4 font-mono text-[11px] text-slate-500">{row.dueDate}</td>
                          <td className="py-3 px-4 font-mono text-[11px] text-slate-500">{row.returnDate}</td>
                          <td className="py-3 px-4">
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                                row.status === 'Issued'
                                  ? 'bg-blue-50 text-blue-600 border border-blue-100'
                                  : row.status === 'Returned'
                                  ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                                  : 'bg-red-50 text-red-600 border border-red-100'
                              }`}
                            >
                              {row.status}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-center">
                            {row.status !== 'Returned' ? (
                              <button
                                type="button"
                                onClick={() => handleReturnBook(row.id)}
                                className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-[11px] transition-colors cursor-pointer"
                              >
                                Return Book
                              </button>
                            ) : (
                              <span className="text-[11px] text-slate-400 font-medium">Completed</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Tab 2: Fine History */}
            {activeTab === 'Fine History' && (
              <div className="p-5">
                {fineHistory.length === 0 ? (
                  <div className="text-center py-8 text-slate-400 text-xs">No pending or past fines.</div>
                ) : (
                  <div className="space-y-3">
                    {fineHistory.map((f, i) => (
                      <div
                        key={f.id || i}
                        className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-100"
                      >
                        <div>
                          <div className="font-bold text-slate-900 text-xs">{f.reason}</div>
                          <div className="text-[11px] text-slate-400 mt-0.5">{f.date}</div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <div className="font-black text-slate-900 text-sm">₹ {f.amount}</div>
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-block mt-0.5 ${
                                f.status === 'Paid'
                                  ? 'bg-emerald-50 text-emerald-600'
                                  : 'bg-amber-50 text-amber-600'
                              }`}
                            >
                              {f.status}
                            </span>
                          </div>
                          {f.status !== 'Paid' && (
                            <button
                              type="button"
                              onClick={handleSettleFine}
                              className="px-3 py-1.5 rounded-lg bg-[#0bad96] hover:bg-[#099884] text-white font-bold text-xs cursor-pointer"
                            >
                              Pay Now
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Tab 3: Personal Details */}
            {activeTab === 'Personal Details' && (
              <div className="p-5 grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs bg-slate-50/50">
                <div className="p-3 bg-white rounded-xl border border-slate-100">
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">Membership Tier</span>
                  <strong className="text-slate-800 text-xs mt-1 block">Premium Reader</strong>
                </div>
                <div className="p-3 bg-white rounded-xl border border-slate-100">
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">Max Borrow Limit</span>
                  <strong className="text-slate-800 text-xs mt-1 block">5 Books Simultaneously</strong>
                </div>
                <div className="p-3 bg-white rounded-xl border border-slate-100">
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">Joined Date</span>
                  <strong className="text-slate-800 text-xs mt-1 block">{member.joinDate}</strong>
                </div>
                <div className="p-3 bg-white rounded-xl border border-slate-100">
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">Verification</span>
                  <strong className="text-emerald-600 flex items-center gap-1 text-xs mt-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> ID Verified
                  </strong>
                </div>
                <div className="p-3 bg-white rounded-xl border border-slate-100">
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">Preferred Branch</span>
                  <strong className="text-slate-800 text-xs mt-1 block">Central Library Branch</strong>
                </div>
                <div className="p-3 bg-white rounded-xl border border-slate-100">
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">Card Status</span>
                  <strong className="text-emerald-600 text-xs mt-1 block">RFID Enabled</strong>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
