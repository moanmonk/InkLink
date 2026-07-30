import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, Users, Compass, Award, Bell, Settings, ShieldAlert, FileHeart, CalendarRange, LogOut, Feather, PenTool } from 'lucide-react';
import { Profile } from '../types';
import artsyLogoImg from '../assets/images/inklink_artsy_icon_1785448409739.jpg';

export function AppLogo({ size = 40, className = "" }: { size?: number; className?: string }) {
  const [hasError, setHasError] = React.useState(false);

  return (
    <div 
      className={`relative flex-shrink-0 select-none rounded-2xl overflow-hidden shadow-md border border-white/40 bg-[#8daa91] flex items-center justify-center ${className}`} 
      style={{ width: size, height: size }}
    >
      {!hasError ? (
        <img
          src={artsyLogoImg}
          alt="InkLink Logo"
          className="w-full h-full object-cover rounded-2xl"
          referrerPolicy="no-referrer"
          onError={() => setHasError(true)}
        />
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-[#8daa91] via-[#78967c] to-[#5d7a61] flex items-center justify-center text-white p-2">
          <PenTool className="w-2/3 h-2/3 text-amber-100 drop-shadow-sm" />
        </div>
      )}
    </div>
  );
}

// Backwards compatibility alias
export const CuteCatLogo = AppLogo;

interface JournalLayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  user: Profile | null;
  notificationsCount: number;
  onLogout: () => void;
}

