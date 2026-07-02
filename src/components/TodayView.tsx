import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, Flame, Timer, Compass, Upload, Sparkles, Feather, Image as ImageIcon, Camera, Trash2 } from 'lucide-react';
import { getPromptForDay, getEncouragementForDay } from '../lib/prompts';
import { getSubmission, submitDrawing, deleteSubmission, getFriendsList, getSubmissionsForPrompt, uploadDrawingImage } from '../lib/firebase';
import { Profile, Submission, Prompt } from '../types';
import SketchCanvas from './SketchCanvas';
import ImageCropperModal from './ImageCropperModal';
import ConfirmationModal from './ConfirmationModal';

interface TodayViewProps {
  user: Profile;
  onNavigateToFeed: (submissionId?: string) => void;
  onRefreshUser: () => void;
}

const MOTIVATIONAL_QUOTES = [
  "“Every portrait that is painted with feeling is a portrait of the artist, not of the sitter.” — Oscar Wilde",
  "“Art is not what you see, but what you make others see.” — Edgar Degas",
  "“To draw you must close your eyes and sing.” — Pablo Picasso",
  "“Drawing is the honesty of the art. There is no possibility of cheating. It is either good or bad.” — Salvador Dali",
  "“Position yourself in the center of your page and let the ink find its path.” — Zen Sketcher",
  "“In drawing, one should look for the truth, not the outline.” — Ancient Master",
  "“The artist is nothing without the gift, but the gift is nothing without work.” — Emile Zola",
  "“Simplicity is the ultimate sophistication.” — Leonardo da Vinci"
];

