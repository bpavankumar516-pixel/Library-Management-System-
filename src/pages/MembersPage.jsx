import React, { useState } from 'react';
import {
  Users,
  UserPlus,
  UserCheck,
  UserX,
  Plus,
  Search,
  LayoutGrid,
  List,
  Eye,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  TrendingDown,
  BookOpen,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import { useMembers } from '../context/MemberContext';
import MemberFormModal from '../components/members/MemberFormModal';
import MemberProfileView from '../components/members/MemberProfileView';
import DeleteMemberModal from '../components/members/DeleteMemberModal';

export default function MembersPage() {
  const {
    members,
    loading,
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
    filteredMembers,
    currentMembers,
    totalItems,
    totalPages,
    startIndex,
    endIndex,
    addMember,
    updateMember,
    deleteMember,
  } = useMembers();

  // Active Modals & Views
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [viewingMember, setViewingMember] = useState(null);
  const [deletingMember, setDeletingMember] = useState(null);

  // Sync viewingMember if members list updates
  React.useEffect(() => {
    if (viewingMember) {
      const refreshed = members.find((m) => m.id === viewingMember.id);
      if (refreshed) {
        setViewingMember(refreshed);
      }
    }
  }, [members, viewingMember]);

  const handleAddSubmit = async (data) => {
    await addMember(data);
  };

  const handleEditSubmit = async (data) => {
    if (!editingMember) return;
    const res = await updateMember(editingMember.id, data);
    if (res.success && viewingMember?.id === editingMember.id) {
      setViewingMember(res.member);
    }
    setEditingMember(null);
  };

  const handleDeleteConfirm = async (member) => {
    const res = await deleteMember(member.id);
    if (res.success) {
      if (viewingMember?.id === member.id) {
        setViewingMember(null);
      }
      setDeletingMember(null);
    }
  };

  // Full-page View Profile mode
  if (viewingMember) {
    return (
      <div className="space-y-4 max-w-[1520px] mx-auto select-none">
        <MemberProfileView
          member={viewingMember}
          onBack={() => setViewingMember(null)}
          onEdit={(m) => setEditingMember(m)}
          onDelete={(m) => setDeletingMember(m)}
        />

        {/* Edit Member Modal */}
        <MemberFormModal
          isOpen={Boolean(editingMember)}
          onClose={() => setEditingMember(null)}
          onSubmit={handleEditSubmit}
          initialMember={editingMember}
        />

        {/* Delete Member Confirmation Modal */}
        <DeleteMemberModal
          isOpen={Boolean(deletingMember)}
          onClose={() => setDeletingMember(null)}
          onConfirm={handleDeleteConfirm}
          member={deletingMember}
        />
      </div>
    );
  }

  return (
    <div className="space-y-4 max-w-[1520px] mx-auto select-none">
      {/* 1. Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-[#0bad96] flex items-center justify-center flex-shrink-0 shadow-2xs">
            <Users className="w-5 h-5 stroke-[2]" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Members Management
            </h1>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Manage library members, add new members, and keep track of their membership details.
            </p>
          </div>
        </div>

        {/* + Add New Member Button */}
        <button
          type="button"
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-[#0bad96] hover:bg-[#099884] active:bg-[#077d6d] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer w-fit"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Add New Member</span>
        </button>
      </div>

      {/* 2. Top 4 Stat Cards matching screenshot with watermark */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Card 1: Total Members */}
        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-2xs relative overflow-hidden flex flex-col justify-between group hover:shadow-md transition-shadow">
          <BookOpen className="w-20 h-20 text-slate-100/70 absolute -right-3 -bottom-3 stroke-[1] pointer-events-none group-hover:scale-105 transition-transform" />
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#0bad96] flex items-center justify-center flex-shrink-0">
              <Users className="w-5 h-5 stroke-[2]" />
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-500">Total Members</div>
              <div className="text-2xl font-black text-slate-900 leading-tight mt-0.5">
                {stats.totalMembers}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 mt-3 pt-2 border-t border-slate-50">
            <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>12% from last month</span>
          </div>
        </div>

        {/* Card 2: Active Members */}
        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-2xs relative overflow-hidden flex flex-col justify-between group hover:shadow-md transition-shadow">
          <BookOpen className="w-20 h-20 text-slate-100/70 absolute -right-3 -bottom-3 stroke-[1] pointer-events-none group-hover:scale-105 transition-transform" />
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center flex-shrink-0">
              <UserCheck className="w-5 h-5 stroke-[2]" />
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-500">Active Members</div>
              <div className="text-2xl font-black text-slate-900 leading-tight mt-0.5">
                {stats.activeMembers}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 mt-3 pt-2 border-t border-slate-50">
            <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>8% from last month</span>
          </div>
        </div>

        {/* Card 3: New Members */}
        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-2xs relative overflow-hidden flex flex-col justify-between group hover:shadow-md transition-shadow">
          <BookOpen className="w-20 h-20 text-slate-100/70 absolute -right-3 -bottom-3 stroke-[1] pointer-events-none group-hover:scale-105 transition-transform" />
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
              <Plus className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-500">New Members</div>
              <div className="text-2xl font-black text-slate-900 leading-tight mt-0.5">
                {stats.newMembers}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 mt-3 pt-2 border-t border-slate-50">
            <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>20% this month</span>
          </div>
        </div>

        {/* Card 4: Inactive Members */}
        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-2xs relative overflow-hidden flex flex-col justify-between group hover:shadow-md transition-shadow">
          <BookOpen className="w-20 h-20 text-slate-100/70 absolute -right-3 -bottom-3 stroke-[1] pointer-events-none group-hover:scale-105 transition-transform" />
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-50 text-red-500 flex items-center justify-center flex-shrink-0">
              <UserX className="w-5 h-5 stroke-[2]" />
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-500">Inactive Members</div>
              <div className="text-2xl font-black text-slate-900 leading-tight mt-0.5">
                {stats.inactiveMembers}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1 text-[11px] font-bold text-red-500 mt-3 pt-2 border-t border-slate-50">
            <ArrowDownRight className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>5% from last month</span>
          </div>
        </div>
      </div>

      {/* 3. Filter & Controls Bar matching screenshot */}
      <div className="bg-white rounded-2xl p-3 sm:p-3.5 border border-slate-100 shadow-2xs flex flex-col lg:flex-row items-center justify-between gap-3">
        {/* Search input with icons */}
        <div className="relative w-full lg:max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, email, mobile, or member ID..."
            className="w-full pl-9 pr-9 py-2 text-xs bg-slate-50 hover:bg-slate-100/60 focus:bg-white border border-slate-200/70 rounded-xl focus:outline-none focus:border-[#0bad96] transition-all text-slate-800 placeholder-slate-400"
          />
          <Search className="w-3.5 h-3.5 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* Status Dropdown, Sort Dropdown & View Mode Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto justify-end">
          {/* Status Dropdown */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 text-xs font-medium text-slate-700 bg-slate-50 hover:bg-slate-100/60 border border-slate-200/70 rounded-xl focus:outline-none focus:border-[#0bad96] cursor-pointer"
          >
            <option value="All">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>

          {/* Sort Dropdown */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 text-xs font-medium text-slate-700 bg-slate-50 hover:bg-slate-100/60 border border-slate-200/70 rounded-xl focus:outline-none focus:border-[#0bad96] cursor-pointer"
          >
            <option value="name">Sort by Name</option>
            <option value="membershipId">Sort by Member ID</option>
            <option value="joinDate">Sort by Join Date</option>
          </select>

          {/* View Mode Toggle: Grid vs Table */}
          <div className="flex items-center gap-1 p-1 bg-slate-100/80 rounded-xl border border-slate-200/60">
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              title="Grid View"
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-[#0bad96] text-white shadow-2xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('table')}
              title="Table View"
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                viewMode === 'table'
                  ? 'bg-[#0bad96] text-white shadow-2xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <List className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 4. Members Content (Table View or Grid View) */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-2xs overflow-hidden">
        {loading ? (
          /* Skeleton loader */
          <div className="p-8 space-y-4 animate-pulse">
            <div className="h-6 bg-slate-100 rounded-lg w-1/3" />
            <div className="h-10 bg-slate-50 rounded-xl w-full" />
            <div className="h-10 bg-slate-50 rounded-xl w-full" />
            <div className="h-10 bg-slate-50 rounded-xl w-full" />
          </div>
        ) : filteredMembers.length === 0 ? (
          /* Empty state */
          <div className="p-12 text-center">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
              <Users className="w-6 h-6 stroke-[1.5]" />
            </div>
            <h3 className="text-sm font-bold text-slate-800">No members found</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              No matching members found for "{searchQuery}". Try adjusting your filters or search keywords.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedStatus('All');
              }}
              className="mt-4 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : viewMode === 'table' ? (
          /* Table View matching screenshot exactly */
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50 text-slate-500 font-semibold text-[11px]">
                  <th className="py-3 px-4 w-12 text-center">#</th>
                  <th className="py-3 px-4">Member</th>
                  <th className="py-3 px-4">Membership ID</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Mobile</th>
                  <th className="py-3 px-4">Join Date</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {currentMembers.map((member, index) => {
                  const isActive = member.status === 'Active';
                  const rowNumber = startIndex + index + 1;

                  return (
                    <tr key={member.id} className="hover:bg-slate-50/80 transition-colors group">
                      {/* # Number */}
                      <td className="py-3 px-4 text-center font-bold text-slate-400 text-[11px]">
                        {rowNumber}
                      </td>

                      {/* Member: Avatar + Full Name */}
                      <td
                        className="py-3 px-4 cursor-pointer"
                        onClick={() => setViewingMember(member)}
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-100 border border-slate-200 flex-shrink-0 shadow-2xs">
                            <img
                              src={member.avatarUrl}
                              alt={member.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                              onError={(e) => {
                                e.target.src = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=256&q=80';
                              }}
                            />
                          </div>
                          <span className="font-bold text-slate-900 group-hover:text-[#0bad96] transition-colors">
                            {member.name}
                          </span>
                        </div>
                      </td>

                      {/* Membership ID */}
                      <td className="py-3 px-4 font-mono text-[11px] font-bold text-slate-600">
                        {member.membershipId}
                      </td>

                      {/* Email */}
                      <td className="py-3 px-4 text-slate-600 font-medium truncate max-w-[180px]">
                        {member.email}
                      </td>

                      {/* Mobile */}
                      <td className="py-3 px-4 font-mono text-slate-600 font-medium">
                        {member.mobile}
                      </td>

                      {/* Join Date */}
                      <td className="py-3 px-4 text-slate-500 font-medium">
                        {member.joinDate}
                      </td>

                      {/* Status Badge */}
                      <td className="py-3 px-4">
                        <span
                          className={`px-3 py-1 rounded-full text-[11px] font-bold ${
                            isActive
                              ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                              : 'bg-amber-50 text-amber-600 border border-amber-100'
                          }`}
                        >
                          {member.status}
                        </span>
                      </td>

                      {/* Action Icons matching screenshot */}
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            type="button"
                            onClick={() => setViewingMember(member)}
                            title="View Member Profile"
                            className="p-1.5 hover:bg-emerald-50 rounded-lg text-[#0bad96] hover:text-[#099884] transition-colors cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          <button
                            type="button"
                            onClick={() => setEditingMember(member)}
                            title="Edit Member"
                            className="p-1.5 hover:bg-emerald-50 rounded-lg text-[#0bad96] hover:text-[#099884] transition-colors cursor-pointer"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>

                          <button
                            type="button"
                            onClick={() => setDeletingMember(member)}
                            title="Delete Member"
                            className="p-1.5 hover:bg-red-50 rounded-lg text-red-400 hover:text-red-600 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          /* Grid View */
          <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {currentMembers.map((member) => {
              const isActive = member.status === 'Active';
              return (
                <div
                  key={member.id}
                  className="bg-white rounded-2xl border border-slate-100 p-4 shadow-2xs hover:shadow-md hover:border-emerald-200 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[11px] font-mono font-bold text-slate-400">
                        {member.membershipId}
                      </span>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          isActive
                            ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                            : 'bg-amber-50 text-amber-600 border border-amber-100'
                        }`}
                      >
                        {member.status}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 rounded-full overflow-hidden border border-slate-200 shadow-2xs flex-shrink-0">
                        <img
                          src={member.avatarUrl}
                          alt={member.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="overflow-hidden">
                        <h3
                          onClick={() => setViewingMember(member)}
                          className="text-xs font-bold text-slate-900 hover:text-[#0bad96] cursor-pointer truncate"
                        >
                          {member.name}
                        </h3>
                        <p className="text-[11px] text-slate-400 truncate">{member.email}</p>
                      </div>
                    </div>

                    <div className="space-y-1 text-[11px] text-slate-500 bg-slate-50/50 p-2.5 rounded-xl border border-slate-100">
                      <div className="flex justify-between">
                        <span>Mobile:</span>
                        <strong className="text-slate-700 font-mono">{member.mobile}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>Joined:</span>
                        <strong className="text-slate-700">{member.joinDate}</strong>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 mt-3 flex items-center justify-end gap-1.5">
                    <button
                      type="button"
                      onClick={() => setViewingMember(member)}
                      className="p-1.5 hover:bg-emerald-50 rounded-lg text-[#0bad96]"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingMember(member)}
                      className="p-1.5 hover:bg-emerald-50 rounded-lg text-[#0bad96]"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeletingMember(member)}
                      className="p-1.5 hover:bg-red-50 rounded-lg text-red-400 hover:text-red-600"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* 5. Pagination matching screenshot */}
        {!loading && filteredMembers.length > 0 && (
          <div className="p-3.5 px-4 bg-slate-50/50 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
            <div>
              Showing <strong className="text-slate-800">{startIndex + 1}</strong> to{' '}
              <strong className="text-slate-800">{endIndex}</strong> of{' '}
              <strong className="text-slate-800">{totalItems}</strong> members
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="w-7 h-7 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 flex items-center justify-center text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  type="button"
                  onClick={() => setCurrentPage(page)}
                  className={`w-7 h-7 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                    currentPage === page
                      ? 'bg-[#0bad96] text-white shadow-2xs'
                      : 'border border-slate-200 bg-white hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  {page}
                </button>
              ))}

              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="w-7 h-7 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 flex items-center justify-center text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add Member Modal (Panel 1) */}
      <MemberFormModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddSubmit}
        initialMember={null}
      />

      {/* Edit Member Modal (Panel 2) */}
      <MemberFormModal
        isOpen={Boolean(editingMember)}
        onClose={() => setEditingMember(null)}
        onSubmit={handleEditSubmit}
        initialMember={editingMember}
      />

      {/* Delete Member Confirmation Modal */}
      <DeleteMemberModal
        isOpen={Boolean(deletingMember)}
        onClose={() => setDeletingMember(null)}
        onConfirm={handleDeleteConfirm}
        member={deletingMember}
      />
    </div>
  );
}
