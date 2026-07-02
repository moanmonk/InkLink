import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Settings, Save, CheckCircle2, User, FileText, Sparkles, Feather, Trash2, AlertTriangle, Flame } from 'lucide-react';
import { updateProfile, deleteUserAccount } from '../lib/firebase';
import { Profile } from '../types';
import ConfirmationModal from './ConfirmationModal';
import { getPaletteForCategory, getPaletteForUser } from '../lib/colors';

interface SettingsViewProps {
  user: Profile;
  onRefreshUser: () => void;
}

const CATEGORIES = [
  'Daily Life', 'Nature', 'Fantasy', 'Sci-Fi', 'Urban', 'Dreams', 'Surreal', 'Mythology', 'Objects'
];

export default function SettingsView({ user, onRefreshUser }: SettingsViewProps) {
  const [displayName, setDisplayName] = useState(user.displayName || '');
  const [bio, setBio] = useState(user.bio || '');
  const [favoriteCategory, setFavoriteCategory] = useState(user.favoriteCategory || 'Nature');
  const [error, setError] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showStreakConfirm, setShowStreakConfirm] = useState(false);
  const [streakResetSuccess, setStreakResetSuccess] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSaved(false);
    setSaving(true);

    if (!displayName.trim()) {
      setError('Please provide an elegant pen name.');
      setSaving(false);
      return;
    }

    try {
      await updateProfile(user.id, {
        displayName: displayName.trim(),
        bio: bio.trim(),
        favoriteCategory: favoriteCategory
      });
      onRefreshUser();
      setIsSaved(true);
      setStreakResetSuccess(false);
    } catch (err: any) {
      console.error(err);
      setError('Failed to seal settings: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleResetStreak = async () => {
    setShowStreakConfirm(false);
    setSaving(true);
    setError('');
    setStreakResetSuccess(false);
    setIsSaved(false);
    try {
      await updateProfile(user.id, {
        currentStreak: 0,
        longestStreak: 0
      });
      onRefreshUser();
      setStreakResetSuccess(true);
    } catch (err: any) {
      console.error(err);
      setError('Failed to reset drawing streaks: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    setShowDeleteConfirm(false);
    setSaving(true);
    setError('');
    try {
      await deleteUserAccount(user.id);
      // Fallback auth triggers profile reload and log out in App.tsx
    } catch (err: any) {
      console.error(err);
      setError('Failed to incinerate account: ' + err.message);
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col max-w-lg mx-auto select-none pt-2 pb-12">
      
      {/* HEADER SECTION */}
      <div className="border-b border-[#CBD5E1] pb-3 mb-6">
        <div className="flex items-center gap-1.5 text-[#64748B] text-xs font-mono tracking-wider uppercase">
          <Settings className="w-3.5 h-3.5 text-[#64748B]" />
          <span>Notebook Tuning</span>
        </div>
        <h3 className="font-serif text-lg font-black text-[#2D3748] leading-tight mt-0.5">
          Studio Settings
        </h3>
      </div>

      <div className="bg-white border border-[#CBD5E1] rounded-3xl p-6 sm:p-8 shadow-xs relative">
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl font-serif italic">
            {error}
          </div>
        )}

        {isSaved && (
          <div className="mb-4 p-3 bg-[#8daa91]/10 border border-[#8daa91]/50 text-[#4e6a53] text-xs rounded-xl font-serif italic flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#8daa91] flex-shrink-0" />
            <span>Your notebook coordinates have been sealed successfully!</span>
          </div>
        )}

        {streakResetSuccess && (
          <div className="mb-4 p-3 bg-amber-50 border border-amber-200 text-amber-800 text-xs rounded-xl font-serif italic flex items-center gap-2">
            <Flame className="w-4 h-4 text-amber-600 flex-shrink-0 animate-pulse" />
            <span>Your active and longest drawing streaks have been reset to zero!</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-5">
          
          {/* Display name */}
          <div>
            <label className="block text-[11px] font-mono uppercase text-[#2D3748] tracking-wider mb-1 flex items-center gap-1">
              <User className="w-3.5 h-3.5 text-[#64748B]" />
              <span>Artist Pen-Name (Display Name)</span>
            </label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full px-3 py-2 text-xs font-serif bg-white border border-[#CBD5E1] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#8daa91] focus:border-[#8daa91] text-[#2D3748]"
              placeholder="e.g., Jane Sketcher"
            />
          </div>

          {/* Bio */}
          <div>
            <label className="block text-[11px] font-mono uppercase text-[#2D3748] tracking-wider mb-1 flex items-center gap-1">
              <FileText className="w-3.5 h-3.5 text-[#64748B]" />
              <span>Medium Biography / Bio</span>
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 text-xs font-serif bg-white border border-[#CBD5E1] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#8daa91] focus:border-[#8daa91] text-[#2D3748]"
              placeholder="e.g., Quiet forest ink enthusiast..."
            />
          </div>

          {/* Favorite Theme Category */}
          <div>
            <label className="block text-[11px] font-mono uppercase text-[#2D3748] tracking-wider mb-2 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-[#64748B]" />
              <span>Favorite Sketch Theme</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => {
                const palette = getPaletteForCategory(cat);
                const isSelected = favoriteCategory === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setFavoriteCategory(cat)}
                    style={{
                      backgroundColor: isSelected ? palette.primary : 'transparent',
                      color: isSelected ? '#ffffff' : palette.text,
                      borderColor: isSelected ? palette.primary : `${palette.primary}35`,
                    }}
                    className="px-3 py-1.5 text-xs font-serif rounded-xl border transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98] select-none"
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            style={{
              backgroundColor: saving ? '#E1E8F0' : '#8daa91',
            }}
            className="w-full py-2.5 mt-2 rounded-xl text-white font-serif font-bold text-xs flex items-center justify-center gap-1.5 shadow-[2px_2px_0_rgba(141,170,145,0.15)] hover:shadow-none translate-y-[-1px] active:translate-y-0 transition-all cursor-pointer select-none"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Sealing coordinates...' : 'Save Settings'}</span>
          </button>

        </form>
      </div>

      {/* STREAK CALIBRATION */}
      <div className="mt-6 bg-amber-50/10 border border-amber-200/40 rounded-3xl p-6 sm:p-7 shadow-xs relative">
        <h4 className="font-serif text-sm font-black text-amber-800 flex items-center gap-2">
          <Flame className="w-4 h-4 text-amber-600" />
          <span>Streak Calibration</span>
        </h4>
        <p className="text-[11px] font-serif text-[#64748B] mt-1.5 italic leading-relaxed">
          Need a fresh start? Resetting your current and longest drawing streaks to zero will let you begin your creative journey on a clean slate.
        </p>
        <button
          type="button"
          onClick={() => setShowStreakConfirm(true)}
          className="w-full py-2.5 mt-4 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-700 font-serif font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer select-none"
        >
          <Flame className="w-4 h-4" />
          <span>Reset Day Streaks to Zero</span>
        </button>
      </div>

      {/* DANGER ZONE */}
      <div className="mt-6 bg-red-50/10 border border-red-200/40 rounded-3xl p-6 sm:p-7 shadow-xs relative">
        <h4 className="font-serif text-sm font-black text-red-800 flex items-center gap-2">
          <Trash2 className="w-4 h-4 text-red-600" />
          <span>Danger Zone</span>
        </h4>
        <p className="text-[11px] font-serif text-[#64748B] mt-1.5 italic leading-relaxed">
          Once you burn your studio account, all your profile data will be permanently cleared from our records. Your sketches will be orphaned, and your streaks will be lost forever.
        </p>
        <button
          type="button"
          onClick={() => setShowDeleteConfirm(true)}
          className="w-full py-2.5 mt-4 rounded-xl bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 font-serif font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer select-none"
        >
          <Trash2 className="w-4 h-4" />
          <span>Burn Studio Account (Permanently Delete)</span>
        </button>
      </div>

      <ConfirmationModal
        isOpen={showDeleteConfirm}
        title="Burn Studio Account Permanently"
        message="Are you sure you want to permanently incinerate your studio account and all progress coordinates? This action is absolute and cannot be reversed."
        confirmLabel="Yes, Burn Account"
        type="danger"
        onConfirm={handleDeleteAccount}
        onCancel={() => setShowDeleteConfirm(false)}
      />

      <ConfirmationModal
        isOpen={showStreakConfirm}
        title="Reset Drawing Streaks"
        message="Are you absolutely sure you want to reset your current and longest drawing streaks to 0? This cannot be undone."
        confirmLabel="Yes, Reset Streaks"
        type="danger"
        onConfirm={handleResetStreak}
        onCancel={() => setShowStreakConfirm(false)}
      />
    </div>
  );
}
