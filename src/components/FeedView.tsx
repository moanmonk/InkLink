import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Star, MessageSquare, Heart, Sparkles, X, Send, Trash2, Edit3, MessageCircle, AlertCircle } from 'lucide-react';
import { 
  getAllSubmissions, 
  reactToSubmission, 
  rateSubmission, 
  getSubmissionRatings, 
  addComment, 
  getComments, 
  deleteComment, 
  updateComment,
  getProfile,
  searchUsers
} from '../lib/firebase';
import { Submission, Comment, Rating, Profile } from '../types';

interface FeedViewProps {
  currentUser: Profile;
  initialSelectedSubmissionId?: string;
  onClearSelectedSubmissionId?: () => void;
}

const REACTION_TYPES = ['❤️', '🔥', '👏', '😂', '😭', '🤯', '⭐'];

export default function FeedView({ currentUser, initialSelectedSubmissionId, onClearSelectedSubmissionId }: FeedViewProps) {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [filteredSubmissions, setFilteredSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Selected submission details panel
  const [selectedSub, setSelectedSub] = useState<Submission | null>(null);
  const [subRatings, setSubRatings] = useState<Rating[]>([]);
  const [subComments, setSubComments] = useState<Comment[]>([]);
  
  // Comment & rating forms
  const [newComment, setNewComment] = useState('');
  const [replyingToCommentId, setReplyingToCommentId] = useState<string | null>(null);
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState('');
  const [userRating, setUserRating] = useState<number>(0);

  const loadFeedData = async () => {
    try {
      const list = await getAllSubmissions();
      setSubmissions(list);
      setFilteredSubmissions(list);
      
      // If initialized with a deep-linked submission ID, auto-open it!
      if (initialSelectedSubmissionId) {
        const found = list.find(s => s.id === initialSelectedSubmissionId);
        if (found) {
          handleOpenDetails(found);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFeedData();
  }, [initialSelectedSubmissionId]);

  // Handle Search
  useEffect(() => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) {
      setFilteredSubmissions(submissions);
      return;
    }

    const filtered = submissions.filter(sub => {
      return (
        sub.username.toLowerCase().includes(query) ||
        sub.userDisplayName.toLowerCase().includes(query) ||
        sub.promptText.toLowerCase().includes(query) ||
        sub.caption.toLowerCase().includes(query) ||
        sub.drawingNote.toLowerCase().includes(query)
      );
    });
    setFilteredSubmissions(filtered);
  }, [searchQuery, submissions]);

  const handleOpenDetails = async (sub: Submission) => {
    setSelectedSub(sub);
    setNewComment('');
    setReplyingToCommentId(null);
    setEditingCommentId(null);
    setUserRating(0);
    
    try {
      // Fetch ratings and comments
      const [ratings, comments] = await Promise.all([
        getSubmissionRatings(sub.id),
        getComments(sub.id)
      ]);
      setSubRatings(ratings);
      setSubComments(comments);

      // Find if current user already rated
      const existing = ratings.find(r => r.userId === currentUser.id);
      if (existing) {
        setUserRating(existing.rating);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // React action
  const handleReact = async (subId: string, reaction: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    try {
      await reactToSubmission(subId, currentUser.id, reaction);
      
      // Update locally immediately
      setSubmissions(prev => prev.map(s => {
        if (s.id === subId) {
          const reactions = { ...(s.reactions || {}) };
          if (!reactions[reaction]) reactions[reaction] = [];
          const idx = reactions[reaction].indexOf(currentUser.id);
          if (idx > -1) {
            reactions[reaction].splice(idx, 1);
          } else {
            reactions[reaction].push(currentUser.id);
          }
          if (reactions[reaction].length === 0) delete reactions[reaction];
          return { ...s, reactions };
        }
        return s;
      }));

      // If selected details is open, refresh its data
      if (selectedSub && selectedSub.id === subId) {
        setSelectedSub(prev => {
          if (!prev) return null;
          const reactions = { ...(prev.reactions || {}) };
          if (!reactions[reaction]) reactions[reaction] = [];
          const idx = reactions[reaction].indexOf(currentUser.id);
          if (idx > -1) {
            reactions[reaction].splice(idx, 1);
          } else {
            reactions[reaction].push(currentUser.id);
          }
          if (reactions[reaction].length === 0) delete reactions[reaction];
          return { ...prev, reactions };
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Submit Rating (1-5 stars)
  const handleRateSubmit = async (score: number) => {
    if (!selectedSub) return;
    setUserRating(score);
    try {
      await rateSubmission(selectedSub.id, currentUser.id, score);
      
      // Refresh details ratings list
      const ratings = await getSubmissionRatings(selectedSub.id);
      setSubRatings(ratings);

      // Dynamically calculate and update average rating in submissions list
      setSubmissions(prev => prev.map(s => {
        if (s.id === selectedSub.id) {
          const alreadyRated = subRatings.some(r => r.userId === currentUser.id);
          const incrementCount = alreadyRated ? 0 : 1;
          const differenceSum = alreadyRated 
            ? score - (subRatings.find(r => r.userId === currentUser.id)?.rating || 0)
            : score;
          return {
            ...s,
            ratingsCount: s.ratingsCount + incrementCount,
            ratingsSum: s.ratingsSum + differenceSum
          };
        }
        return s;
      }));

      // Update selected details object too
      setSelectedSub(prev => {
        if (!prev) return null;
        const alreadyRated = subRatings.some(r => r.userId === currentUser.id);
        return {
          ...prev,
          ratingsCount: prev.ratingsCount + (alreadyRated ? 0 : 1),
          ratingsSum: prev.ratingsSum + (alreadyRated ? score - (subRatings.find(r => r.userId === currentUser.id)?.rating || 0) : score)
        };
      });
    } catch (err) {
      console.error(err);
    }
  };

  // Add Comment
  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSub || !newComment.trim()) return;

    try {
      const added = await addComment(selectedSub.id, currentUser.id, newComment, replyingToCommentId);
      setSubComments(prev => [...prev, added]);
      setNewComment('');
      setReplyingToCommentId(null);
    } catch (err) {
      console.error(err);
    }
  };

  // Delete comment
  const handleDeleteComment = async (commentId: string) => {
    if (!window.confirm('Erase this comment from the journal?')) return;
    try {
      await deleteComment(commentId);
      setSubComments(prev => prev.filter(c => c.id !== commentId));
    } catch (err) {
      console.error(err);
    }
  };

  // Save edited comment
  const handleSaveEditComment = async (commentId: string) => {
    if (!editingText.trim()) return;
    try {
      await updateComment(commentId, editingText);
      setSubComments(prev => prev.map(c => c.id === commentId ? { ...c, text: editingText } : c));
      setEditingCommentId(null);
    } catch (err) {
      console.error(err);
    }
  };

  // Build comment trees helper
  const renderCommentTree = (parentId: string | null = null, depth = 0) => {
    const levelComments = subComments.filter(c => c.parentId === parentId);
    if (levelComments.length === 0) return null;

    return (
      <div className={`space-y-3 ${depth > 0 ? 'ml-6 pl-3 border-l border-[#CBD5E1]/50 mt-2' : 'mt-4'}`}>
        {levelComments.map((comment) => {
          const isOwnComment = comment.userId === currentUser.id;
          const isEditing = editingCommentId === comment.id;

          return (
            <div key={comment.id} className="bg-[#F8FAFC]/80 p-3 rounded-xl border border-[#CBD5E1]/50">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-[#E1E8F0] overflow-hidden flex items-center justify-center font-serif font-black text-[9px]">
                    {comment.userAvatar ? (
                      <img src={comment.userAvatar} alt="av" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    ) : (
                      comment.userDisplayName.charAt(0)
                    )}
                  </div>
                  <span className="text-2xs font-serif font-bold text-[#2D3748]">{comment.userDisplayName}</span>
                  <span className="text-[9px] font-mono text-[#64748B]">
                    {new Date(comment.timestamp).toLocaleDateString(undefined, { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => {
                      setReplyingToCommentId(comment.id);
                      setNewComment(`@${comment.username} `);
                    }}
                    className="text-[10px] font-mono text-[#64748B] hover:text-[#8E94F2] underline cursor-pointer"
                  >
                    Reply
                  </button>
                  {isOwnComment && (
                    <>
                      <button
                        onClick={() => {
                          setEditingCommentId(comment.id);
                          setEditingText(comment.text);
                        }}
                        className="text-[#64748B] hover:text-[#8E94F2] cursor-pointer"
                        title="Edit"
                      >
                        <Edit3 className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => handleDeleteComment(comment.id)}
                        className="text-[#64748B] hover:text-[#F09A9D] cursor-pointer"
                        title="Delete"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </>
                  )}
                </div>
              </div>

              {isEditing ? (
                <div className="mt-2 flex gap-1.5">
                  <input
                    type="text"
                    value={editingText}
                    onChange={(e) => setEditingText(e.target.value)}
                    className="flex-grow px-2.5 py-1 text-2xs font-serif border border-[#CBD5E1] bg-white rounded-xl focus:outline-none focus:border-[#8daa91]"
                  />
                  <button
                    onClick={() => handleSaveEditComment(comment.id)}
                    className="px-3 py-1 bg-[#8daa91] hover:bg-[#7ba180] text-white rounded-xl text-2xs font-serif font-bold"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingCommentId(null)}
                    className="text-2xs font-mono text-[#64748B] hover:text-stone-900"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <p className="text-xs font-serif text-[#2D3748] mt-1.5 leading-relaxed pl-1">
                  {comment.text}
                </p>
              )}

              {/* Nested replies recursive */}
              {renderCommentTree(comment.id, depth + 1)}
            </div>
          );
        })}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-[#64748B] font-serif italic">
        <Sparkles className="w-8 h-8 text-[#8daa91] animate-pulse mb-2" />
        <span>Smoothing the canvas sheets...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-full justify-between gap-4 relative select-none">
      
      {/* HEADER & SEARCH BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#CBD5E1] pb-3">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#64748B]">InkLink Circle Gallery</span>
          <h3 className="font-serif text-lg font-black text-[#2D3748] leading-tight">Shared Notebooks</h3>
        </div>

        {/* Dynamic Search Box */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-[#64748B] pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search sketches, prompts, artists..."
            className="w-full pl-9 pr-3 py-1.5 text-xs font-serif bg-white border border-[#CBD5E1] rounded-full focus:outline-none focus:ring-1 focus:ring-[#8daa91] focus:border-[#8daa91]"
          />
        </div>
      </div>

      {/* FEED GRID - PINTEREST STYLE */}
      <div className="flex-grow my-2">
        {filteredSubmissions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center text-[#64748B] font-serif italic border border-dashed border-[#CBD5E1] rounded-3xl p-6 bg-[#fbf9f4]">
            <AlertCircle className="w-8 h-8 text-[#64748B]/60 mb-2" />
            <span>No drawings matching your ink query. Be the first to start drawing!</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredSubmissions.map((sub) => {
              const ratingVal = sub.ratingsCount > 0 ? (sub.ratingsSum / sub.ratingsCount).toFixed(1) : 'No ratings';
              const totalReactions = (Object.values(sub.reactions || {}) as string[][]).reduce((sum, users) => sum + users.length, 0);

              return (
                <motion.div
                  key={sub.id}
                  onClick={() => handleOpenDetails(sub)}
                  className="bg-white border border-[#CBD5E1] p-3 rounded-3xl shadow-xs hover:shadow-sm transition-all duration-300 cursor-pointer relative group flex flex-col justify-between"
                  whileHover={{ y: -3 }}
                >
                  {/* Polaroid Frame */}
                  <div>
                    <div className="aspect-square w-full rounded-2xl bg-[#F8FAFC] border border-[#CBD5E1] overflow-hidden relative">
                      <img
                        src={sub.imageUrl}
                        alt="drawing-post"
                        className="w-full h-full object-contain p-1 transition-transform duration-500 group-hover:scale-102"
                        referrerPolicy="no-referrer"
                      />
                      
                      {/* Hover Star Indicator overlay */}
                      <div className="absolute top-2 left-2 bg-white/95 backdrop-blur-xs px-2 py-0.5 rounded text-[10px] font-mono text-[#2D3748] border border-[#CBD5E1] flex items-center gap-0.5 shadow-xs">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        <span>{ratingVal}</span>
                      </div>
                    </div>

                    <div className="mt-3 px-1">
                      <p className="text-2xs font-mono uppercase tracking-wider text-[#64748B]">Prompt: {sub.promptText.substring(0, 32)}...</p>
                      <p className="font-serif text-sm font-black text-[#2D3748] leading-tight mt-1 truncate">
                        {sub.caption || '“Sketched daily ritual”'}
                      </p>
                    </div>
                  </div>

                  {/* Footer metadata: Artist + quick reactions */}
                  <div className="mt-3 pt-2.5 border-t border-[#CBD5E1]/50 flex items-center justify-between px-1">
                    <div className="flex items-center gap-1.5 overflow-hidden">
                      <div className="w-5.5 h-5.5 rounded-full bg-[#E1E8F0] overflow-hidden flex-shrink-0 flex items-center justify-center font-bold text-[9px]">
                        {sub.userAvatarUrl ? (
                          <img src={sub.userAvatarUrl} alt="av" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        ) : (
                          sub.userDisplayName.charAt(0)
                        )}
                      </div>
                      <span className="text-[11px] font-serif font-bold text-[#2D3748] truncate">{sub.userDisplayName}</span>
                    </div>

                    <div className="flex items-center gap-2 text-[#64748B] text-2xs font-mono">
                      <span className="flex items-center gap-0.5">
                        <Heart className="w-3 h-3 text-[#ee98ad] fill-[#ee98ad]" />
                        <span>{totalReactions}</span>
                      </span>
                    </div>
                  </div>

                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* DETAIL DRAWER / PHYSICAL OPEN PAGE PANEL */}
      <AnimatePresence>
        {selectedSub && createPortal(
          <div className="fixed inset-0 bg-[#2D3748]/60 z-50 flex justify-end">
            
            {/* Backdrop click to close */}
            <button 
              className="absolute inset-0 bg-transparent w-full h-full cursor-pointer focus:outline-hidden" 
              onClick={() => {
                setSelectedSub(null);
                if (onClearSelectedSubmissionId) onClearSelectedSubmissionId();
              }} 
            />

            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 180 }}
              className="w-full max-w-lg bg-[#F0F4F8] h-full shadow-2xl relative z-10 flex flex-col border-l border-[#CBD5E1]"
            >
              {/* Paper overlay inside panel */}
              <div className="absolute inset-0 bg-[radial-gradient(#CBD5E1_1px,transparent_1px)] [background-size:16px_16px] opacity-15 pointer-events-none" />

              {/* Panel Header */}
              <div className="p-4 border-b border-[#CBD5E1] flex items-center justify-between bg-[#F8FAFC]/50 z-20 flex-shrink-0">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full overflow-hidden bg-[#E1E8F0] border border-[#CBD5E1] flex-shrink-0 flex items-center justify-center font-bold font-serif">
                    {selectedSub.userAvatarUrl ? (
                      <img src={selectedSub.userAvatarUrl} alt="av" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    ) : (
                      selectedSub.userDisplayName.charAt(0)
                    )}
                  </div>
                  <div>
                    <h4 className="font-serif text-xs font-bold text-[#2D3748] leading-none">{selectedSub.userDisplayName}</h4>
                    <span className="text-[9px] font-mono text-[#64748B]">
                      Inked on {new Date(selectedSub.uploadTime).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setSelectedSub(null);
                    if (onClearSelectedSubmissionId) {
                      onClearSelectedSubmissionId();
                    }
                  }}
                  className="p-3 bg-stone-100 hover:bg-stone-200 rounded-full transition-colors cursor-pointer flex items-center justify-center min-w-[44px] min-h-[44px] shadow-sm active:scale-95"
                  title="Close panel"
                >
                  <X className="w-5 h-5 text-[#8daa91]" />
                </button>
              </div>

              {/* Panel scrollable content */}
              <div className="flex-grow overflow-y-auto no-scrollbar p-4 sm:p-6 space-y-5 z-10">
                
                {/* LARGE DRAWING ARTWORK */}
                <div className="w-full rounded-3xl bg-white border border-[#CBD5E1] overflow-hidden shadow-xs p-2.5">
                  <img
                    src={selectedSub.imageUrl}
                    alt="expanded-drawing"
                    className="w-full h-auto max-h-[500px] object-contain rounded-2xl mx-auto"
                    referrerPolicy="no-referrer"
                  />
                </div>

                {/* PROMPT & INFO BLOCK */}
                <div className="bg-white border border-[#CBD5E1] p-4 rounded-3xl space-y-2">
                  <span className="text-[10px] font-mono uppercase text-[#4e6a53] tracking-widest">Ritual Prompt</span>
                  <p className="font-serif text-sm font-black text-[#2D3748] leading-tight">
                    {selectedSub.promptText}
                  </p>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-3xs font-mono text-[#64748B] uppercase tracking-tight">
                    <span>Instrument: {selectedSub.drawingNote}</span>
                    <span>Device: {selectedSub.device}</span>
                  </div>
                </div>

                {/* CAPTION BLOCK */}
                <div className="px-1 space-y-1">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#64748B]">Artist Note</span>
                  <blockquote className="font-serif italic text-[#2D3748] text-sm leading-relaxed border-l-2 border-[#8daa91]/40 pl-3">
                    {selectedSub.caption || '“A silent translation of form and shadow onto woodpulp.”'}
                  </blockquote>
                </div>

                {/* STAR RATINGS ROW */}
                <div className="border-t border-b border-[#CBD5E1] py-4 px-1 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-widest text-[#64748B]">Star Rating</span>
                      <h5 className="font-serif text-xs font-bold text-[#2D3748] mt-0.5">Rate this work (not anonymous)</h5>
                    </div>
                    <div className="text-right">
                      <p className="font-mono text-sm font-bold text-[#2D3748] leading-none">
                        {selectedSub.ratingsCount > 0 ? (selectedSub.ratingsSum / selectedSub.ratingsCount).toFixed(1) : 'No ratings'} ★
                      </p>
                      <p className="text-[9px] font-mono text-[#64748B] uppercase tracking-tight mt-0.5">Based on {selectedSub.ratingsCount} scores</p>
                    </div>
                  </div>

                  {/* Rate Interactive Stars */}
                  <div className="flex items-center gap-1.5">
                    {[1, 2, 3, 4, 5].map((star) => {
                      const isFilled = star <= userRating;
                      return (
                        <button
                          key={star}
                          onClick={() => handleRateSubmit(star)}
                          className="hover:scale-115 transition-transform cursor-pointer"
                        >
                          <Star className={`w-6 h-6 ${isFilled ? 'fill-amber-400 text-amber-400' : 'text-[#CBD5E1]'}`} />
                        </button>
                      );
                    })}
                  </div>

                  {/* Ratings List / Who Rated */}
                  {subRatings.length > 0 && (
                    <div className="space-y-1.5 pt-1">
                      <p className="text-[9px] font-mono text-[#64748B] uppercase tracking-wider">Reviewing Circle</p>
                      <div className="flex flex-wrap gap-1.5">
                        {subRatings.map((r) => (
                          <div key={r.id} className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-white border border-[#CBD5E1] text-2xs font-serif text-[#2D3748] shadow-xs">
                            <span>{r.userDisplayName}</span>
                            <span className="font-mono font-bold text-amber-500">{r.rating}★</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* EMOJI REACTIONS DRAWER */}
                <div className="space-y-3 px-1">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#64748B]">Cozy Reactions</span>
                  
                  <div className="flex flex-wrap gap-2">
                    {REACTION_TYPES.map((emoji) => {
                      const userIds = (selectedSub.reactions && selectedSub.reactions[emoji]) || [];
                      const hasReacted = userIds.includes(currentUser.id);
                      return (
                        <button
                          key={emoji}
                          onClick={() => handleReact(selectedSub.id, emoji)}
                          className={`px-3 py-1.5 rounded-full border text-xs flex items-center gap-1.5 cursor-pointer transition-all ${
                            hasReacted 
                              ? 'bg-[#8daa91]/10 border-[#8daa91] shadow-inner' 
                              : 'bg-white border-[#CBD5E1] hover:bg-[#F8FAFC]'
                          }`}
                        >
                          <span>{emoji}</span>
                          <span className="text-2xs font-mono font-bold text-[#2D3748]">{userIds.length}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* COMMENTS SECTION */}
                <div className="border-t border-[#CBD5E1] pt-4 space-y-3 px-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-[#64748B]">Threaded Comments</span>
                    <span className="text-3xs font-mono text-[#64748B] uppercase tracking-tight">{subComments.length} entries</span>
                  </div>

                  {/* Comment list recursive */}
                  {subComments.length === 0 ? (
                    <p className="text-2xs font-serif italic text-[#64748B] py-3 text-center">No commentary yet. Leave a constructive note!</p>
                  ) : (
                    renderCommentTree(null)
                  )}

                </div>

              </div>

              {/* PANEL BOTTOM: COMMENT INPUT DRAWER */}
              <div className="p-4 border-t border-[#CBD5E1] bg-white z-20 flex-shrink-0">
                {replyingToCommentId && (
                  <div className="mb-2 flex items-center justify-between bg-[#F0F4F8] border border-[#CBD5E1] p-1.5 px-3 rounded-xl text-2xs text-[#2D3748]">
                    <span>Replying to comment...</span>
                    <button
                      onClick={() => setReplyingToCommentId(null)}
                      className="font-mono text-[#64748B] hover:text-[#8daa91]"
                    >
                      Clear Reply
                    </button>
                  </div>
                )}
                
                <form onSubmit={handleAddComment} className="flex gap-2">
                  <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Ink your thoughts (mentions and emojis supported)..."
                    className="flex-grow px-3 py-2 text-xs font-serif bg-[#fbf9f4] border border-[#CBD5E1] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#8daa91] focus:border-[#8daa91]"
                    required
                  />
                  <button
                    type="submit"
                    className="p-2.5 bg-[#8daa91] hover:bg-[#7ba180] text-white rounded-xl transition-all shadow-[2px_2px_0_rgba(141,170,145,0.15)] hover:shadow-none translate-y-[-1.5px] active:translate-y-0 cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>

            </motion.div>
          </div>,
          document.body
        )}
      </AnimatePresence>

    </div>
  );
}
