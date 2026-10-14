import React, { useState } from 'react';
import {
  User,
  X,
  Edit,
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
} from 'lucide-react';

export default function MemberProfileModal({ isOpen, onClose, member, onEdit }) {
  const [activeTab, setActiveTab] = useState('Issue History'); // 'Issue History' | 'Fine History' | 'Personal Details'

  if (!isOpen || !member) return null;

  const isMemberActive = member.status === 'Active';

  // Sample issue history if not present
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
        { id: 1, reason: 'Late return fee (The Alchemist)', amount: 50, date: '25 Sep 2025', status: 'Pending' },
      ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl p-6 sm:p-7 w-full max-w-3xl shadow-2xl border border-slate-100 my-auto animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-[#0bad96] flex items-center justify-center">
              <User className="w-4 h-4 stroke-[2]" />
            </div>
            <h2 className="text-base font-bold text-slate-900">Member Profile</h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Top Info Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-50/70 border border-slate-100 mb-5">
          <div className="flex items-center gap-3.5">
            <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-emerald-500/20 shadow-xs flex-shrink-0 bg-white">
              <img
                src={member.avatarUrl}
                alt={member.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=256&q=80';
                }}
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black text-slate-900">{member.name}</h3>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    isMemberActive ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                  }`}
                >
                  {member.status}
                </span>
              </div>
              <p className="text-xs font-mono text-slate-500 mt-0.5">
                Member ID: <strong className="text-slate-800">{member.membershipId}</strong>
              </p>
              <p className="text-[11px] text-slate-400">
                Member since {member.joinDate}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              onClose();
              onEdit(member);
            }}
            className="px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-white text-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 shadow-2xs transition-colors cursor-pointer w-fit"
          >
            <Edit className="w-3.5 h-3.5 text-slate-500" />
            <span>Edit Member</span>
          </button>
        </div>

        {/* Middle: Contact Details (Left) + 4 Stats Badges (Right) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 mb-5 items-start">
          {/* Contact Details List */}
          <div className="md:col-span-6 space-y-2.5 text-xs text-slate-600">
            <div className="flex items-center gap-2.5">
              <Mail className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
              <span className="text-slate-400">Email:</span>
              <span className="font-semibold text-slate-800 truncate">{member.email}</span>
            </div>

            <div className="flex items-center gap-2.5">
              <Phone className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
              <span className="text-slate-400">Mobile:</span>
              <span className="font-semibold text-slate-800 font-mono">{member.mobile}</span>
            </div>

            <div className="flex items-start gap-2.5">
              <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0 mt-0.5" />
              <span className="text-slate-400">Address:</span>
              <span className="font-semibold text-slate-800 leading-tight">{member.address}</span>
            </div>

            <div className="flex items-center gap-2.5">
              <Calendar className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
              <span className="text-slate-400">Membership Date:</span>
              <span className="font-semibold text-slate-800">{member.joinDate}</span>
            </div>

            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
              <span className="text-slate-400">Status:</span>
              <span className="font-semibold text-slate-800">{member.status}</span>
            </div>
          </div>

          {/* Right 4 Stats Cards matching screenshot */}
          <div className="md:col-span-6 grid grid-cols-2 gap-2.5">
            {/* 1. Books Issued */}
            <div className="p-3 rounded-2xl bg-cyan-50/60 border border-cyan-100 flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-cyan-100 text-cyan-700 flex items-center justify-center flex-shrink-0">
                <BookOpen className="w-4 h-4 stroke-[2]" />
              </div>
              <div className="leading-tight">
                <div className="text-[10px] text-slate-500 font-medium">Books Issued</div>
                <div className="text-base font-black text-slate-900">{member.booksIssued ?? 5}</div>
              </div>
            </div>

            {/* 2. Books Returned */}
            <div className="p-3 rounded-2xl bg-emerald-50/60 border border-emerald-100 flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0">
                <RotateCcw className="w-4 h-4 stroke-[2]" />
              </div>
              <div className="leading-tight">
                <div className="text-[10px] text-slate-500 font-medium">Books Returned</div>
                <div className="text-base font-black text-slate-900">{member.booksReturned ?? 4}</div>
              </div>
            </div>

            {/* 3. Overdue Books */}
            <div className="p-3 rounded-2xl bg-red-50/60 border border-red-100 flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-red-100 text-red-600 flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-4 h-4 stroke-[2]" />
              </div>
              <div className="leading-tight">
                <div className="text-[10px] text-slate-500 font-medium">Overdue Books</div>
                <div className="text-base font-black text-slate-900">{member.overdueBooks ?? 1}</div>
              </div>
            </div>

            {/* 4. Total Fine */}
            <div className="p-3 rounded-2xl bg-amber-50/60 border border-amber-100 flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center flex-shrink-0">
                <Coins className="w-4 h-4 stroke-[2]" />
              </div>
              <div className="leading-tight">
                <div className="text-[10px] text-slate-500 font-medium">Total Fine</div>
                <div className="text-base font-black text-slate-900">₹ {member.totalFine ?? 50}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Tabs matching screenshot */}
        <div className="border-t border-slate-100 pt-4">
          <div className="flex items-center gap-2 mb-3 border-b border-slate-100 pb-2">
            {['Issue History', 'Fine History', 'Personal Details'].map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                  activeTab === tab
                    ? 'bg-[#0bad96] text-white shadow-2xs'
                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Tab 1: Issue History */}
          {activeTab === 'Issue History' && (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 font-semibold text-[11px]">
                    <th className="py-2 px-2.5">#</th>
                    <th className="py-2 px-2.5">Book Title</th>
                    <th className="py-2 px-2.5">Issue Date</th>
                    <th className="py-2 px-2.5">Due Date</th>
                    <th className="py-2 px-2.5">Return Date</th>
                    <th className="py-2 px-2.5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 text-slate-700">
                  {issueHistory.map((row, idx) => (
                    <tr key={row.id || idx} className="hover:bg-slate-50/60">
                      <td className="py-2 px-2.5 text-slate-400">{idx + 1}</td>
                      <td className="py-2 px-2.5 font-bold text-slate-900">{row.bookTitle}</td>
                      <td className="py-2 px-2.5 font-mono text-[11px] text-slate-500">{row.issueDate}</td>
                      <td className="py-2 px-2.5 font-mono text-[11px] text-slate-500">{row.dueDate}</td>
                      <td className="py-2 px-2.5 font-mono text-[11px] text-slate-500">{row.returnDate}</td>
                      <td className="py-2 px-2.5">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            row.status === 'Issued'
                              ? 'bg-blue-50 text-blue-600'
                              : row.status === 'Returned'
                              ? 'bg-emerald-50 text-emerald-600'
                              : 'bg-red-50 text-red-600'
                          }`}
                        >
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Tab 2: Fine History */}
          {activeTab === 'Fine History' && (
            <div className="p-3 text-xs">
              {fineHistory.length === 0 ? (
                <div className="text-center py-6 text-slate-400">No fine history for this member.</div>
              ) : (
                <div className="space-y-2">
                  {fineHistory.map((f, i) => (
                    <div
                      key={f.id || i}
                      className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100"
                    >
                      <div>
                        <div className="font-bold text-slate-800">{f.reason}</div>
                        <div className="text-[10px] text-slate-400">{f.date}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-slate-900">₹ {f.amount}</div>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            f.status === 'Paid' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                          }`}
                        >
                          {f.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Tab 3: Personal Details */}
          {activeTab === 'Personal Details' && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3 text-xs bg-slate-50/50 rounded-2xl border border-slate-100">
              <div>
                <span className="text-slate-400 block text-[10px]">Membership Tier</span>
                <strong className="text-slate-800">Standard Member</strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Max Borrow Limit</span>
                <strong className="text-slate-800">5 Books</strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Account Created</span>
                <strong className="text-slate-800">{member.joinDate}</strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Verification</span>
                <strong className="text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Verified ID
                </strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Preferred Branch</span>
                <strong className="text-slate-800">Central Library</strong>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
