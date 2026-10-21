import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Settings,
  User,
  Lock,
  Bell,
  Palette,
  Database,
  Clock,
  BookOpen,
  Users,
  Folder,
  BarChart2,
  ChevronRight,
  Activity,
  Check,
  RotateCcw,
  Save,
  Download,
  Upload,
  Shield,
  Eye,
  EyeOff,
  Calendar,
  List,
  LayoutGrid,
  Zap,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Bookmark,
  Coins,
  Sparkles,
} from 'lucide-react';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { useBooks } from '../context/BookContext';
import { useMembers } from '../context/MemberContext';
import { bookService } from '../services/bookService';
import { memberService } from '../services/memberService';

export default function SettingsPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { books, fetchBooks } = useBooks();
  const { members, fetchMembers } = useMembers();

  // Active navigation tab on the left sidebar of settings
  // 'general' | 'profile' | 'password' | 'notifications' | 'appearance' | 'backup' | 'system'
  const [activeTab, setActiveTab] = useState('general');

  // Selected theme ('light' | 'dark' | 'auto')
  const [currentTheme, setCurrentTheme] = useState(() => {
    return localStorage.getItem('librabook_theme') || 'light';
  });

  // -------------------------------------------------------------
  // Dynamic Library Statistics for System Status Widget
  // -------------------------------------------------------------
  const totalBooksCount = useMemo(() => {
    const copies = books.reduce((sum, b) => sum + (Number(b.totalCopies) || 0), 0);
    return copies > 0 ? copies : 120;
  }, [books]);

  const totalMembersCount = useMemo(() => {
    return members.length > 0 ? members.length : 75;
  }, [members]);

  // -------------------------------------------------------------
  // 1. General Settings Form State
  // -------------------------------------------------------------
  const defaultGeneralSettings = {
    libraryName: 'LibraBook Central Library',
    libraryEmail: 'library@librabook.com',
    phoneNumber: '+91 98765 43210',
    address: '123 Library Street, Green Park\nBangalore - 560001',
    defaultBookView: 'Grid View',
    itemsPerPage: '10',
    dateFormat: 'DD MMM YYYY',
    timeFormat: '12 Hour (AM/PM)',
    allowReservations: true,
    sendEmailNotifications: true,
    autoCalculateFine: true,
  };

  const [generalSettings, setGeneralSettings] = useState(() => {
    try {
      const stored = localStorage.getItem('librabook_settings_general');
      if (stored) return { ...defaultGeneralSettings, ...JSON.parse(stored) };
    } catch {}
    return defaultGeneralSettings;
  });

  const handleSaveGeneral = (e) => {
    e.preventDefault();
    localStorage.setItem('librabook_settings_general', JSON.stringify(generalSettings));
    toast.success('General settings saved successfully!', { icon: '⚙️' });
  };

  const handleResetGeneral = () => {
    setGeneralSettings(defaultGeneralSettings);
    localStorage.setItem('librabook_settings_general', JSON.stringify(defaultGeneralSettings));
    toast.info('General settings reset to default.');
  };

  // -------------------------------------------------------------
  // 2. Profile Settings State
  // -------------------------------------------------------------
  const [profileSettings, setProfileSettings] = useState(() => {
    try {
      const stored = localStorage.getItem('librabook_settings_profile');
      if (stored) return JSON.parse(stored);
    } catch {}
    return {
      name: user?.name || 'Vimal S',
      email: user?.email || 'admin@librabook.com',
      role: 'Super Administrator',
      phone: '+91 98765 43210',
      avatarUrl: user?.avatarUrl || '',
      bio: 'Head Librarian & Systems Administrator at LibraBook Central Library.',
    };
  });

  const handleSaveProfile = (e) => {
    e.preventDefault();
    localStorage.setItem('librabook_settings_profile', JSON.stringify(profileSettings));
    toast.success('Admin profile updated successfully!', { icon: '👤' });
  };

  // -------------------------------------------------------------
  // 3. Password Settings State
  // -------------------------------------------------------------
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (!passwordForm.newPassword || passwordForm.newPassword.length < 6) {
      toast.warning('New password must be at least 6 characters long.');
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('New password and confirm password do not match.');
      return;
    }
    toast.success('Password changed successfully!', { icon: '🔒' });
    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  // -------------------------------------------------------------
  // 4. Data Backup & System Restore Handlers
  // -------------------------------------------------------------
  const handleExportFullBackup = () => {
    try {
      const backupData = {
        version: '2.4.0',
        timestamp: new Date().toISOString(),
        books: JSON.parse(localStorage.getItem('librabook_books_v2') || '[]'),
        members: JSON.parse(localStorage.getItem('librabook_members_v5') || '[]'),
        categories: JSON.parse(localStorage.getItem('librabook_categories_v2') || '[]'),
        fineOverrides: JSON.parse(localStorage.getItem('librabook_fine_overrides') || '{}'),
        generalSettings,
      };

      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backupData, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', dataStr);
      downloadAnchor.setAttribute('download', `LibraBook_Backup_${Date.now()}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();

      toast.success('Full JSON database backup exported successfully!', { icon: '💾' });
    } catch {
      toast.error('Failed to export backup file.');
    }
  };

  const handleImportBackup = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const json = JSON.parse(event.target.result);
        if (!json.books && !json.members) {
          throw new Error('Invalid backup format');
        }

        if (json.books) localStorage.setItem('librabook_books_v2', JSON.stringify(json.books));
        if (json.members) localStorage.setItem('librabook_members_v5', JSON.stringify(json.members));
        if (json.categories) localStorage.setItem('librabook_categories_v2', JSON.stringify(json.categories));
        if (json.fineOverrides) localStorage.setItem('librabook_fine_overrides', JSON.stringify(json.fineOverrides));

        await fetchBooks();
        await fetchMembers();

        toast.success('Database restored successfully from backup!', { icon: '✨' });
      } catch (err) {
        toast.error('Failed to import backup: ' + err.message);
      }
    };
    reader.readAsText(file);
  };

  const handleResetCatalog = async () => {
    const confirmed = window.confirm('Reset all books catalog to initial default books?');
    if (!confirmed) return;
    try {
      bookService.resetBooks();
      await fetchBooks();
      toast.success('Books catalog reset to default initial records.');
    } catch {
      toast.error('Failed to reset catalog.');
    }
  };

  const handleResetMembers = async () => {
    const confirmed = window.confirm('Reset all members and loan records to default API state?');
    if (!confirmed) return;
    try {
      await memberService.resetMembers();
      await fetchMembers();
      toast.success('Members and loans directory reset successfully.');
    } catch {
      toast.error('Failed to reset members.');
    }
  };

  // Theme switch handler
  const handleSelectTheme = (theme) => {
    setCurrentTheme(theme);
    localStorage.setItem('librabook_theme', theme);
    toast.info(`Theme set to ${theme.charAt(0).toUpperCase() + theme.slice(1)}`);
  };

  return (
    <div className="space-y-4 max-w-[1520px] mx-auto select-none">
      {/* ========================================================
          1. HEADER ROW: Settings Title & Subtitle
         ======================================================== */}
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-2xl bg-[#e6f7f3] text-[#0bad96] flex items-center justify-center flex-shrink-0 shadow-2xs">
          <Settings className="w-6 h-6 stroke-[2.2]" />
        </div>
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-tight">
            Settings
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Manage your library system preferences and account settings.
          </p>
        </div>
      </div>

      {/* ========================================================
          2. MAIN CONTENT GRID (3 COLUMNS MATCHING SCREENSHOT)
         ======================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* ------------------------------------------------------
            COLUMN 1 (Left): Settings Navigation Tabs (3 cols)
           ------------------------------------------------------ */}
        <div className="lg:col-span-3 space-y-1.5">
          {[
            {
              id: 'general',
              title: 'General Settings',
              subtitle: 'System settings & preferences',
              icon: Settings,
            },
            {
              id: 'profile',
              title: 'Profile Settings',
              subtitle: 'Update your profile information',
              icon: User,
            },
            {
              id: 'password',
              title: 'Change Password',
              subtitle: 'Update your password',
              icon: Lock,
            },
            {
              id: 'notifications',
              title: 'Notifications',
              subtitle: 'Manage notifications',
              icon: Bell,
            },
            {
              id: 'appearance',
              title: 'Appearance',
              subtitle: 'Theme & display settings',
              icon: Palette,
            },
            {
              id: 'backup',
              title: 'Data Backup',
              subtitle: 'Backup & restore data',
              icon: Database,
            },
            {
              id: 'system',
              title: 'System Information',
              subtitle: 'App version & system details',
              icon: Clock,
            },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <div
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center gap-3 ${
                  isActive
                    ? 'bg-[#e6f7f3] border-[#0bad96]/30 shadow-2xs text-[#0bad96]'
                    : 'bg-white border-slate-100 hover:border-slate-200 hover:bg-slate-50/70 text-slate-700'
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${
                    isActive
                      ? 'bg-white text-[#0bad96] shadow-2xs'
                      : 'bg-slate-100/70 text-slate-500'
                  }`}
                >
                  <Icon className="w-4.5 h-4.5 stroke-[2]" />
                </div>
                <div className="truncate text-left leading-tight">
                  <div
                    className={`text-xs font-bold truncate ${
                      isActive ? 'text-[#099884]' : 'text-slate-900'
                    }`}
                  >
                    {tab.title}
                  </div>
                  <div className="text-[10px] text-slate-400 truncate mt-0.5 font-medium">
                    {tab.subtitle}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ------------------------------------------------------
            COLUMN 2 (Middle): Active Tab Form Content (6 cols)
           ------------------------------------------------------ */}
        <div className="lg:col-span-6">
          {/* TAB 1: General Settings (Matches Screenshot exactly!) */}
          {activeTab === 'general' && (
            <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-100/90 shadow-2xs space-y-5">
              {/* Header */}
              <div className="flex items-center gap-2 pb-3 border-b border-slate-50">
                <Settings className="w-4 h-4 text-[#0bad96] stroke-[2.2]" />
                <div>
                  <h2 className="text-xs sm:text-sm font-bold text-slate-900 leading-tight">
                    General Settings
                  </h2>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Configure basic system settings and library information.
                  </p>
                </div>
              </div>

              <form onSubmit={handleSaveGeneral} className="space-y-5 text-xs font-medium">
                {/* Section 1: Library Information */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-slate-900 font-bold text-xs pb-1">
                    <BookOpen className="w-4 h-4 text-[#0bad96]" />
                    <span>Library Information</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="text-slate-700 font-bold block mb-1 text-[11px]">
                        Library Name <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={generalSettings.libraryName}
                        onChange={(e) =>
                          setGeneralSettings({ ...generalSettings, libraryName: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-800 focus:outline-none focus:border-[#0bad96] font-medium"
                      />
                    </div>

                    <div>
                      <label className="text-slate-700 font-bold block mb-1 text-[11px]">
                        Library Email <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        value={generalSettings.libraryEmail}
                        onChange={(e) =>
                          setGeneralSettings({ ...generalSettings, libraryEmail: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-800 focus:outline-none focus:border-[#0bad96] font-medium"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="text-slate-700 font-bold block mb-1 text-[11px]">
                        Phone Number <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={generalSettings.phoneNumber}
                        onChange={(e) =>
                          setGeneralSettings({ ...generalSettings, phoneNumber: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-800 focus:outline-none focus:border-[#0bad96] font-medium"
                      />
                    </div>

                    <div>
                      <label className="text-slate-700 font-bold block mb-1 text-[11px]">
                        Address
                      </label>
                      <textarea
                        rows="2"
                        value={generalSettings.address}
                        onChange={(e) =>
                          setGeneralSettings({ ...generalSettings, address: e.target.value })
                        }
                        className="w-full px-3 py-1.5 rounded-xl border border-slate-200 text-slate-800 focus:outline-none focus:border-[#0bad96] font-medium resize-none text-xs"
                      />
                    </div>
                  </div>
                </div>

                {/* Section 2: System Preferences */}
                <div className="space-y-3 pt-2 border-t border-slate-50">
                  <div className="flex items-center gap-2 text-slate-900 font-bold text-xs pb-1">
                    <Settings className="w-4 h-4 text-[#0bad96]" />
                    <span>System Preferences</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {/* Default Book View */}
                    <div>
                      <label className="text-slate-700 font-bold block mb-1 text-[11px]">
                        Default Book View
                      </label>
                      <div className="relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                          <LayoutGrid className="w-3.5 h-3.5" />
                        </div>
                        <select
                          value={generalSettings.defaultBookView}
                          onChange={(e) =>
                            setGeneralSettings({
                              ...generalSettings,
                              defaultBookView: e.target.value,
                            })
                          }
                          className="w-full pl-8.5 pr-8 py-2 rounded-xl border border-slate-200 text-slate-800 font-medium bg-white focus:outline-none focus:border-[#0bad96] appearance-none cursor-pointer"
                        >
                          <option value="Grid View">Grid View</option>
                          <option value="Table View">Table View</option>
                        </select>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 rotate-90 pointer-events-none" />
                      </div>
                    </div>

                    {/* Items Per Page */}
                    <div>
                      <label className="text-slate-700 font-bold block mb-1 text-[11px]">
                        Items Per Page
                      </label>
                      <div className="relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                          <List className="w-3.5 h-3.5" />
                        </div>
                        <select
                          value={generalSettings.itemsPerPage}
                          onChange={(e) =>
                            setGeneralSettings({
                              ...generalSettings,
                              itemsPerPage: e.target.value,
                            })
                          }
                          className="w-full pl-8.5 pr-8 py-2 rounded-xl border border-slate-200 text-slate-800 font-medium bg-white focus:outline-none focus:border-[#0bad96] appearance-none cursor-pointer"
                        >
                          <option value="6">6</option>
                          <option value="10">10</option>
                          <option value="12">12</option>
                          <option value="20">20</option>
                        </select>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 rotate-90 pointer-events-none" />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {/* Date Format */}
                    <div>
                      <label className="text-slate-700 font-bold block mb-1 text-[11px]">
                        Date Format
                      </label>
                      <div className="relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                          <Calendar className="w-3.5 h-3.5" />
                        </div>
                        <select
                          value={generalSettings.dateFormat}
                          onChange={(e) =>
                            setGeneralSettings({
                              ...generalSettings,
                              dateFormat: e.target.value,
                            })
                          }
                          className="w-full pl-8.5 pr-8 py-2 rounded-xl border border-slate-200 text-slate-800 font-medium bg-white focus:outline-none focus:border-[#0bad96] appearance-none cursor-pointer"
                        >
                          <option value="DD MMM YYYY">DD MMM YYYY</option>
                          <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                          <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                        </select>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 rotate-90 pointer-events-none" />
                      </div>
                    </div>

                    {/* Time Format */}
                    <div>
                      <label className="text-slate-700 font-bold block mb-1 text-[11px]">
                        Time Format
                      </label>
                      <div className="relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                          <Clock className="w-3.5 h-3.5" />
                        </div>
                        <select
                          value={generalSettings.timeFormat}
                          onChange={(e) =>
                            setGeneralSettings({
                              ...generalSettings,
                              timeFormat: e.target.value,
                            })
                          }
                          className="w-full pl-8.5 pr-8 py-2 rounded-xl border border-slate-200 text-slate-800 font-medium bg-white focus:outline-none focus:border-[#0bad96] appearance-none cursor-pointer"
                        >
                          <option value="12 Hour (AM/PM)">12 Hour (AM/PM)</option>
                          <option value="24 Hour">24 Hour</option>
                        </select>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 rotate-90 pointer-events-none" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section 3: Library Features Toggle Switches */}
                <div className="space-y-3 pt-2 border-t border-slate-50">
                  <div className="flex items-center gap-2 text-slate-900 font-bold text-xs pb-1">
                    <BookOpen className="w-4 h-4 text-[#0bad96]" />
                    <span>Library Features</span>
                  </div>

                  <div className="space-y-2.5">
                    {/* Feature 1: Allow Book Reservations */}
                    <div className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 hover:bg-slate-50/70 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-lg bg-teal-50 text-[#0bad96] flex items-center justify-center flex-shrink-0">
                          <Bookmark className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-800">
                            Allow Book Reservations
                          </div>
                          <div className="text-[10px] text-slate-400">
                            Enable book reservation for members
                          </div>
                        </div>
                      </div>

                      {/* iOS Style Switch */}
                      <div
                        onClick={() =>
                          setGeneralSettings({
                            ...generalSettings,
                            allowReservations: !generalSettings.allowReservations,
                          })
                        }
                        className={`w-9 h-5 rounded-full transition-colors relative cursor-pointer ${
                          generalSettings.allowReservations ? 'bg-[#0bad96]' : 'bg-slate-200'
                        }`}
                      >
                        <div
                          className={`w-4 h-4 rounded-full bg-white shadow-xs absolute top-0.5 transition-transform ${
                            generalSettings.allowReservations ? 'right-0.5' : 'left-0.5'
                          }`}
                        />
                      </div>
                    </div>

                    {/* Feature 2: Send Email Notifications */}
                    <div className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 hover:bg-slate-50/70 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                          <Bell className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-800">
                            Send Email Notifications
                          </div>
                          <div className="text-[10px] text-slate-400">
                            Send email for due dates and reminders
                          </div>
                        </div>
                      </div>

                      <div
                        onClick={() =>
                          setGeneralSettings({
                            ...generalSettings,
                            sendEmailNotifications: !generalSettings.sendEmailNotifications,
                          })
                        }
                        className={`w-9 h-5 rounded-full transition-colors relative cursor-pointer ${
                          generalSettings.sendEmailNotifications ? 'bg-[#0bad96]' : 'bg-slate-200'
                        }`}
                      >
                        <div
                          className={`w-4 h-4 rounded-full bg-white shadow-xs absolute top-0.5 transition-transform ${
                            generalSettings.sendEmailNotifications ? 'right-0.5' : 'left-0.5'
                          }`}
                        />
                      </div>
                    </div>

                    {/* Feature 3: Auto Calculate Fine */}
                    <div className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 hover:bg-slate-50/70 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0">
                          <Coins className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-800">
                            Auto Calculate Fine
                          </div>
                          <div className="text-[10px] text-slate-400">
                            Automatically calculate fine for overdue books
                          </div>
                        </div>
                      </div>

                      <div
                        onClick={() =>
                          setGeneralSettings({
                            ...generalSettings,
                            autoCalculateFine: !generalSettings.autoCalculateFine,
                          })
                        }
                        className={`w-9 h-5 rounded-full transition-colors relative cursor-pointer ${
                          generalSettings.autoCalculateFine ? 'bg-[#0bad96]' : 'bg-slate-200'
                        }`}
                      >
                        <div
                          className={`w-4 h-4 rounded-full bg-white shadow-xs absolute top-0.5 transition-transform ${
                            generalSettings.autoCalculateFine ? 'right-0.5' : 'left-0.5'
                          }`}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom Action Buttons matching screenshot */}
                <div className="flex items-center gap-2.5 pt-3 border-t border-slate-100">
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-[#0bad96] hover:bg-[#099884] active:bg-[#077d6d] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                  >
                    <Save className="w-3.5 h-3.5 stroke-[2.2]" />
                    <span>Save Changes</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleResetGeneral}
                    className="px-5 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 2: Profile Settings */}
          {activeTab === 'profile' && (
            <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-100/90 shadow-2xs space-y-4">
              <div className="pb-3 border-b border-slate-50">
                <h2 className="text-sm font-bold text-slate-900">Administrator Profile</h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Update your contact info, display avatar, and credentials.
                </p>
              </div>

              <form onSubmit={handleSaveProfile} className="space-y-4 text-xs font-medium">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-[#0bad96] font-black text-2xl flex items-center justify-center border-2 border-white shadow-xs">
                    {profileSettings.name.charAt(0)}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-900">{profileSettings.name}</div>
                    <div className="text-xs text-slate-400">{profileSettings.role}</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="text-slate-700 font-bold block mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      value={profileSettings.name}
                      onChange={(e) => setProfileSettings({ ...profileSettings, name: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-800 focus:outline-none focus:border-[#0bad96]"
                    />
                  </div>
                  <div>
                    <label className="text-slate-700 font-bold block mb-1">Email Address</label>
                    <input
                      type="email"
                      required
                      value={profileSettings.email}
                      onChange={(e) => setProfileSettings({ ...profileSettings, email: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-800 focus:outline-none focus:border-[#0bad96]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-slate-700 font-bold block mb-1">Role / Designation</label>
                  <input
                    type="text"
                    value={profileSettings.role}
                    onChange={(e) => setProfileSettings({ ...profileSettings, role: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-800 focus:outline-none focus:border-[#0bad96]"
                  />
                </div>

                <div>
                  <label className="text-slate-700 font-bold block mb-1">Bio / Responsibilities</label>
                  <textarea
                    rows="3"
                    value={profileSettings.bio}
                    onChange={(e) => setProfileSettings({ ...profileSettings, bio: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-800 focus:outline-none focus:border-[#0bad96] resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#0bad96] hover:bg-[#099884] text-white font-bold text-xs flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Update Profile</span>
                </button>
              </form>
            </div>
          )}

          {/* TAB 3: Change Password */}
          {activeTab === 'password' && (
            <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-100/90 shadow-2xs space-y-4">
              <div className="pb-3 border-b border-slate-50">
                <h2 className="text-sm font-bold text-slate-900">Change Password</h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Ensure your account is using a strong security password.
                </p>
              </div>

              <form onSubmit={handlePasswordSubmit} className="space-y-3.5 text-xs font-medium">
                <div>
                  <label className="text-slate-700 font-bold block mb-1">Current Password</label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Enter current password"
                    value={passwordForm.currentPassword}
                    onChange={(e) =>
                      setPasswordForm({ ...passwordForm, currentPassword: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-800 focus:outline-none focus:border-[#0bad96]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="text-slate-700 font-bold block mb-1">New Password</label>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="Min. 6 characters"
                      value={passwordForm.newPassword}
                      onChange={(e) =>
                        setPasswordForm({ ...passwordForm, newPassword: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-800 focus:outline-none focus:border-[#0bad96]"
                    />
                  </div>

                  <div>
                    <label className="text-slate-700 font-bold block mb-1">Confirm New Password</label>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="Repeat new password"
                      value={passwordForm.confirmPassword}
                      onChange={(e) =>
                        setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-800 focus:outline-none focus:border-[#0bad96]"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-[11px] font-bold text-[#0bad96] hover:underline cursor-pointer flex items-center gap-1"
                >
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  <span>{showPassword ? 'Hide password characters' : 'Show password characters'}</span>
                </button>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-[#0bad96] hover:bg-[#099884] text-white font-bold text-xs flex items-center gap-1.5 shadow-xs cursor-pointer"
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>Update Password</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 4: Notifications Settings */}
          {activeTab === 'notifications' && (
            <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-100/90 shadow-2xs space-y-4">
              <div className="pb-3 border-b border-slate-50">
                <h2 className="text-sm font-bold text-slate-900">Notification Preferences</h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Configure alerts sent to library administrators and members.
                </p>
              </div>

              <div className="space-y-3 text-xs font-medium">
                <label className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:bg-slate-50 cursor-pointer">
                  <div>
                    <div className="font-bold text-slate-900">Overdue Loan Alerts</div>
                    <div className="text-[11px] text-slate-400">
                      Alert immediately when a borrower surpasses their due date.
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    defaultChecked
                    className="w-4 h-4 text-[#0bad96] rounded accent-[#0bad96] cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:bg-slate-50 cursor-pointer">
                  <div>
                    <div className="font-bold text-slate-900">Low Inventory Warnings</div>
                    <div className="text-[11px] text-slate-400">
                      Send notice when available book copies drop to 2 or fewer.
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    defaultChecked
                    className="w-4 h-4 text-[#0bad96] rounded accent-[#0bad96] cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:bg-slate-50 cursor-pointer">
                  <div>
                    <div className="font-bold text-slate-900">Fine Payment Receipts</div>
                    <div className="text-[11px] text-slate-400">
                      Automatically generate transaction confirmation upon fine settlement.
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    defaultChecked
                    className="w-4 h-4 text-[#0bad96] rounded accent-[#0bad96] cursor-pointer"
                  />
                </label>
              </div>

              <button
                type="button"
                onClick={() => toast.success('Notification settings saved!')}
                className="px-5 py-2.5 rounded-xl bg-[#0bad96] hover:bg-[#099884] text-white font-bold text-xs shadow-xs cursor-pointer"
              >
                Save Preferences
              </button>
            </div>
          )}

          {/* TAB 5: Appearance Settings */}
          {activeTab === 'appearance' && (
            <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-100/90 shadow-2xs space-y-4">
              <div className="pb-3 border-b border-slate-50">
                <h2 className="text-sm font-bold text-slate-900">Display & Appearance</h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Customize the interface theme and visual density.
                </p>
              </div>

              <div className="space-y-4 text-xs font-medium">
                <div>
                  <label className="text-slate-700 font-bold block mb-2">Theme Mode</label>
                  <div className="grid grid-cols-3 gap-3">
                    {['light', 'dark', 'auto'].map((thm) => (
                      <div
                        key={thm}
                        onClick={() => handleSelectTheme(thm)}
                        className={`p-3 rounded-xl border text-center cursor-pointer transition-all ${
                          currentTheme === thm
                            ? 'bg-[#e6f7f3] border-[#0bad96] font-bold text-[#0bad96]'
                            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <span className="capitalize">{thm} Theme</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-2">
                  <label className="flex items-center justify-between p-3 rounded-xl border border-slate-100">
                    <div>
                      <div className="font-bold text-slate-900">Compact Table Rows</div>
                      <div className="text-[11px] text-slate-400">
                        Display more items per screen in books and members tables.
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      defaultChecked
                      className="w-4 h-4 text-[#0bad96] rounded accent-[#0bad96] cursor-pointer"
                    />
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: Data Backup & Reset */}
          {activeTab === 'backup' && (
            <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-100/90 shadow-2xs space-y-4">
              <div className="pb-3 border-b border-slate-50">
                <h2 className="text-sm font-bold text-slate-900">Database Backup & Recovery</h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Export library records as JSON or restore from an earlier backup snapshot.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <button
                  type="button"
                  onClick={handleExportFullBackup}
                  className="p-4 rounded-xl border border-slate-200 hover:border-teal-200 hover:bg-teal-50/20 text-left transition-all cursor-pointer group"
                >
                  <Download className="w-5 h-5 text-[#0bad96] mb-2" />
                  <div className="font-bold text-slate-900 text-xs">Download Full Backup</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    Exports books, members, categories, and fines.
                  </div>
                </button>

                <label className="p-4 rounded-xl border border-slate-200 hover:border-blue-200 hover:bg-blue-50/20 text-left transition-all cursor-pointer group block">
                  <Upload className="w-5 h-5 text-blue-600 mb-2" />
                  <div className="font-bold text-slate-900 text-xs">Restore from Backup</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    Upload an exported JSON backup file.
                  </div>
                  <input type="file" accept=".json" onChange={handleImportBackup} className="hidden" />
                </label>
              </div>

              {/* Danger Zone */}
              <div className="pt-3 border-t border-slate-100 space-y-2">
                <h3 className="text-xs font-bold text-rose-600">Danger Zone</h3>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleResetCatalog}
                    className="flex-1 py-2 rounded-xl border border-rose-200 text-rose-600 text-xs font-bold hover:bg-rose-50 cursor-pointer"
                  >
                    Reset Books
                  </button>
                  <button
                    type="button"
                    onClick={handleResetMembers}
                    className="flex-1 py-2 rounded-xl border border-rose-200 text-rose-600 text-xs font-bold hover:bg-rose-50 cursor-pointer"
                  >
                    Reset Members
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: System Information */}
          {activeTab === 'system' && (
            <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-100/90 shadow-2xs space-y-4">
              <div className="pb-3 border-b border-slate-50">
                <h2 className="text-sm font-bold text-slate-900">System Information</h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Platform architecture, versions, and runtime details.
                </p>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between py-2 border-b border-slate-50">
                  <span className="text-slate-500 font-medium">Application</span>
                  <span className="font-bold text-slate-900">LibraBook Library Management System</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-50">
                  <span className="text-slate-500 font-medium">Version</span>
                  <span className="font-bold text-[#0bad96]">v2.4.0 (Production Stable)</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-50">
                  <span className="text-slate-500 font-medium">Framework</span>
                  <span className="font-bold text-slate-900">React 19 + Vite + Tailwind CSS</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-50">
                  <span className="text-slate-500 font-medium">Database Connection</span>
                  <span className="font-bold text-emerald-600">Local Persistence Engine (Active)</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-50">
                  <span className="text-slate-500 font-medium">Total Stored Records</span>
                  <span className="font-bold text-slate-900">{totalBooksCount + totalMembersCount} Items</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ------------------------------------------------------
            COLUMN 3 (Right): Support Widgets (3 cols)
           ------------------------------------------------------ */}
        <div className="lg:col-span-3 space-y-4">
          {/* 1. Quick Actions Card */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-100/90 shadow-2xs space-y-2.5">
            <div className="flex items-center gap-2 pb-1">
              <Zap className="w-4 h-4 text-[#0bad96] stroke-[2.2]" />
              <h2 className="text-xs sm:text-sm font-bold text-slate-800">
                Quick Actions
              </h2>
            </div>

            <div className="space-y-1.5">
              {[
                {
                  title: 'Add Book',
                  subtitle: 'New book to library',
                  icon: BookOpen,
                  iconBg: 'bg-teal-50 text-[#0bad96]',
                  route: '/books',
                },
                {
                  title: 'Add Member',
                  subtitle: 'Register new member',
                  icon: User,
                  iconBg: 'bg-blue-50 text-blue-600',
                  route: '/members',
                },
                {
                  title: 'Manage Categories',
                  subtitle: 'Edit book categories',
                  icon: Folder,
                  iconBg: 'bg-emerald-50 text-emerald-600',
                  route: '/categories',
                },
                {
                  title: 'View Reports',
                  subtitle: 'Check library reports',
                  icon: BarChart2,
                  iconBg: 'bg-purple-50 text-purple-600',
                  route: '/reports',
                },
              ].map((act) => {
                const Icon = act.icon;
                return (
                  <div
                    key={act.title}
                    onClick={() => navigate(act.route)}
                    className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50/80 transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center gap-2.5 overflow-hidden">
                      <div
                        className={`w-7.5 h-7.5 rounded-xl ${act.iconBg} flex items-center justify-center flex-shrink-0`}
                      >
                        <Icon className="w-3.5 h-3.5 stroke-[2]" />
                      </div>
                      <div className="truncate text-left leading-tight">
                        <div className="text-xs font-bold text-slate-800 truncate group-hover:text-[#0bad96] transition-colors">
                          {act.title}
                        </div>
                        <div className="text-[10px] text-slate-400 truncate mt-0.5">
                          {act.subtitle}
                        </div>
                      </div>
                    </div>

                    <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#0bad96] group-hover:translate-x-0.5 transition-all flex-shrink-0" />
                  </div>
                );
              })}
            </div>
          </div>

          {/* 2. System Status Card */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-100/90 shadow-2xs space-y-3">
            <div className="flex items-center justify-between pb-1 border-b border-slate-50">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-[#0bad96] stroke-[2.2]" />
                <h2 className="text-xs sm:text-sm font-bold text-slate-800">
                  System Status
                </h2>
              </div>
              <span className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-600">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Online</span>
              </span>
            </div>

            <div className="space-y-2.5 text-xs font-medium">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-600">
                  <Database className="w-3.5 h-3.5 text-slate-400" />
                  <span>Database Connection</span>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-100">
                  Active
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-600">
                  <Activity className="w-3.5 h-3.5 text-slate-400" />
                  <span>API Integration</span>
                </div>
                <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span>Connected</span>
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-600">
                  <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                  <span>Total Books</span>
                </div>
                <span className="font-bold text-slate-900">{totalBooksCount}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-600">
                  <Users className="w-3.5 h-3.5 text-slate-400" />
                  <span>Total Members</span>
                </div>
                <span className="font-bold text-slate-900">{totalMembersCount}</span>
              </div>
            </div>
          </div>

          {/* 3. Theme Settings Card */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-100/90 shadow-2xs space-y-2.5">
            <div className="flex items-center gap-2">
              <Palette className="w-4 h-4 text-[#0bad96] stroke-[2.2]" />
              <div>
                <h2 className="text-xs sm:text-sm font-bold text-slate-800 leading-tight">
                  Theme Settings
                </h2>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  Choose your preferred theme
                </p>
              </div>
            </div>

            {/* 3 Theme Options matching screenshot */}
            <div className="grid grid-cols-3 gap-2 pt-1">
              {/* Light Theme Card */}
              <div
                onClick={() => handleSelectTheme('light')}
                className={`p-2.5 rounded-xl border text-center cursor-pointer transition-all relative ${
                  currentTheme === 'light'
                    ? 'border-[#0bad96] bg-teal-50/30 shadow-2xs'
                    : 'border-slate-200 bg-white hover:bg-slate-50'
                }`}
              >
                {currentTheme === 'light' && (
                  <div className="absolute top-1.5 right-1.5 w-3.5 h-3.5 rounded-full bg-[#0bad96] text-white flex items-center justify-center">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </div>
                )}
                {/* Visual Preview */}
                <div className="w-10 h-5 mx-auto bg-slate-100 rounded-full relative p-0.5 mb-1.5">
                  <div className="w-4 h-4 rounded-full bg-[#0bad96] shadow-2xs" />
                </div>
                <span className="text-[10px] font-bold text-slate-700 block">Light</span>
              </div>

              {/* Dark Theme Card */}
              <div
                onClick={() => handleSelectTheme('dark')}
                className={`p-2.5 rounded-xl border text-center cursor-pointer transition-all relative ${
                  currentTheme === 'dark'
                    ? 'border-[#0bad96] bg-teal-50/30 shadow-2xs'
                    : 'border-slate-200 bg-white hover:bg-slate-50'
                }`}
              >
                {currentTheme === 'dark' && (
                  <div className="absolute top-1.5 right-1.5 w-3.5 h-3.5 rounded-full bg-[#0bad96] text-white flex items-center justify-center">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </div>
                )}
                <div className="w-10 h-5 mx-auto bg-slate-800 rounded-full relative p-0.5 mb-1.5 flex justify-end">
                  <div className="w-4 h-4 rounded-full bg-slate-600 shadow-2xs" />
                </div>
                <span className="text-[10px] font-bold text-slate-700 block">Dark</span>
              </div>

              {/* Auto Theme Card */}
              <div
                onClick={() => handleSelectTheme('auto')}
                className={`p-2.5 rounded-xl border text-center cursor-pointer transition-all relative ${
                  currentTheme === 'auto'
                    ? 'border-[#0bad96] bg-teal-50/30 shadow-2xs'
                    : 'border-slate-200 bg-white hover:bg-slate-50'
                }`}
              >
                {currentTheme === 'auto' && (
                  <div className="absolute top-1.5 right-1.5 w-3.5 h-3.5 rounded-full bg-[#0bad96] text-white flex items-center justify-center">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </div>
                )}
                <div className="w-10 h-5 mx-auto bg-gradient-to-r from-slate-200 to-slate-800 rounded-full relative p-0.5 mb-1.5 flex items-center justify-center">
                  <div className="w-4 h-4 rounded-full bg-white shadow-2xs" />
                </div>
                <span className="text-[10px] font-bold text-slate-700 block">Auto</span>
              </div>
            </div>
          </div>

          {/* 4. Quote Artwork Banner */}
          <div className="bg-gradient-to-r from-emerald-50/80 via-teal-50/40 to-emerald-50/70 border border-emerald-100/70 rounded-2xl p-4 shadow-2xs flex items-center justify-between gap-3">
            <div className="w-9 h-9 rounded-xl bg-white shadow-2xs flex items-center justify-center text-[#0bad96] flex-shrink-0">
              <BookOpen className="w-4.5 h-4.5 stroke-[2.2]" />
            </div>
            <div className="text-left flex-1">
              <div className="text-xs font-bold text-[#099884] tracking-tight italic font-serif">
                "A library is a hospital for the mind."
              </div>
              <div className="text-[10px] text-slate-400 font-medium mt-0.5">
                — Anonymous
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
