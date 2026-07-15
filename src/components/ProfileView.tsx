import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { CalendarRange, Flame, Award, Image as ImageIcon, Download, Star, Sparkles, Feather, Clock, CheckCircle, Users, Heart, Trophy, Paintbrush } from 'lucide-react';
import { getProfileSubmissions, getFriendsList } from '../lib/firebase';
import { Profile, Submission } from '../types';

interface ProfileViewProps {
  user: Profile;
  onRefreshUser: () => void;
  onSelectSubmissionInFeed: (subId: string) => void;
}

const MILESTONES = [
  { id: 'first', title: 'First Pigment', desc: 'Inked your very first daily sketch.', icon: Sparkles, color: 'text-amber-600 bg-amber-50 border-amber-200' },
  { id: 'streak3', title: 'Loyal Scribe', desc: 'Maintained a 3-day drawing streak.', icon: Flame, color: 'text-orange-600 bg-orange-50 border-orange-200' },
  { id: 'streak7', title: 'Enlightened Scribe', desc: 'Maintained a 7-day drawing streak.', icon: Flame, color: 'text-red-600 bg-red-50 border-red-200' },
  { id: 'streak14', title: 'Vanguard Artist', desc: 'Maintained a 14-day drawing streak.', icon: Trophy, color: 'text-purple-600 bg-purple-50 border-purple-200' },
  { id: 'streak30', title: 'Grandmaster Scribe', desc: 'Maintained a 30-day drawing streak.', icon: Paintbrush, color: 'text-rose-600 bg-rose-50 border-rose-200' },
  { id: 'prolific5', title: 'Gallery Curator', desc: 'Inked 5 or more drawings in your sketchbook.', icon: ImageIcon, color: 'text-teal-600 bg-teal-50 border-teal-200' },
  { id: 'master10', title: 'Visual Novelist', desc: 'Inked 10 or more drawings in your sketchbook.', icon: Feather, color: 'text-indigo-600 bg-indigo-50 border-indigo-200' },
  { id: 'critic', title: 'Art Appreciator', desc: 'Left supportive star ratings for friends.', icon: Star, color: 'text-yellow-600 bg-yellow-50 border-yellow-200' },
  { id: 'circle_initiate', title: 'Circle Initiate', desc: 'Connected with at least 1 friend in your Circle.', icon: Users, color: 'text-sky-600 bg-sky-50 border-sky-200' },
  { id: 'social_catalyst', title: 'Social Catalyst', desc: 'Connected with 3 or more friends in your Circle.', icon: Heart, color: 'text-pink-600 bg-pink-50 border-pink-200' },
  { id: 'challenge', title: 'Duel Master', desc: 'Participated in a private challenge.', icon: Award, color: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
];

export default function ProfileView({ user, onRefreshUser, onSelectSubmissionInFeed }: ProfileViewProps) {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [friendsCount, setFriendsCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [collageLoading, setCollageLoading] = useState(false);

  const loadProfileStats = async () => {
    try {
      const [subs, friends] = await Promise.all([
        getProfileSubmissions(user.id),
        getFriendsList(user.id)
      ]);
      setSubmissions(subs);
      setFriendsCount(friends.length);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfileStats();
  }, [user.id]);

  // Generate Season Collage on an HTML5 canvas and trigger download
  const handleDownloadCollage = async () => {
    if (submissions.length === 0) {
      alert('You have no drawings in your sketchbook yet to compile into a collage!');
      return;
    }

    setCollageLoading(true);
    try {
      const canvas = document.createElement('canvas');
      // Set size for a beautiful 3x3 or 4x4 high res square grid
      canvas.width = 1200;
      canvas.height = 1200;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Fill elegant cream textured background
      ctx.fillStyle = '#faf6f0';
      ctx.fillRect(0, 0, 1200, 1200);

      // Draw title board
      ctx.fillStyle = '#3c2a21';
      ctx.font = 'bold 42px Georgia';
      ctx.textAlign = 'center';
      ctx.fillText(`${user.displayName.toUpperCase()}'S SKETCHBOOK COLLAGE`, 600, 100);
      
      ctx.font = 'italic 24px Georgia';
      ctx.fillStyle = '#7a6a5e';
      ctx.fillText(`Season Progress — Volume I`, 600, 140);

      // Draw grid borders
      ctx.strokeStyle = '#ded7ca';
      ctx.lineWidth = 2;
      ctx.strokeRect(80, 200, 1040, 920);

      // Get up to 9 recent drawings
      const collageSketches = submissions.slice(0, 9);
      const cols = 3;
      const cardWidth = 300;
      const cardHeight = 260;
      const gapX = 40;
      const gapY = 40;

      // Load all images asynchronously
      const loadImage = (url: string): Promise<HTMLImageElement> => {
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.crossOrigin = 'anonymous'; // prevent tainted canvas
          img.onload = () => resolve(img);
          img.onerror = () => {
            // fallback if tainted/blocked
            const fallback = new Image();
            fallback.onload = () => resolve(fallback);
            fallback.src = url; // try direct src
          };
          img.src = url;
        });
      };

      const images = await Promise.all(collageSketches.map(s => loadImage(s.imageUrl)));

      // Render each card polaroid-style on the canvas
      images.forEach((img, i) => {
        const col = i % cols;
        const row = Math.floor(i / cols);

        const x = 120 + col * (cardWidth + gapX);
        const y = 240 + row * (cardHeight + gapY);

        // Draw polaroid white shadow frame
        ctx.fillStyle = '#ffffff';
        ctx.shadowColor = 'rgba(0, 0, 0, 0.08)';
        ctx.shadowBlur = 10;
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 4;
        ctx.fillRect(x, y, cardWidth, cardHeight);

        // Reset shadow
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;

        // Draw card border outline
        ctx.strokeStyle = '#eae4d6';
        ctx.lineWidth = 1;
        ctx.strokeRect(x, y, cardWidth, cardHeight);

        // Draw drawing image inside frame
        const innerGap = 12;
        const imgW = cardWidth - innerGap * 2;
        const imgH = cardHeight - innerGap * 4;
        try {
          ctx.drawImage(img, x + innerGap, y + innerGap, imgW, imgH);
        } catch (e) {
          // fallback box if load issue
          ctx.fillStyle = '#ebdcb9';
          ctx.fillRect(x + innerGap, y + innerGap, imgW, imgH);
        }

        // Draw prompt title note at bottom of polaroid card
        const promptText = collageSketches[i].caption || collageSketches[i].promptText.substring(0, 20);
        ctx.fillStyle = '#5c4a3e';
        ctx.font = 'italic 12px Courier';
        ctx.textAlign = 'center';
        ctx.fillText(`“${promptText.substring(0, 24)}”`, x + cardWidth / 2, y + cardHeight - 16);
      });

      // Export and trigger download
      const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
      const link = document.createElement('a');
      link.download = `${user.username}_season_collage.jpg`;
      link.href = dataUrl;
      link.click();
      alert('Your Season collage download has been prepared and dispatched!');
    } catch (err: any) {
      console.error(err);
      alert('Could not compile canvas collage: ' + err.message);
    } finally {
      setCollageLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-stone-500 font-serif italic">
        <CalendarRange className="w-8 h-8 text-amber-800 animate-spin mb-2" />
        <span>Polishing your sketchbook cover...</span>
      </div>
    );
  }

  // Calculate unlock statuses of achievements based on stats
  const unlockedAchievements = MILESTONES.filter(m => {
    if (m.id === 'first') return submissions.length >= 1;
    if (m.id === 'streak3') return user.longestStreak >= 3;
    if (m.id === 'streak7') return user.longestStreak >= 7;
    if (m.id === 'streak14') return user.longestStreak >= 14;
    if (m.id === 'streak30') return user.longestStreak >= 30;
    if (m.id === 'prolific5') return submissions.length >= 5;
    if (m.id === 'master10') return submissions.length >= 10;
    if (m.id === 'critic') return submissions.some(s => s.ratingsCount > 0);
    if (m.id === 'circle_initiate') return friendsCount >= 1;
    if (m.id === 'social_catalyst') return friendsCount >= 3;
    if (m.id === 'challenge') return true; // always show for fun
    return false;
  });

  return (
    <div className="flex flex-col min-h-full justify-between gap-4 relative select-none">
      
      {/* HEADER WITH STATS SUMMARY */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 border-b border-stone-200 pb-5">
        
        {/* User Badge Profile info */}
        <div className="md:col-span-6 flex items-center gap-4">
          <div className="w-16 h-16 rounded-full overflow-hidden bg-stone-100 border border-stone-200 shadow-sm flex items-center justify-center font-bold font-serif text-2xl">
            {user.avatarUrl ? (
              <img src={user.avatarUrl} alt="av" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            ) : (
              user.displayName.charAt(0)
            )}
          </div>
          <div className="leading-tight">
            <h3 className="font-serif text-lg font-black text-stone-800">{user.displayName}</h3>
            <p className="text-xs text-stone-400 font-mono mt-0.5">@{user.username}</p>
            <p className="text-[11px] text-stone-500 font-serif italic mt-1.5 max-w-sm">
              "{user.bio || 'Silence is the companion of form and ink.'}"
            </p>
          </div>
        </div>

        {/* Streaks counters */}
        <div className="md:col-span-6 grid grid-cols-3 gap-3.5 text-center">
          <div className="bg-white border border-stone-200 p-2.5 rounded-2xl shadow-2xs">
            <Flame className="w-5 h-5 text-orange-600 mx-auto mb-1 animate-pulse" />
            <p className="font-mono text-base font-black text-stone-800 leading-none">{user.currentStreak}</p>
            <p className="text-[9px] font-mono text-stone-400 uppercase tracking-wider mt-1">Current Streak</p>
          </div>

          <div className="bg-white border border-stone-200 p-2.5 rounded-2xl shadow-2xs">
            <Award className="w-5 h-5 text-[#8daa91] mx-auto mb-1" />
            <p className="font-mono text-base font-black text-stone-800 leading-none">{user.longestStreak}</p>
            <p className="text-[9px] font-mono text-stone-400 uppercase tracking-wider mt-1">Max Streak</p>
          </div>

          <div className="bg-white border border-stone-200 p-2.5 rounded-2xl shadow-2xs">
            <ImageIcon className="w-5 h-5 text-[#4e6a53] mx-auto mb-1" />
            <p className="font-mono text-base font-black text-stone-800 leading-none">{submissions.length}</p>
            <p className="text-[9px] font-mono text-stone-400 uppercase tracking-wider mt-1">Total Sketches</p>
          </div>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-grow my-2">
        
        {/* LEFT PANEL: SKETCHES COLLAGE GENERATION BOARD & LOGS */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-serif text-sm font-black text-stone-700">Drawing Chronicles</h4>
            
            <button
              onClick={handleDownloadCollage}
              disabled={collageLoading}
              className="px-3 py-1.5 bg-[#8daa91] hover:bg-[#7ba180] disabled:bg-stone-300 text-white rounded-xl text-2xs font-serif font-bold flex items-center gap-1 cursor-pointer transition-all shadow-[1.5px_1.5px_0_rgba(141,170,145,0.15)]"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{collageLoading ? 'Weaving...' : 'Download Season Collage'}</span>
            </button>
          </div>

          {submissions.length === 0 ? (
            <div className="py-12 border border-dashed border-stone-200 rounded-3xl bg-[#fbf9f4] text-center text-stone-400 font-serif italic">
              <span>Your drawing journal is empty. Begin sketching daily to populate these pages.</span>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-h-[400px] overflow-y-auto no-scrollbar pr-1">
              {submissions.map((sub) => (
                <div
                  key={sub.id}
                  onClick={() => onSelectSubmissionInFeed(sub.id)}
                  className="bg-white border border-stone-200 p-2 rounded-2xl text-center cursor-pointer shadow-sm hover:shadow-md transition-shadow relative group hover:border-[#8daa91]/60"
                >
                  <div className="aspect-square bg-stone-50 border border-stone-100 rounded-xl overflow-hidden flex items-center justify-center">
                    <img src={sub.imageUrl} alt="grid-sub" className="w-full h-full object-contain p-1" referrerPolicy="no-referrer" />
                  </div>
                  <p className="text-3xs font-mono uppercase text-stone-400 mt-1.5">Day {sub.dayOfSeason}</p>
                  <p className="text-2xs font-serif italic text-stone-600 truncate">"{sub.caption || 'Daily ritual'}"</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT PANEL: MILESTONES & ACHIEVEMENTS stickers */}
        <div className="lg:col-span-4 space-y-4">
          <h4 className="font-serif text-sm font-black text-stone-700">Studio Milestones</h4>
          
          <div className="space-y-3 max-h-[380px] overflow-y-auto no-scrollbar pr-1">
            {MILESTONES.map((m) => {
              const isUnlocked = unlockedAchievements.some(un => un.id === m.id);
              const IconComp = m.icon;

              return (
                <div
                  key={m.id}
                  className={`border p-3 rounded-2xl flex items-start gap-3 transition-opacity ${
                    isUnlocked ? m.color : 'opacity-40 bg-stone-100 border-stone-300'
                  }`}
                >
                  <div className="p-1.5 bg-white rounded-xl border border-stone-200 flex-shrink-0 mt-0.5">
                    <IconComp className="w-4 h-4 text-inherit" />
                  </div>
                  <div className="leading-tight">
                    <div className="flex items-center gap-1">
                      <h5 className="text-2xs font-serif font-bold text-stone-800">{m.title}</h5>
                      {!isUnlocked && (
                        <span className="text-[8px] font-mono uppercase bg-stone-300 text-stone-600 px-1 rounded">Locked</span>
                      )}
                    </div>
                    <p className="text-3xs text-stone-500 font-serif mt-1 leading-relaxed">
                      {m.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
