import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ShieldAlert, Users, Award, BookOpen, Star, Sparkles, RefreshCw, AlertCircle, TrendingUp } from 'lucide-react';
import { getAllProfiles, getAllSubmissions, featureDrawing, unfeatureDrawing, getFeaturedDrawings } from '../lib/firebase';
import { getPromptForDay } from '../lib/prompts';
import { Profile, Submission } from '../types';

export default function AdminView() {
  const [users, setUsers] = useState<Profile[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [featuredSubIds, setFeaturedSubIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeAdminTab, setActiveAdminTab] = useState<'users' | 'prompts' | 'drawings'>('users');

  const loadAdminData = async () => {
    try {
      const [profiles, subs, featured] = await Promise.all([
        getAllProfiles(),
        getAllSubmissions(),
        getFeaturedDrawings()
      ]);
      setUsers(profiles);
      setSubmissions(subs);
      setFeaturedSubIds(featured.map(f => f.submissionId));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  const handleToggleFeature = async (subId: string, caption: string) => {
    const isFeatured = featuredSubIds.includes(subId);
    try {
      if (isFeatured) {
        await unfeatureDrawing(subId);
        setFeaturedSubIds(prev => prev.filter(id => id !== subId));
        alert('Drawing un-featured!');
      } else {
        await featureDrawing(subId, caption || 'Featured Masterpiece');
        setFeaturedSubIds(prev => [...prev, subId]);
        alert('Drawing featured inside global spotlights!');
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-stone-500 font-serif italic">
        <ShieldAlert className="w-8 h-8 text-[#8daa91] animate-spin mb-2" />
        <span>Authorizing Studio administrative credentials...</span>
      </div>
    );
  }

  // Sample prompt days list
  const samplePromptsList = Array.from({ length: 15 }, (_, i) => getPromptForDay(i));

  return (
    <div className="flex flex-col h-full justify-between gap-4 relative select-none">
      
      {/* HEADER TABS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200 pb-2">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-red-700 font-bold">Studio Overseer</span>
          <h3 className="font-serif text-lg font-black text-stone-800 leading-tight">Admin Manager</h3>
        </div>

        {/* Tab triggers */}
        <div className="flex bg-[#fbf9f4] p-1 rounded-xl border border-stone-200 self-start sm:self-auto">
          <button
            onClick={() => setActiveAdminTab('users')}
            className={`px-3 py-1.5 rounded-lg text-2xs font-serif font-bold transition-all cursor-pointer ${
              activeAdminTab === 'users' ? 'bg-[#8daa91] text-white shadow-sm' : 'text-stone-600 hover:text-stone-800'
            }`}
          >
            Manage Users ({users.length})
          </button>
          <button
            onClick={() => setActiveAdminTab('prompts')}
            className={`px-3 py-1.5 rounded-lg text-2xs font-serif font-bold transition-all cursor-pointer ${
              activeAdminTab === 'prompts' ? 'bg-[#8daa91] text-white shadow-sm' : 'text-stone-600 hover:text-stone-800'
            }`}
          >
            Prompts Log
          </button>
          <button
            onClick={() => setActiveAdminTab('drawings')}
            className={`px-3 py-1.5 rounded-lg text-2xs font-serif font-bold transition-all cursor-pointer ${
              activeAdminTab === 'drawings' ? 'bg-[#8daa91] text-white shadow-sm' : 'text-stone-600 hover:text-stone-800'
            }`}
          >
            Spotlight Features ({featuredSubIds.length})
          </button>
        </div>
      </div>

      <div className="flex-grow my-2">
        
        {/* TAB 1: USERS LIST */}
        {activeAdminTab === 'users' && (
          <div className="space-y-4">
            <h4 className="font-serif text-sm font-black text-stone-700">Studio Registration Logs</h4>
            <div className="overflow-x-auto border border-stone-200 rounded-3xl bg-white">
              <table className="w-full text-left border-collapse text-xs font-serif">
                <thead>
                  <tr className="bg-stone-50 border-b border-stone-200 text-stone-500 uppercase font-mono text-[9px] tracking-wider">
                    <th className="p-3">Pen-Name</th>
                    <th className="p-3">Username</th>
                    <th className="p-3">Joined Date</th>
                    <th className="p-3 text-center">Active Streak</th>
                    <th className="p-3 text-center">Max Streak</th>
                    <th className="p-3">Category</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 text-stone-700">
                  {users.map((u) => (
                    <tr key={u.id} className="hover:bg-stone-50/50">
                      <td className="p-3 font-bold flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full overflow-hidden bg-stone-100 flex-shrink-0">
                          {u.avatarUrl ? (
                            <img src={u.avatarUrl} alt="av" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                          ) : (
                            u.displayName.charAt(0)
                          )}
                        </div>
                        <span>{u.displayName}</span>
                      </td>
                      <td className="p-3 font-mono text-stone-500">@{u.username}</td>
                      <td className="p-3 text-stone-500">{new Date(u.joinedDate).toLocaleDateString()}</td>
                      <td className="p-3 text-center font-mono font-bold text-orange-600">{u.currentStreak} days</td>
                      <td className="p-3 text-center font-mono text-stone-600">{u.longestStreak} days</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 bg-stone-100 border border-stone-200 rounded text-[10px] text-stone-500 font-mono uppercase">
                          {u.favoriteCategory}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: PROMPTS LOG */}
        {activeAdminTab === 'prompts' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-serif text-sm font-black text-stone-700">Algorithmic Season Prompts (Sample Index)</h4>
              <button
                onClick={() => alert('New Season Prompt list generated successfully!')}
                className="px-3 py-1 bg-[#8daa91] hover:bg-[#7ba180] text-stone-100 rounded-xl text-2xs font-serif font-bold flex items-center gap-1 cursor-pointer"
              >
                <RefreshCw className="w-3 h-3 animate-spin" style={{ animationDuration: '4s' }} />
                <span>Compile Season 2</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[420px] overflow-y-auto no-scrollbar pr-1">
              {samplePromptsList.map((p) => (
                <div key={p.id} className="bg-white border border-stone-200 p-3.5 rounded-3xl flex flex-col justify-between shadow-2xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-mono text-stone-400 uppercase tracking-widest">Day {p.dayOfSeason}</span>
                    <span className={`px-1.5 py-0.5 rounded-lg text-[8px] font-mono uppercase ${
                      p.isWeeklyRidiculous ? 'bg-red-100 text-red-800 border border-red-300' : 'bg-[#fbf9f4] text-stone-500'
                    }`}>
                      {p.category}
                    </span>
                  </div>

                  <p className="font-serif font-bold text-stone-800 text-xs mt-2 leading-tight">
                    "{p.text}"
                  </p>

                  <div className="flex items-center gap-3 text-4xs font-mono text-stone-500 uppercase tracking-tight mt-3">
                    <span>Estimate: <strong className="text-stone-700">{p.difficulty}</strong></span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: DRAWINGS SPOTLIGHT FEATURE MANAGER */}
        {activeAdminTab === 'drawings' && (
          <div className="space-y-4">
            <h4 className="font-serif text-sm font-black text-stone-700">Spotlight Feature Submissions</h4>
            {submissions.length === 0 ? (
              <p className="text-2xs font-serif italic text-stone-500 text-center py-6">No drawings submitted to features yet.</p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-h-[420px] overflow-y-auto no-scrollbar pr-1">
                {submissions.map((sub) => {
                  const isFeatured = featuredSubIds.includes(sub.id);

                  return (
                    <div key={sub.id} className="bg-white border border-stone-200 p-2.5 rounded-3xl shadow-2xs space-y-2 text-center relative flex flex-col justify-between">
                      <div>
                        <div className="aspect-square bg-stone-50 border border-stone-100 rounded-2xl overflow-hidden">
                          <img src={sub.imageUrl} alt="sub" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        </div>
                        <p className="text-2xs font-serif font-bold text-stone-700 mt-2 truncate">{sub.userDisplayName}</p>
                        <p className="text-[10px] text-stone-400 font-serif italic truncate">"{sub.caption || 'Daily draft'}"</p>
                      </div>

                      <button
                        onClick={() => handleToggleFeature(sub.id, sub.caption)}
                        className={`w-full py-1 rounded-xl text-3xs font-serif font-bold cursor-pointer border transition-colors ${
                          isFeatured 
                            ? 'bg-[#8daa91]/10 text-[#4e6a53] border-[#8daa91]/30' 
                            : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-[#fbf9f4]'
                        }`}
                      >
                        {isFeatured ? '★ Featured Spotlight' : 'Spotlight Post'}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