export default function TodayView({ user, onNavigateToFeed, onRefreshUser }: TodayViewProps) {
  // Compute current day index based on the number of days since joined date or just absolute calendars,
  // Let's do a deterministic index based on joinedDate to give each user their personal journey,
  // or a shared global day so all friends get the EXACT SAME prompt each day!
  // "Friends react, rate and comment... Users receive one drawing prompt every day. A new season begins afterwards (28 days)."
  // To make it social and synchronous for friends, we should base the Day Index on the global calendar date!
  // This guarantees all friends share the SAME daily prompt! This is extremely smart for private circles!
  const today = new Date();
  const startOfYear2026 = new Date('2026-01-01T00:00:00');
  const msDiff = today.getTime() - startOfYear2026.getTime();
  const dayIndex = Math.floor(msDiff / (1000 * 60 * 60 * 24));

  const prompt: Prompt = getPromptForDay(dayIndex);
  
  const [isRevealed, setIsRevealed] = useState(false);
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCanvasMode, setShowCanvasMode] = useState(false);
  const [uploadFileBase64, setUploadFileBase64] = useState('');
  const [caption, setCaption] = useState('');
  const [drawingNote, setDrawingNote] = useState('');
  const [device, setDevice] = useState('Safari on iOS');
  const [isUploading, setIsUploading] = useState(false);
  
  const [cropperImageSrc, setCropperImageSrc] = useState('');
  const [isUploadingToStorage, setIsUploadingToStorage] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  const [timeRemaining, setTimeRemaining] = useState('');
  const [friendsWhoCompleted, setFriendsWhoCompleted] = useState<Profile[]>([]);

  // Calculate quote based on dayIndex
  const quote = MOTIVATIONAL_QUOTES[dayIndex % MOTIVATIONAL_QUOTES.length];

  // Load existing submission for today
  const loadTodaySubmission = async () => {
    try {
      const subId = `${user.id}_prompt_${prompt.id}`;
      const sub = await getSubmission(subId);
      if (sub) {
        setSubmission(sub);
        setCaption(sub.caption);
        setDrawingNote(sub.drawingNote);
        setIsRevealed(true); // Automatically reveal if already submitted!
      }
    } catch (err) {
      console.error('Error fetching today submission', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch friends list and see who completed today
  const loadFriendsActivity = async () => {
    try {
      const friends = await getFriendsList(user.id);
      const completions: Profile[] = [];
      
      for (const f of friends) {
        const subId = `${f.id}_prompt_${prompt.id}`;
        const sub = await getSubmission(subId);
        if (sub) {
          completions.push(f);
        }
      }
      setFriendsWhoCompleted(completions);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadTodaySubmission();
    loadFriendsActivity();

    // Check localStorage if already revealed today
    const revealedKey = `inklink_revealed_${prompt.id}`;
    if (localStorage.getItem(revealedKey)) {
      setIsRevealed(true);
    }
  }, [prompt.id]);

  // Countdown timer until midnight (tomorrow)
  useEffect(() => {
    const updateTimer = () => {
      const now = new Date();
      const tomorrow = new Date();
      tomorrow.setHours(24, 0, 0, 0); // Midnight
      
      const diff = tomorrow.getTime() - now.getTime();
      if (diff <= 0) {
        setTimeRemaining('New day begins now!');
        return;
      }

      const hrs = Math.floor(diff / (1000 * 60 * 60));
      const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const secs = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeRemaining(
        `${hrs.toString().padStart(2, '0')}h ${mins.toString().padStart(2, '0')}m ${secs.toString().padStart(2, '0')}s`
      );
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleReveal = () => {
    setIsRevealed(true);
    localStorage.setItem(`inklink_revealed_${prompt.id}`, 'true');
  };

  const handleCameraCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      setCropperImageSrc(event.target?.result as string);
    };
    reader.readAsDataURL(file);
    // Reset file input value so same file can be chosen again if needed
    e.target.value = '';
  };

  const handleGalleryUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      setCropperImageSrc(event.target?.result as string);
    };
    reader.readAsDataURL(file);
    // Reset file input value
    e.target.value = '';
  };

  const handleCropComplete = async (croppedBase64: string) => {
    setCropperImageSrc('');
    setIsUploadingToStorage(true);
    try {
      // Compress & upload directly to Firebase Storage
      const storageUrl = await uploadDrawingImage(user.id, prompt.id, croppedBase64);
      setUploadFileBase64(storageUrl);
    } catch (err) {
      console.error("Failed uploading to storage, fall back to inline:", err);
      setUploadFileBase64(croppedBase64);
    } finally {
      setIsUploadingToStorage(false);
    }
  };

  // Submit complete drawing
  const handleSubmission = async (imgDataUrl: string) => {
    setIsUploading(true);
    try {
      const finalImg = imgDataUrl || uploadFileBase64;
      if (!finalImg) {
        alert('Please draw something or upload a file first!');
        setIsUploading(false);
        return;
      }

      const sub = await submitDrawing(
        user.id,
        prompt.id,
        prompt.text,
        prompt.season,
        prompt.dayOfSeason,
        finalImg,
        caption,
        drawingNote || (showCanvasMode ? 'Digital Ink Sketchpad' : 'Physical Paper Sketch'),
        device
      );

      setSubmission(sub);
      setShowCanvasMode(false);
      setUploadFileBase64('');
      onRefreshUser(); // Updates user streaks
      alert('Your sketch has been bound into today\'s notebook page!');
    } catch (err: any) {
      console.error(err);
      alert('Failed to bind sketch: ' + err.message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async () => {
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirmed = async () => {
    setShowDeleteConfirm(false);
    setLoading(true);
    try {
      const subId = `${user.id}_prompt_${prompt.id}`;
      await deleteSubmission(subId);
      setSubmission(null);
      setCaption('');
      setDrawingNote('');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-[#64748B] font-serif italic">
        <Feather className="w-8 h-8 text-[#8daa91] animate-spin mb-2" />
        <span>Smoothing down today's parchment...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-full justify-between gap-6 relative select-none">
      
      {/* TODAY HEADER */}
      <div className="flex items-center justify-between border-b border-[#CBD5E1] pb-3">
        <div>
          <div className="flex items-center gap-1.5 text-[#64748B] text-xs font-mono tracking-wider uppercase">
            <Calendar className="w-3.5 h-3.5 text-[#64748B]/70" />
            <span className="hidden sm:inline">
              {today.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </span>
            <span className="inline sm:hidden">
              {today.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </span>
          </div>
          <h3 className="font-serif text-lg font-black text-[#2D3748] leading-tight mt-0.5">
            Today's Parchment
          </h3>
        </div>

        {/* Streak Counter widget */}
        <div className="bg-white px-3 py-1.5 rounded-xl border border-[#CBD5E1] flex items-center gap-1.5 shadow-xs">
          <Flame className="w-5 h-5 text-[#EE98AD] animate-bounce" />
          <div className="leading-none">
            <p className="text-[#2D3748] font-bold text-xs">{user.currentStreak} Days</p>
            <p className="text-[#64748B] text-[9px] font-mono uppercase tracking-tight">Active Streak</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch flex-grow my-2">
        
        {/* LEFT COLUMN: Prompt Panel or Active Canvas */}
        <div className="lg:col-span-7 flex flex-col justify-center h-full">
          <AnimatePresence mode="wait">
            {!isRevealed ? (
              // UNREVEALED PROMPT CARD
              <motion.div
                key="unrevealed"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white border-2 border-dashed border-[#CBD5E1] rounded-3xl p-8 text-center flex flex-col items-center justify-center h-[320px] sm:h-[380px] shadow-xs cursor-pointer relative hover:bg-[#F0F4F8]/30 transition-all"
                onClick={handleReveal}
              >
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-xs border border-[#CBD5E1] mb-4 rotate-[-3deg]">
                  <Feather className="w-8 h-8 text-[#8daa91]" />
                </div>
                <h4 className="font-serif text-lg font-black text-[#2D3748]">Today's Scroll is Sealed</h4>
                <p className="text-xs text-[#64748B] italic max-w-sm mt-1.5">
                  Click to unroll today's drawing challenge. Once broken, the ritual countdown begins.
                </p>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleReveal();
                  }}
                  className="mt-6 px-6 py-2.5 bg-[#8daa91] hover:bg-[#7ba180] text-white font-serif font-bold text-xs rounded-xl shadow-[2px_2px_0_rgba(141,170,145,0.15)] hover:shadow-none translate-y-[-2px] hover:translate-y-0 transition-all cursor-pointer select-none"
                >
                  Unroll Scroll
                </button>
              </motion.div>
            ) : showCanvasMode ? (
              // BUILT-IN CANVAS SKETCHING MODE
              <motion.div
                key="canvas"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="flex flex-col h-full min-h-[350px]"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#64748B]">Drafting Studio</span>
                  <button
                    onClick={() => setShowCanvasMode(false)}
                    className="text-2xs font-serif italic text-[#64748B] hover:text-[#8daa91] underline cursor-pointer"
                  >
                    Cancel direct sketch
                  </button>
                </div>
                
                <SketchCanvas 
                  onSaveSnapshot={(data) => {
                    setUploadFileBase64(data);
                  }}
                />

                {uploadFileBase64 && (
                  <div className="mt-4 p-3 bg-[#8daa91]/10 rounded-xl border border-[#CBD5E1] flex flex-col gap-2">
                    <p className="text-2xs text-[#4e6a53] font-serif italic">Masterpiece captured successfully! Add details below to bind your drawing.</p>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={caption}
                        onChange={(e) => setCaption(e.target.value)}
                        placeholder="Add a caption..."
                        className="flex-grow px-2 py-1.5 text-xs font-serif bg-white border border-[#CBD5E1] rounded focus:outline-none focus:border-[#8daa91]"
                      />
                      <button
                        onClick={() => handleSubmission(uploadFileBase64)}
                        disabled={isUploading}
                        className="px-4 py-1.5 bg-[#8daa91] hover:bg-[#7ba180] text-white font-serif text-xs rounded hover:bg-[#7ba180]/90 font-bold cursor-pointer"
                      >
                        {isUploading ? 'Binding...' : 'Bind Masterpiece'}
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>
            ) : submission ? (
              // SUBMITTED DRAWING PREVIEW
              <motion.div
                key="submitted"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white border border-[#CBD5E1] p-4 rounded-3xl shadow-xs flex flex-col gap-3 relative"
              >
                <div className="aspect-square w-full rounded-2xl overflow-hidden bg-[#F8FAFC] border border-[#CBD5E1] flex items-center justify-center relative">
                  <img src={submission.imageUrl} alt="today-submission" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                  
                  {/* Delete / Replace overlay */}
                  <button
                    onClick={handleDelete}
                    className="absolute bottom-3 right-3 p-2 bg-[#EE98AD] hover:bg-[#dd7d93] text-white rounded-xl shadow-md transition-colors cursor-pointer"
                    title="Delete and re-draw before midnight"
                  >
                    <Trash2 className="w-4.5 h-4.5" />
                  </button>
                </div>

                <div className="px-1">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#64748B]">Your Daily Sketch</span>
                  <p className="font-serif italic text-[#2D3748] mt-1 text-sm">
                    {submission.caption || '“Silent drawing of today”'}
                  </p>
                  <p className="text-[10px] font-mono text-[#64748B] mt-0.5">
                    Instrument: {submission.drawingNote} | Device: {submission.device}
                  </p>
                </div>
              </motion.div>
            ) : (
              // REVEALED PROMPT CARD (AWAITING UPLOAD/SKETCH)
              <motion.div
                key="revealed"
                style={{ originX: 0, transformPerspective: 1000 }}
                initial={{ rotateY: 85, opacity: 0, scale: 0.95 }}
                animate={{ rotateY: 0, opacity: 1, scale: 1 }}
                transition={{ duration: 0.65, type: "spring", stiffness: 90, damping: 15 }}
                className="bg-white border border-[#CBD5E1] rounded-3xl p-6 sm:p-8 flex flex-col justify-between min-h-[320px] sm:min-h-[380px] shadow-xs relative overflow-hidden"
              >
                {/* Vintage sticker style indicator */}
                <div className="absolute top-4 right-4 bg-[#8daa91]/10 text-[#4e6a53] text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded border border-[#CBD5E1]">
                  {prompt.category}
                </div>

                <div className="space-y-4">
                  <div>
                    <span className="text-2xs font-mono uppercase tracking-widest text-[#4e6a53]">Today's Scroll Prompt</span>
                    <h4 className="font-serif text-xl sm:text-2xl font-black text-[#2D3748] mt-1 leading-snug">
                      {prompt.text}
                    </h4>
                    {/* Cozy encouraging message */}
                    <p className="text-2xs text-[#4e6a53] font-serif italic mt-3 bg-[#8daa91]/5 px-3 py-1.5 rounded-xl border border-[#8daa91]/10 inline-block">
                      ✨ {getEncouragementForDay(dayIndex)}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs font-serif text-[#64748B] italic border-t border-[#CBD5E1] pt-3">
                    <div className="flex items-center gap-1.5">
                      <Timer className="w-4 h-4 text-[#8daa91]" />
                      <span>Estimated Time: <strong className="font-sans font-bold text-[#2D3748]">{prompt.difficulty}</strong></span>
                    </div>
                  </div>
                </div>

                {/* Draw or Upload Selector */}
                <div className="space-y-3 mt-6">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <button
                      onClick={() => setShowCanvasMode(true)}
                      className="py-3 px-2.5 rounded-xl bg-[#8daa91] hover:bg-[#7ba180] text-white text-xs font-serif font-bold transition-all shadow-[2px_2px_0_rgba(141,170,145,0.15)] hover:shadow-none translate-y-[-1px] active:translate-y-0 cursor-pointer flex items-center justify-center gap-1.5 select-none"
                    >
                      <Feather className="w-4 h-4" />
                      <span>Sketch On Screen</span>
                    </button>

                    <label className="py-3 px-2.5 rounded-xl border border-[#CBD5E1] text-[#2D3748] hover:bg-[#fbf9f4] text-xs font-serif font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 select-none">
                      <Camera className="w-4 h-4 text-[#8daa91]" />
                      <span>Take Photo</span>
                      <input
                        type="file"
                        accept="image/*"
                        capture="environment"
                        onChange={handleCameraCapture}
                        className="hidden"
                      />
                    </label>

                    <label className="py-3 px-2.5 rounded-xl border border-[#CBD5E1] text-[#2D3748] hover:bg-[#fbf9f4] text-xs font-serif font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 select-none">
                      <Upload className="w-4 h-4 text-[#8daa91]" />
                      <span>Upload from Gallery</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleGalleryUpload}
                        className="hidden"
                      />
                    </label>
                  </div>

                  {/* Loading spinner for storage upload */}
                  {isUploadingToStorage && (
                    <div className="p-4 bg-white rounded-3xl border border-dashed border-[#8daa91] flex items-center justify-center gap-3 text-xs font-serif text-[#64748B] italic animate-pulse mt-3">
                      <div className="w-4 h-4 border-2 border-[#8daa91] border-t-transparent rounded-full animate-spin" />
                      <span>Optimizing, cropping & uploading your masterpiece...</span>
                    </div>
                  )}

                  {/* If physical file uploaded, show review block */}
                  {uploadFileBase64 && (
                    <div className="p-3 bg-white rounded-2xl border border-[#CBD5E1] mt-3 flex flex-col gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-16 h-16 rounded border bg-white overflow-hidden flex-shrink-0">
                          <img src={uploadFileBase64} alt="uploaded" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        </div>
                        <div className="flex-grow">
                          <p className="text-2xs text-[#64748B] font-serif italic">Physical paper sketch uploaded!</p>
                          <input
                            type="text"
                            value={caption}
                            onChange={(e) => setCaption(e.target.value)}
                            placeholder="Add your artist notes or caption..."
                            className="w-full mt-1 px-2.5 py-1 text-2xs font-serif bg-white border border-[#CBD5E1] rounded focus:outline-none focus:border-[#8daa91]"
                          />
                        </div>
                      </div>
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => setUploadFileBase64('')}
                          className="px-2.5 py-1 text-2xs font-mono text-[#64748B] hover:text-[#EE98AD]"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleSubmission('')}
                          disabled={isUploading}
                          className="px-4 py-1 bg-[#8daa91] hover:bg-[#7ba180] text-white text-2xs font-serif font-bold rounded-xl shadow-xs"
                        >
                          {isUploading ? 'Binding...' : 'Bind My Sketch'}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* RIGHT COLUMN: Clock, Circle completes, motivational quote */}
        <div className="lg:col-span-5 flex flex-col justify-between gap-5">
          
          {/* RITUAL COUNTDOWN CLOCK */}
          <div className="bg-white p-5 rounded-3xl border border-[#CBD5E1] shadow-xs text-center">
            <Timer className="w-6 h-6 text-[#8daa91] mx-auto mb-1 animate-spin" style={{ animationDuration: '8s' }} />
            <h5 className="font-serif font-bold text-xs text-[#64748B]">Hourglass of Tomorrow</h5>
            <p className="text-xl sm:text-2xl font-mono font-black text-[#2D3748] tracking-wider mt-1.5">
              {timeRemaining}
            </p>
            <p className="text-[10px] text-[#64748B] italic mt-1 font-serif">
              until midnight, when today's parchment closes forever.
            </p>
          </div>

          {/* FRIENDS COMPLETIONS WIDGET */}
          <div className="bg-white p-5 rounded-3xl border border-[#CBD5E1] shadow-xs flex-grow flex flex-col justify-between min-h-[160px]">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#64748B]">Circle completions</span>
              <h5 className="font-serif text-sm font-bold text-[#2D3748] mt-1">Friends who completed today</h5>
            </div>

            {friendsWhoCompleted.length === 0 ? (
              <div className="my-3 text-center text-[#64748B] text-xs font-serif italic py-2">
                <span>The circle is still quiet... Be the first to sketch!</span>
              </div>
            ) : (
              <div className="flex flex-wrap gap-2.5 my-3">
                {friendsWhoCompleted.map((friend) => (
                  <button
                    key={friend.id}
                    onClick={() => onNavigateToFeed()}
                    className="flex items-center gap-1.5 p-1 px-2.5 rounded-full bg-[#fbf9f4] hover:bg-stone-100 border border-[#CBD5E1] transition-colors cursor-pointer select-none"
                    title={`Click to view ${friend.displayName}'s drawing!`}
                  >
                    <div className="w-6 h-6 rounded-full overflow-hidden bg-[#E1E8F0] flex-shrink-0 flex items-center justify-center font-bold font-serif text-[10px]">
                      {friend.avatarUrl ? (
                        <img src={friend.avatarUrl} alt="av" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      ) : (
                        friend.displayName.charAt(0)
                      )}
                    </div>
                    <span className="text-2xs font-serif font-medium text-[#2D3748]">{friend.displayName}</span>
                  </button>
                ))}
              </div>
            )}

            <button
              onClick={() => onNavigateToFeed()}
              className="w-full py-1.5 bg-white hover:bg-[#fbf9f4] border border-[#CBD5E1] rounded-xl text-[#4e6a53] hover:text-[#8daa91] text-[11px] font-serif font-medium flex items-center justify-center gap-1 cursor-pointer select-none"
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Explore Circle Feed</span>
            </button>
          </div>

          {/* MOTIVATIONAL WATERCOLOR EXCERPT */}
          <div className="p-4 bg-[#8daa91]/5 border border-[#CBD5E1]/50 rounded-3xl flex items-start gap-3">
            <Feather className="w-5 h-5 text-[#8daa91] flex-shrink-0 mt-0.5" />
            <p className="text-xs font-serif italic text-[#2D3748] leading-relaxed">
              {quote}
            </p>
          </div>

        </div>

      </div>

      {/* Interactive Image Cropper & Compressor overlay */}
      {cropperImageSrc && (
        <ImageCropperModal
          imageSrc={cropperImageSrc}
          onCropComplete={handleCropComplete}
          onClose={() => setCropperImageSrc('')}
        />
      )}

      <ConfirmationModal
        isOpen={showDeleteConfirm}
        title="Scrap Current Sketch"
        message="Are you sure you want to tear out and scrap your current sketch page? You can upload or draw a new replacement page before midnight today."
        confirmLabel="Yes, Scrap Sketch"
        type="danger"
        onConfirm={handleDeleteConfirmed}
        onCancel={() => setShowDeleteConfirm(false)}
      />
    </div>
  );
}