export default function JournalLayout({
  children,
  activeTab,
  setActiveTab,
  user,
  notificationsCount,
  onLogout
}: JournalLayoutProps) {
  
  const tabs = [
    { id: 'today', label: 'Today\'s Page', icon: BookOpen, color: '#88B69E', textClass: 'text-[#417057]' },
    { id: 'feed', label: 'Friends Feed', icon: Compass, color: '#859EBA', textClass: 'text-[#4A6482]' },
    { id: 'challenges', label: 'Challenges', icon: Award, color: '#9097F3', textClass: 'text-[#616AE0]' },
    { id: 'friends', label: 'My Circle', icon: Users, color: '#E3C57A', textClass: 'text-[#8F7124]' },
    { id: 'profile', label: 'Sketchbook', icon: FileHeart, color: '#EE98AD', textClass: 'text-[#B2455D]' },
    { id: 'notifications', label: 'Letterbox', icon: Bell, badge: notificationsCount, color: '#EFA694', textClass: 'text-[#B85741]' },
  ];

  if (user && user.role === 'admin') {
    tabs.push({ id: 'admin', label: 'Studio Admin', icon: ShieldAlert, color: '#EE98AD', textClass: 'text-[#B2455D]' });
  }

  return (
    <div className="h-[100dvh] w-screen bg-[#fbf9f4] text-[#2D3748] md:pt-[calc(6px+env(safe-area-inset-top))] md:pb-[calc(6px+env(safe-area-inset-bottom))] md:px-1.5 lg:p-8 font-sans flex items-center justify-center relative overflow-hidden select-none">
      
      {/* Decorative desktop elements: gentle lilac, soft peach, and sage blobs */}
      <div className="absolute top-8 left-12 w-32 h-32 bg-[#9097F3]/5 rounded-full filter blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute bottom-12 right-12 w-48 h-48 bg-[#EE98AD]/5 rounded-full filter blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute top-1/3 right-1/4 w-36 h-36 bg-[#8daa91]/8 rounded-full filter blur-3xl pointer-events-none" />

      {/* Tiny physical details in background */}
      <div className="absolute top-4 left-4 text-[#64748B] font-mono text-[10px] tracking-widest hidden lg:block opacity-40">
        LATITUDE: 35.6762° N | TIMEZONE: JST
      </div>

      {/* Main Leather/Cardboard Notebook Binder Wrapper in warm organic style */}
      <div className="w-full max-w-5xl h-full md:h-[82vh] bg-[#8daa91] rounded-none md:rounded-3xl shadow-none md:shadow-[0_20px_50px_rgba(141,170,145,0.15),_inset_0_1px_3px_rgba(255,255,255,0.4),_inset_0_-1px_10px_rgba(0,0,0,0.05)] p-0 md:p-3 relative flex flex-col-reverse md:flex-row border-0 md:border md:border-[#8daa91]/40">
        
        {/* Binder texture stitches around border */}
        <div className="hidden md:block absolute inset-2 border border-dashed border-white/20 rounded-2xl pointer-events-none opacity-50" />

        {/* Sidebar/Navigation Bookmarks */}
        <div className="w-full md:w-56 flex flex-row md:flex-col justify-between items-center md:items-stretch py-1.5 pb-[calc(8px+env(safe-area-inset-bottom))] pt-1.5 px-2.5 md:px-2 md:py-6 bg-[#8daa91] md:bg-white/15 rounded-none md:rounded-2xl md:rounded-r-none relative z-10 md:mr-1 border-t md:border-t-0 md:border-r border-white/10 shadow-[0_-4px_12px_rgba(0,0,0,0.08)] md:shadow-none">
          
          {/* Logo Brand area (Moss Green aesthetic) */}
          <div className="hidden md:flex flex-col items-center mb-6 px-2">
            <AppLogo size={60} />
            <h1 className="mt-2 text-white font-serif font-black text-xl tracking-wider">InkLink</h1>
          </div>

          {/* User badge preview */}
          {user && (
            <button
              onClick={() => setActiveTab('profile')}
              className="hidden md:flex items-center gap-2.5 px-3 py-2 bg-white/20 border border-white/10 rounded-xl mb-6 mx-1 shadow-sm cursor-pointer hover:bg-white/30 transition-all text-left w-[calc(100%-8px)]"
              title="View your personal Sketchbook"
            >
              <div className="w-9 h-9 rounded-full bg-white border border-[#CBD5E1] overflow-hidden shadow-xs flex-shrink-0 flex items-center justify-center font-serif text-[#2D3748] font-bold">
                {user.avatarUrl ? (
                  <img src={user.avatarUrl} alt="avatar" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                ) : (
                  user.displayName.charAt(0).toUpperCase()
                )}
              </div>
              <div className="overflow-hidden">
                <p className="text-white font-bold text-xs truncate leading-none mb-1">{user.displayName}</p>
                <p className="text-white/90 text-[10px] font-mono font-bold leading-none">🔥 {user.currentStreak} day streak</p>
              </div>
            </button>
          )}

          {/* Nav Links */}
          <nav className="flex flex-row md:flex-col flex-grow justify-around md:justify-start gap-1 overflow-x-auto md:overflow-x-visible md:overflow-y-auto no-scrollbar w-full md:px-1">
            {tabs.map((tab) => {
              const IconComp = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    color: isActive ? '#4e6a53' : 'rgba(255, 255, 255, 0.8)',
                  }}
                  className={`flex flex-col md:flex-row items-center justify-center md:justify-start gap-0.5 md:gap-3 px-1 sm:px-3 py-1 sm:py-1.5 md:py-2.5 rounded-xl text-center md:text-left transition-all duration-300 relative select-none cursor-pointer flex-grow md:flex-initial flex-shrink-0 ${
                    isActive
                       ? 'bg-[#fbf9f4] shadow-xs border border-white/10 translate-y-[-1px] md:translate-x-[4px]'
                       : 'hover:bg-white/5'
                  }`}
                  id={`tab-btn-${tab.id}`}
                >
                  <IconComp className="w-4 h-4" style={{ color: isActive ? '#8daa91' : 'rgba(255, 255, 255, 0.8)' }} />
                  <span className="text-[9px] sm:text-[10px] md:text-xs font-sans md:font-serif leading-none tracking-tight block mt-0.5 md:mt-0 font-bold md:font-medium">
                    {tab.id === 'challenges' ? 'Duels' : tab.id === 'notifications' ? 'Letters' : tab.id === 'friends' ? 'Circle' : tab.id === 'profile' ? 'Sketch' : tab.label.split(' ')[0]}
                  </span>
                  
                  {tab.badge !== undefined && tab.badge > 0 && (
                    <span className="absolute top-0.5 right-1 sm:right-2 md:top-2 md:right-3 bg-[#EE98AD] text-white text-[8px] md:text-[9px] font-sans font-bold px-1 md:px-1.5 py-0.5 rounded-full flex items-center justify-center animate-bounce shadow-xs">
                      {tab.badge}
                    </span>
                  )}
                  
                  {/* Visual pointer clip for active tab on desktop */}
                  {isActive && (
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-6 rounded-l-md hidden md:block" style={{ backgroundColor: '#8daa91' }} />
                  )}
                </button>
              );
            })}
            
          </nav>
        </div>

        {/* Paper Page of the Sketchbook */}
        <div className="flex-grow bg-white rounded-none md:rounded-3xl shadow-none md:shadow-[inset_0_2px_4px_rgba(255,255,255,0.9),_0_10px_20px_rgba(0,0,0,0.06)] relative overflow-hidden flex flex-col border-0 md:border md:border-[#CBD5E1]">
          
          {/* Notebook Spiral Binding visual accent (Metal loop rings overlay on left margin of paper page on desktop) */}
          <div className="absolute top-0 bottom-0 left-0 w-4 bg-gradient-to-r from-slate-200/40 via-slate-300/10 to-transparent pointer-events-none border-r border-[#CBD5E1]/30 z-20 hidden md:block" />
          
          {/* Subtle paper texture overlays */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#8daa91]/2 via-transparent to-transparent pointer-events-none z-10" />
          
          {/* Faint dot-grid paper background */}
          <div className="absolute inset-0 bg-[radial-gradient(#CBD5E1_1px,transparent_1px)] [background-size:16px_16px] opacity-20 pointer-events-none" />

          {/* Desktop Settings button in the top right corner of the paper page */}
          {user && (
            <div className="absolute top-4 right-4 z-30 hidden md:block">
              <button
                onClick={() => setActiveTab('settings')}
                className={`p-1.5 rounded-xl border transition-all flex items-center justify-center cursor-pointer shadow-2xs hover:scale-105 active:scale-95 ${
                  activeTab === 'settings'
                    ? 'bg-[#8daa91] text-white border-transparent shadow-inner'
                    : 'bg-[#fbf9f4] hover:bg-stone-200 text-[#8daa91] border-[#CBD5E1]/60'
                }`}
                title="Settings"
              >
                <Settings className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Mobile top logo header */}
          <div className="md:hidden flex items-center justify-between border-b border-stone-100/60 pb-3 pt-[calc(12px+env(safe-area-inset-top))] px-5 bg-white relative z-20">
            <div className="flex items-center gap-2.5">
              <AppLogo size={38} />
              <span className="font-serif font-black text-[#8daa91] text-base tracking-wide leading-none">InkLink</span>
            </div>
            {user && (
              <button
                onClick={() => setActiveTab('settings')}
                className="p-1.5 rounded-xl bg-stone-50 hover:bg-stone-100 border border-[#CBD5E1]/60 transition-all flex items-center justify-center cursor-pointer shadow-2xs hover:scale-105 active:scale-95 text-[#8daa91]"
                title="Settings"
              >
                <Settings className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Page Content area */}
          <main className="flex-grow overflow-y-auto no-scrollbar relative p-4 pt-6 sm:p-6 md:p-8 z-10">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2, ease: 'easeInOut' }}
                className="h-full flex flex-col"
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>


      </div>
    </div>
  );
}
