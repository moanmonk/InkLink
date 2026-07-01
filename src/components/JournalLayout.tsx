import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, Users, Compass, Award, Bell, Settings, ShieldAlert, FileHeart, CalendarRange, LogOut } from 'lucide-react';
import { Profile } from '../types';

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
    { id: 'settings', label: 'Settings', icon: Settings, color: '#859EBA', textClass: 'text-[#4A6482]' },
  ];

  if (user && user.role === 'admin') {
    tabs.push({ id: 'admin', label: 'Studio Admin', icon: ShieldAlert, color: '#EE98AD', textClass: 'text-[#B2455D]' });
  }

  return (
    <div className="h-[100dvh] w-screen bg-[#F0F4F8] text-[#2D3748] p-1.5 sm:p-6 md:p-8 font-sans flex items-center justify-center relative overflow-hidden select-none">
      
      {/* Decorative desktop elements: gentle lilac, soft peach, and sage blobs */}
      <div className="absolute top-8 left-12 w-32 h-32 bg-[#9097F3]/8 rounded-full filter blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute bottom-12 right-12 w-48 h-48 bg-[#EE98AD]/8 rounded-full filter blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute top-1/3 right-1/4 w-36 h-36 bg-[#88B69E]/8 rounded-full filter blur-3xl pointer-events-none" />

      {/* Tiny physical details in background */}
      <div className="absolute top-4 left-4 text-[#64748B] font-mono text-[10px] tracking-widest hidden lg:block opacity-40">
        LATITUDE: 35.6762° N | TIMEZONE: JST
      </div>

      {/* Main Leather/Cardboard Notebook Binder Wrapper in warm organic style */}
      <div className="w-full max-w-5xl h-full md:h-[82vh] bg-[#E1E8F0] rounded-2xl shadow-[0_20px_50px_rgba(51,65,85,0.12),_inset_0_1px_3px_rgba(255,255,255,0.4),_inset_0_-1px_10px_rgba(0,0,0,0.05)] p-1.5 sm:p-3 relative flex flex-col md:flex-row border border-[#CBD5E1]">
        
        {/* Binder texture stitches around border */}
        <div className="absolute inset-2 border border-dashed border-[#64748B]/30 rounded-xl pointer-events-none opacity-50" />

        {/* Sidebar/Navigation Bookmarks */}
        <div className="w-full md:w-56 flex flex-row md:flex-col justify-between items-center md:items-stretch py-2 px-3 md:px-2 md:py-6 bg-[#E1E8F0]/40 rounded-xl md:rounded-r-none relative z-10 md:mr-1 border-b md:border-b-0 md:border-r border-[#CBD5E1]">
          
          {/* Logo Brand area (Moss Green aesthetic) */}
          <div className="hidden md:flex flex-col items-center mb-8 px-2">
            <div className="w-12 h-12 bg-[#88B69E] rounded-full flex items-center justify-center shadow-md border border-[#CBD5E1] relative group rotate-[-4deg] ring-2 ring-[#CBD5E1] ring-offset-2 ring-offset-[#E1E8F0]">
              <span className="font-serif text-[#F0F4F8] font-black text-lg select-none">i</span>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#EE98AD] rounded-full animate-pulse" />
            </div>
            <h1 className="mt-3 text-[#2D3748] font-serif font-bold text-lg tracking-wider">InkLink</h1>
            <p className="text-[#64748B] font-mono text-[9px] tracking-widest uppercase mt-0.5">Social Challenge</p>
          </div>

          {/* User badge preview */}
          {user && (
            <div className="hidden md:flex items-center gap-2.5 px-3 py-2 bg-[#F0F4F8]/80 border border-[#CBD5E1] rounded-lg mb-6 mx-1 shadow-sm">
              <div className="w-9 h-9 rounded-full bg-white border border-[#CBD5E1] overflow-hidden shadow-xs flex-shrink-0 flex items-center justify-center font-serif text-[#2D3748] font-bold">
                {user.avatarUrl ? (
                  <img src={user.avatarUrl} alt="avatar" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                ) : (
                  user.displayName.charAt(0).toUpperCase()
                )}
              </div>
              <div className="overflow-hidden">
                <p className="text-[#2D3748] font-bold text-xs truncate leading-none mb-1">{user.displayName}</p>
                <p className="text-[#EE98AD] text-[10px] font-mono font-bold leading-none">🔥 {user.currentStreak} day streak</p>
              </div>
            </div>
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
                    color: isActive ? tab.color : '#64748B',
                  }}
                  className={`flex items-center md:gap-3 px-2 sm:px-3 py-2 md:py-2.5 rounded-lg text-xs font-serif font-medium transition-all duration-300 relative select-none cursor-pointer flex-shrink-0 ${
                    isActive
                       ? 'bg-[#F0F4F8] shadow-xs border border-[#CBD5E1] translate-y-[-1px] md:translate-x-[4px]'
                       : 'hover:bg-[#F0F4F8]/40'
                  }`}
                  id={`tab-btn-${tab.id}`}
                >
                  <IconComp className="w-4 h-4" style={{ color: isActive ? tab.color : '#64748B' }} />
                  <span className="hidden md:block">{tab.label}</span>
                  
                  {tab.badge !== undefined && tab.badge > 0 && (
                    <span className="absolute -top-1 -right-1 md:top-2 md:right-3 bg-[#EE98AD] text-white text-[9px] font-sans font-bold px-1.5 py-0.5 rounded-full flex items-center justify-center animate-bounce shadow-xs">
                      {tab.badge}
                    </span>
                  )}
                  
                  {/* Visual pointer clip for active tab on desktop */}
                  {isActive && (
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-6 rounded-l-md hidden md:block" style={{ backgroundColor: tab.color }} />
                  )}
                </button>
              );
            })}
            
            {user && (
              <button
                onClick={onLogout}
                className="flex items-center md:hidden gap-3 px-2 sm:px-3 py-2 rounded-lg text-xs font-serif font-medium transition-all duration-300 relative select-none cursor-pointer flex-shrink-0 text-[#64748B] hover:text-[#EE98AD] hover:bg-[#EE98AD]/10"
                title="Sign Out"
                id="tab-btn-logout"
              >
                <LogOut className="w-4 h-4 text-[#64748B]" />
                <span className="hidden md:block">Sign Out</span>
              </button>
            )}
          </nav>

          {/* Logout Button */}
          {user && (
            <button
              onClick={onLogout}
              className="hidden md:block mt-auto text-[#64748B] hover:text-[#EE98AD] text-2xs font-mono tracking-widest uppercase py-1.5 px-3 border border-[#CBD5E1] hover:border-[#EE98AD]/40 rounded transition-all cursor-pointer text-center mx-1 select-none"
            >
              Sign Out
            </button>
          )}
        </div>

        {/* Paper Page of the Sketchbook */}
        <div className="flex-grow bg-white rounded-xl shadow-[inset_0_2px_4px_rgba(255,255,255,0.9),_0_10px_20px_rgba(0,0,0,0.06)] relative overflow-hidden flex flex-col border border-[#CBD5E1]">
          
          {/* Notebook Spiral Binding visual accent (Metal loop rings overlay on left margin of paper page on desktop) */}
          <div className="absolute top-0 bottom-0 left-0 w-4 bg-gradient-to-r from-slate-200/40 via-slate-300/10 to-transparent pointer-events-none border-r border-[#CBD5E1]/30 z-20 hidden md:block" />
          
          {/* Subtle paper texture overlays */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#F09A9D]/2 via-transparent to-transparent pointer-events-none z-10" />
          
          {/* Faint dot-grid paper background */}
          <div className="absolute inset-0 bg-[radial-gradient(#CBD5E1_1px,transparent_1px)] [background-size:16px_16px] opacity-25 pointer-events-none" />

          {/* Page Content area */}
          <main className="flex-grow overflow-y-auto no-scrollbar relative p-3 sm:p-6 md:p-8 z-10">
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
          
          {/* Quick status bar at the bottom page margins */}
          <footer className="min-h-[24px] h-auto py-1 sm:py-0 sm:h-6 px-3 sm:px-4 bg-[#F8FAFC] border-t border-[#E2E8F0] flex flex-col sm:flex-row sm:items-center justify-between text-[9px] sm:text-[10px] text-[#64748B] font-mono flex-shrink-0 gap-1 sm:gap-4">
            <div className="flex items-center gap-1 justify-center sm:justify-start">
              <span className="w-1.5 h-1.5 bg-[#8E94F2] rounded-full inline-block animate-pulse" />
              <span>Realtime Connected</span>
            </div>
            <div className="text-center sm:text-right">
              <span>INKLINK VOL. I — 28 DAY CHALLENGE</span>
            </div>
          </footer>
        </div>


      </div>
    </div>
  );
}
