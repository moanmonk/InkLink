import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Sparkles, Camera, BookOpen, ChevronRight, Check } from 'lucide-react';
import { updateProfile } from '../lib/firebase';
import { Profile } from '../types';

interface OnboardingViewProps {
  user: Profile;
  onOnboardingComplete: (updatedProfile: Profile) => void;
}

// Beautiful watercolor avatar assets (illustrated mock-icons styled as stickers)
const PRESET_AVATARS = [
  { name: 'Cozy Fox', url: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=150&auto=format&fit=crop&q=80' },
  { name: 'Wise Owl', url: 'https://images.unsplash.com/photo-1509248961158-e54f6934749c?w=150&auto=format&fit=crop&q=80' },
  { name: 'Warm Raccoon', url: 'https://images.unsplash.com/photo-1497250681960-ef046c08a56e?w=150&auto=format&fit=crop&q=80' },
  { name: 'Studio Cat', url: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=150&auto=format&fit=crop&q=80' },
  { name: 'Meadow Stag', url: 'https://images.unsplash.com/photo-1484406566174-9da000fda645?w=150&auto=format&fit=crop&q=80' },
  { name: 'Zen Frog', url: 'https://images.unsplash.com/photo-1544733422-251e532ca221?w=150&auto=format&fit=crop&q=80' }
];

const CATEGORIES = [
  'Daily Life', 'Nature', 'Fantasy', 'Sci-Fi', 'Urban', 'Dreams', 'Surreal', 'Mythology', 'Objects'
];

export default function OnboardingView({ user, onOnboardingComplete }: OnboardingViewProps) {
  const [step, setStep] = useState(1);
  const [username, setUsername] = useState(user.username || '');
  const [displayName, setDisplayName] = useState(user.displayName || '');
  const [bio, setBio] = useState('');
  const [favCategory, setFavCategory] = useState('Nature');
  const [selectedAvatar, setSelectedAvatar] = useState(PRESET_AVATARS[0].url);
  const [customAvatarBase64, setCustomAvatarBase64] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Handle custom avatar upload
  const handleAvatarFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 1 * 1024 * 1024) {
      alert('Avatar is too heavy. Let\'s keep it under 1MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const b64 = event.target?.result as string;
      setCustomAvatarBase64(b64);
    };
    reader.readAsDataURL(file);
  };

  const handleNextStep = () => {
    setError('');
    if (step === 1) {
      if (!username.trim() || !displayName.trim()) {
        setError('Please ink both username and pen-name.');
        return;
      }
      // Simple validation for safe characters
      if (/[^a-zA-Z0-9_]/.test(username)) {
        setError('Username can only contain letters, numbers, and underscores.');
        return;
      }
      setStep(2);
    } else if (step === 2) {
      setStep(3);
    }
  };

  const handleSaveProfile = async () => {
    setLoading(true);
    const avatarUrlToSave = customAvatarBase64 || selectedAvatar;
    
    try {
      const updatedFields: Partial<Profile> = {
        username: username.toLowerCase().trim(),
        displayName: displayName.trim(),
        avatarUrl: avatarUrlToSave,
        bio: bio.trim(),
        favoriteCategory: favCategory,
        currentStreak: 0,
        longestStreak: 0
      };

      await updateProfile(user.id, updatedFields);
      onOnboardingComplete({ ...user, ...updatedFields });
    } catch (err: any) {
      console.error(err);
      setError('Failed to bind your sketchbook binding: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col max-w-xl mx-auto h-full justify-center py-4 select-none">
      
      {/* Progress Indicators */}
      <div className="flex justify-center items-center gap-2 mb-8">
        {[1, 2, 3].map((s) => (
          <div
            key={s}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              step >= s ? 'w-8 bg-amber-800' : 'w-2 bg-stone-300'
            }`}
          />
        ))}
      </div>

      <div className="bg-[#faf8f3] border border-[#e8dfcf] rounded-2xl p-6 sm:p-8 shadow-md relative overflow-hidden">
        
        {/* Watercolor overlay element */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-200/10 rounded-full filter blur-2xl pointer-events-none" />

        {/* STEP 1: Name and Pen Name */}
        {step === 1 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="text-center">
              <div className="w-12 h-12 bg-amber-100/60 text-amber-800 rounded-full flex items-center justify-center mx-auto mb-3 shadow-inner">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-serif font-black text-stone-800">Choose Your Pen Name</h3>
              <p className="text-xs text-stone-500 italic mt-1">This is how your fellow artists will see and mention you.</p>
            </div>

            {error && <div className="p-2.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded font-serif italic">{error}</div>}

            <div className="space-y-4">
              <div>
                <label className="block text-[11px] font-mono uppercase text-stone-600 tracking-wider mb-1">
                  Unique Username (lowercase, no spaces)
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/\s+/g, ''))}
                  placeholder="e.g., rembrandt_12"
                  className="w-full px-3 py-2 text-xs font-serif bg-white border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-700 focus:border-amber-700 text-stone-800"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase text-stone-600 tracking-wider mb-1">
                  Pen Name / Display Name
                </label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="e.g., Rembrandt van Rijn"
                  className="w-full px-3 py-2 text-xs font-serif bg-white border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-700 focus:border-amber-700 text-stone-800"
                />
              </div>
            </div>

            <button
              onClick={handleNextStep}
              className="w-full py-2.5 mt-4 rounded-lg bg-amber-800 hover:bg-amber-900 text-stone-100 font-serif font-bold text-xs flex items-center justify-center gap-1.5 shadow-[2px_2px_0_rgba(18,12,8,0.2)] hover:shadow-none translate-y-[-1px] active:translate-y-0 transition-all cursor-pointer select-none"
            >
              <span>Next Page</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </motion.div>
        )}

        {/* STEP 2: Choose Sticker Portrait Avatar */}
        {step === 2 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="text-center">
              <h3 className="text-xl font-serif font-black text-stone-800">Select Portrait Sticker</h3>
              <p className="text-xs text-stone-500 italic mt-1">Pick an artful mascot or ink your own custom image.</p>
            </div>

            {/* Current Selected Preview */}
            <div className="flex justify-center">
              <div className="relative">
                <div className="w-24 h-24 rounded-full border-4 border-stone-100 overflow-hidden shadow-md bg-stone-50 flex items-center justify-center">
                  <img
                    src={customAvatarBase64 || selectedAvatar}
                    alt="avatar-preview"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <label className="absolute bottom-0 right-0 bg-[#e4dac4] text-stone-800 p-2 rounded-full shadow border border-stone-300 cursor-pointer hover:bg-[#d6cbaf] transition-colors">
                  <Camera className="w-4 h-4" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarFile}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* Presets List */}
            <div>
              <p className="text-[10px] font-mono text-stone-500 uppercase tracking-wider text-center mb-3">Watercolor Presets</p>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                {PRESET_AVATARS.map((av) => {
                  const isChosen = !customAvatarBase64 && selectedAvatar === av.url;
                  return (
                    <button
                      key={av.name}
                      onClick={() => {
                        setCustomAvatarBase64('');
                        setSelectedAvatar(av.url);
                      }}
                      className={`relative rounded-full overflow-hidden border-2 cursor-pointer transition-transform ${
                        isChosen ? 'border-amber-800 scale-110 shadow-sm' : 'border-stone-200/60 hover:scale-105'
                      }`}
                    >
                      <img src={av.url} alt={av.name} className="w-12 h-12 object-cover" referrerPolicy="no-referrer" />
                      {isChosen && (
                        <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
                          <Check className="w-4 h-4 text-white font-black" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              onClick={handleNextStep}
              className="w-full py-2.5 mt-4 rounded-lg bg-amber-800 hover:bg-amber-900 text-stone-100 font-serif font-bold text-xs flex items-center justify-center gap-1.5 shadow-[2px_2px_0_rgba(18,12,8,0.2)] hover:shadow-none translate-y-[-1px] active:translate-y-0 transition-all cursor-pointer select-none"
            >
              <span>Next Page</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </motion.div>
        )}

        {/* STEP 3: Bio and Favorite Category */}
        {step === 3 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="text-center">
              <h3 className="text-xl font-serif font-black text-stone-800">Configure Your Studio</h3>
              <p className="text-xs text-stone-500 italic mt-1">What inspires your fingers most?</p>
            </div>

            {error && <div className="p-2 bg-red-50 text-red-700 text-xs rounded font-serif italic">{error}</div>}

            <div className="space-y-4">
              <div>
                <label className="block text-[11px] font-mono uppercase text-stone-600 tracking-wider mb-1">
                  Describe Your Medium / Bio
                </label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="e.g., Quiet architect and coffee-ink lover. Prefer fine nib pens and twilight drafting."
                  rows={3}
                  className="w-full px-3 py-2 text-xs font-serif bg-white border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-700 focus:border-amber-700 text-stone-800"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase text-stone-600 tracking-wider mb-1">
                  Favorite Sketch Theme
                </label>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setFavCategory(cat)}
                      className={`px-3 py-1.5 text-xs font-serif rounded-lg border transition-all cursor-pointer ${
                        favCategory === cat
                          ? 'bg-[#3e2d24] text-white border-stone-800 shadow-sm'
                          : 'bg-white border-stone-300 text-stone-600 hover:bg-[#faf5ea]'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={handleSaveProfile}
              disabled={loading}
              className="w-full py-2.5 mt-4 rounded-lg bg-emerald-800 hover:bg-emerald-950 disabled:bg-stone-400 text-stone-100 font-serif font-bold text-xs flex items-center justify-center gap-1.5 shadow-[2px_2px_0_rgba(18,12,8,0.2)] hover:shadow-none translate-y-[-1px] active:translate-y-0 transition-all cursor-pointer select-none"
            >
              {loading ? (
                <span>Binding your page...</span>
              ) : (
                <>
                  <BookOpen className="w-4 h-4" />
                  <span>Bind My Journal</span>
                </>
              )}
            </button>
          </motion.div>
        )}

      </div>
    </div>
  );
}
