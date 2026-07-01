import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Award, Plus, Calendar, Clock, Users, ShieldAlert, Image as ImageIcon, CheckCircle, Lock, Upload, Feather } from 'lucide-react';
import { 
  getChallengesForUser, 
  createPrivateChallenge, 
  getFriendsList, 
  submitChallengeDrawing, 
  getChallengeSubmissions,
  getSubmission
} from '../lib/firebase';
import { Profile, PrivateChallenge, ChallengeSubmission, Prompt } from '../types';
import SketchCanvas from './SketchCanvas';

interface ChallengesViewProps {
  user: Profile;
}

export default function ChallengesView({ user }: ChallengesViewProps) {
  const [challenges, setChallenges] = useState<PrivateChallenge[]>([]);
  const [friends, setFriends] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasCompletedToday, setHasCompletedToday] = useState(false);
  
  // Create Challenge states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [customPrompt, setCustomPrompt] = useState('');
  const [deadline, setDeadline] = useState('24 Hours');
  const [selectedFriends, setSelectedFriends] = useState<string[]>([]);
  const [isCreating, setIsCreating] = useState(false);

  // Active expanded challenge to view submissions or submit sketch
  const [activeChallengeId, setActiveChallengeId] = useState<string | null>(null);
  const [challengeSubs, setChallengeSubs] = useState<ChallengeSubmission[]>([]);
  const [showCanvasMode, setShowCanvasMode] = useState(false);
  const [canvasDataUrl, setCanvasDataUrl] = useState('');
  const [challengeCaption, setChallengeCaption] = useState('');
  const [isSubmittingChallenge, setIsSubmittingChallenge] = useState(false);

  const checkEligibilityAndLoad = async () => {
    try {
      // 1. Check if user completed today's daily prompt first
      const today = new Date();
      const startOfYear2026 = new Date('2026-01-01T00:00:00');
      const msDiff = today.getTime() - startOfYear2026.getTime();
      const dayIndex = Math.floor(msDiff / (1000 * 60 * 60 * 24));
      
      const subId = `${user.id}_prompt_prompt_${dayIndex}`;
      const subDoc = await getSubmission(subId);
      if (subDoc) {
        setHasCompletedToday(true);
      }

      // 2. Load challenges
      const list = await getChallengesForUser(user.id);
      setChallenges(list);

      // 3. Load friends list
      const friendsList = await getFriendsList(user.id);
      setFriends(friendsList);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkEligibilityAndLoad();
  }, []);

  const handleCreateChallenge = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customPrompt.trim()) return;
    if (selectedFriends.length === 0) {
      alert('Please invite at least one friend to your private duel!');
      return;
    }

    setIsCreating(true);
    try {
      await createPrivateChallenge(
        user.id,
        customPrompt,
        deadline,
        selectedFriends
      );

      // Refresh list
      const list = await getChallengesForUser(user.id);
      setChallenges(list);
      
      // Reset form
      setCustomPrompt('');
      setSelectedFriends([]);
      setShowCreateModal(false);
      alert('Your private drawing challenge has been created and invitations dispatched!');
    } catch (err: any) {
      console.error(err);
      alert('Failed to launch duel: ' + err.message);
    } finally {
      setIsCreating(false);
    }
  };

  const handleOpenChallengeDetails = async (cId: string) => {
    setActiveChallengeId(cId);
    setCanvasDataUrl('');
    setChallengeCaption('');
    setShowCanvasMode(false);
    try {
      const subs = await getChallengeSubmissions(cId);
      setChallengeSubs(subs);
    } catch (err) {
      console.error(err);
    }
  };

  const handleChallengeSubmit = async () => {
    if (!activeChallengeId || !canvasDataUrl) return;
    setIsSubmittingChallenge(true);
    try {
      await submitChallengeDrawing(
        activeChallengeId,
        user.id,
        canvasDataUrl,
        challengeCaption
      );

      // Refresh challenge submissions list
      const subs = await getChallengeSubmissions(activeChallengeId);
      setChallengeSubs(subs);
      
      setCanvasDataUrl('');
      setChallengeCaption('');
      setShowCanvasMode(false);
      alert('Your drawing has been entered into the private duel!');
    } catch (err: any) {
      console.error(err);
      alert('Failed to upload challenge sketch: ' + err.message);
    } finally {
      setIsSubmittingChallenge(false);
    }
  };

  const handleToggleFriendSelection = (fId: string) => {
    setSelectedFriends(prev => 
      prev.includes(fId) ? prev.filter(id => id !== fId) : [...prev, fId]
    );
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-[#64748B] font-serif italic">
        <Award className="w-8 h-8 text-[#8E94F2] animate-bounce mb-2" />
        <span>Sorting through active duels...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-full justify-between gap-4 relative select-none">
      
      {/* HEADER SECTION */}
      <div className="flex items-center justify-between border-b border-[#CBD5E1] pb-3">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#64748B]">Private Arenas</span>
          <h3 className="font-serif text-lg font-black text-[#2D3748] leading-tight">Private Duels</h3>
        </div>

        {hasCompletedToday ? (
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-[#8E94F2] hover:bg-[#8E94F2]/90 text-white text-xs font-serif font-bold rounded-lg shadow-[2px_2px_0_rgba(142,148,242,0.15)] hover:shadow-none translate-y-[-1px] active:translate-y-0 transition-all cursor-pointer flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Create Duel</span>
          </button>
        ) : (
          <div className="bg-[#F0F4F8] text-[#64748B] border border-[#CBD5E1] text-2xs font-serif italic p-1.5 px-3 rounded-lg flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-[#64748B]/60" />
            <span>Locked until today's sketch is bound</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 flex-grow my-2">
        
        {/* LEFT COLUMN: LIST OF ACTIVE CHALLENGES */}
        <div className="md:col-span-6 space-y-4">
          <h4 className="font-serif text-sm font-black text-[#2D3748]">Active Duels</h4>
          
          {challenges.length === 0 ? (
            <div className="py-12 border border-dashed border-[#CBD5E1] rounded-xl bg-white text-center text-[#64748B] font-serif italic px-6">
              <span>No active private challenges yet. Complete today's daily ritual to challenge your friends!</span>
            </div>
          ) : (
            <div className="space-y-3.5 max-h-[500px] overflow-y-auto no-scrollbar pr-1">
              {challenges.map((c) => {
                const isCreator = c.creatorId === user.id;
                const isViewing = activeChallengeId === c.id;

                return (
                  <div
                    key={c.id}
                    onClick={() => handleOpenChallengeDetails(c.id)}
                    className={`bg-white border p-4 rounded-xl cursor-pointer shadow-xs transition-all relative ${
                      isViewing ? 'border-[#8E94F2] bg-[#8E94F2]/5 ring-1 ring-[#8E94F2]/10' : 'border-[#CBD5E1] hover:border-[#8E94F2]/60'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono text-[#64748B] uppercase tracking-widest">
                        By {isCreator ? 'You' : c.creatorName}
                      </span>
                      <div className="bg-[#F0F4F8] px-2 py-0.5 rounded text-[9px] font-mono text-[#64748B] flex items-center gap-1 border border-[#CBD5E1]/40">
                        <Clock className="w-3 h-3" />
                        <span>{c.deadline}</span>
                      </div>
                    </div>

                    <h5 className="font-serif font-black text-[#2D3748] text-sm mt-1.5 leading-snug">
                      "{c.promptText}"
                    </h5>

                    <div className="flex items-center gap-2 mt-3.5 text-3xs font-mono text-[#64748B] uppercase tracking-tight">
                      <Users className="w-3.5 h-3.5" />
                      <span>{c.invitedFriends.length + 1} Contenders</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: ACTIVE CHALLENGE SUBMISSIONS / DRAWING PANEL */}
        <div className="md:col-span-6">
          {activeChallengeId ? (
            <div className="bg-[#F8FAFC] border border-[#CBD5E1] p-5 rounded-2xl shadow-xs space-y-4">
              
              {/* Challenge Details header */}
              {(() => {
                const c = challenges.find(item => item.id === activeChallengeId);
                if (!c) return null;
                const userAlreadySubmitted = challengeSubs.some(s => s.userId === user.id);

                return (
                  <div className="space-y-4">
                    <div className="border-b border-[#CBD5E1] pb-3">
                      <span className="text-[10px] font-mono uppercase text-[#8E94F2] tracking-widest font-bold">Active Duel Room</span>
                      <h4 className="font-serif text-base font-black text-[#2D3748] leading-tight mt-1">
                        "{c.promptText}"
                      </h4>
                      <p className="text-[10px] font-mono text-[#64748B] mt-1 uppercase">Deadline: {c.deadline}</p>
                    </div>
 
                    {/* Submissions Grid */}
                    <div>
                      <h5 className="font-serif text-2xs font-bold uppercase tracking-wider text-[#64748B] mb-2">Contender Submissions</h5>
                      {challengeSubs.length === 0 ? (
                        <p className="text-2xs font-serif italic text-[#64748B] py-3 text-center">The gallery is empty. Be the first to ink!</p>
                      ) : (
                        <div className="grid grid-cols-2 gap-3">
                          {challengeSubs.map((s) => (
                            <div key={s.id} className="bg-white border border-[#CBD5E1] p-2 rounded-xl text-center space-y-1">
                              <div className="aspect-square bg-[#F8FAFC] border border-[#CBD5E1]/60 rounded overflow-hidden">
                                <img src={s.imageUrl} alt="sub" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                              </div>
                              <p className="text-[10px] font-serif font-bold text-[#2D3748] truncate">{s.userDisplayName}</p>
                              {s.caption && <p className="text-[9px] font-serif italic text-[#64748B] truncate">"{s.caption}"</p>}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
 
                    {/* Submit Area for active challenge */}
                    <div className="border-t border-[#CBD5E1] pt-4">
                      {userAlreadySubmitted ? (
                        <div className="bg-[#8E94F2]/10 border border-[#8E94F2]/50 text-[#8E94F2] p-3 rounded-xl flex items-center gap-2">
                          <CheckCircle className="w-5 h-5 flex-shrink-0" />
                          <div className="leading-tight">
                            <p className="text-2xs font-serif font-bold">Your sketch has been entered!</p>
                            <p className="text-[10px] text-[#8E94F2]/80 font-serif italic mt-0.5">Wait for your friends to submit their drafts.</p>
                          </div>
                        </div>
                      ) : showCanvasMode ? (
                        <div className="space-y-3">
                          <SketchCanvas 
                            onSaveSnapshot={(data) => setCanvasDataUrl(data)}
                          />
 
                          {canvasDataUrl && (
                            <div className="p-3 bg-[#8E94F2]/10 rounded-lg border border-[#8E94F2]/40 space-y-2">
                              <p className="text-2xs text-[#8E94F2] font-serif italic">Duel draft captured! Add a caption below.</p>
                              <div className="flex gap-2">
                                <input
                                  type="text"
                                  value={challengeCaption}
                                  onChange={(e) => setChallengeCaption(e.target.value)}
                                  placeholder="Add an artist caption..."
                                  className="flex-grow px-2 py-1.5 text-xs font-serif bg-white border border-[#CBD5E1] rounded focus:outline-none focus:border-[#8E94F2]"
                                />
                                <button
                                  onClick={handleChallengeSubmit}
                                  disabled={isSubmittingChallenge}
                                  className="px-4 py-1.5 bg-[#8E94F2] text-white font-serif text-xs rounded hover:bg-[#8E94F2]/90 font-bold cursor-pointer shadow-xs"
                                >
                                  {isSubmittingChallenge ? 'Sending...' : 'Submit Entry'}
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      ) : (
                        <button
                          onClick={() => setShowCanvasMode(true)}
                          className="w-full py-2.5 bg-[#8E94F2] hover:bg-[#8E94F2]/90 text-white text-xs font-serif font-bold rounded-xl flex items-center justify-center gap-1.5 shadow-[2px_2px_0_rgba(142,148,242,0.15)] hover:shadow-none translate-y-[-1px] active:translate-y-0 cursor-pointer"
                        >
                          <Feather className="w-4 h-4" />
                          <span>Enter Your Duel Sketch</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })()}
 
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-[#64748B] font-serif italic text-xs py-12 border border-dashed border-[#CBD5E1] rounded-2xl bg-[#F8FAFC]/60 p-6 text-center">
              <span>Select an active duel from the left scroll list to review submissions and enter your drawing!</span>
            </div>
          )}
        </div>

      </div>

      {/* CREATE MODAL DIALOG */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-[#2D3748]/60 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0" onClick={() => setShowCreateModal(false)} />
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-md bg-[#F0F4F8] border border-[#CBD5E1] rounded-2xl p-6 shadow-2xl relative z-10 space-y-4"
          >
            <div className="border-b border-[#CBD5E1] pb-2">
              <h4 className="font-serif text-lg font-black text-[#2D3748]">Draft Private Challenge</h4>
              <p className="text-2xs text-[#64748B] font-serif italic mt-0.5">Create a separate custom challenge for close friends.</p>
            </div>

            <form onSubmit={handleCreateChallenge} className="space-y-4">
              <div>
                <label className="block text-[10px] font-mono uppercase text-[#2D3748] tracking-wider mb-1">
                  Custom Drawing Prompt
                </label>
                <input
                  type="text"
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  placeholder="e.g., A vintage teapot overgrown with deep sea coral."
                  className="w-full px-3 py-2 text-xs font-serif bg-white border border-[#CBD5E1] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#8E94F2] focus:border-[#8E94F2] text-[#2D3748]"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase text-[#2D3748] tracking-wider mb-1">
                  Time Deadline
                </label>
                <select
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-serif bg-white border border-[#CBD5E1] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#8E94F2] focus:border-[#8E94F2] text-[#2D3748]"
                >
                  <option value="12 Hours">12 Hours</option>
                  <option value="24 Hours">24 Hours</option>
                  <option value="48 Hours">48 Hours</option>
                  <option value="3 Days">3 Days</option>
                  <option value="7 Days">7 Days</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase text-[#2D3748] tracking-wider mb-2">
                  Select Friends to Invite
                </label>
                {friends.length === 0 ? (
                  <p className="text-2xs font-serif italic text-[#64748B] py-1.5">You have no companion artists. Connect with friends first!</p>
                ) : (
                  <div className="space-y-2 max-h-32 overflow-y-auto pr-1 border border-[#CBD5E1] rounded-lg p-2.5 bg-white">
                    {friends.map((friend) => {
                      const checked = selectedFriends.includes(friend.id);
                      return (
                        <label key={friend.id} className="flex items-center gap-2.5 text-xs font-serif text-[#2D3748] cursor-pointer">
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => handleToggleFriendSelection(friend.id)}
                            className="rounded border-[#CBD5E1] text-[#8E94F2] focus:ring-[#8E94F2]"
                          />
                          <div className="w-5 h-5 rounded-full overflow-hidden bg-[#E1E8F0] border border-[#CBD5E1]/30 flex-shrink-0">
                            {friend.avatarUrl ? (
                              <img src={friend.avatarUrl} alt="av" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                            ) : (
                              friend.displayName.charAt(0)
                            )}
                          </div>
                          <span>{friend.displayName}</span>
                        </label>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 border border-[#CBD5E1] rounded-lg text-xs font-serif text-[#2D3748] hover:bg-[#F8FAFC]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreating}
                  className="px-5 py-2 bg-[#8E94F2] text-white rounded-lg text-xs font-serif font-bold hover:bg-[#8E94F2]/90 shadow-[2px_2px_0_rgba(142,148,242,0.15)] transition-all cursor-pointer"
                >
                  {isCreating ? 'Dispatching...' : 'Launch Duel'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

    </div>
  );
}
