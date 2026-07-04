import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, Users, Compass, Award, Bell, Settings, ShieldAlert, FileHeart, CalendarRange, LogOut } from 'lucide-react';
import { Profile } from '../types';

export function CuteCatLogo({ size = 40 }: { size?: number }) {
  return (
    <div className="relative flex-shrink-0 select-none pointer-events-none" style={{ width: size, height: size }}>
      <svg viewBox="0 0 100 100" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        {/* Paintbrush behind/next to the cat */}
        <g transform="rotate(25 75 40) translate(15, -10)">
          {/* Handle */}
          <rect x="47" y="20" width="6" height="40" rx="3" fill="#D7A15C" stroke="#4e6a53" strokeWidth="2.5" />
          {/* Ferrule */}
          <rect x="46" y="14" width="8" height="6" fill="#A0AEC0" stroke="#4e6a53" strokeWidth="2.5" />
          {/* Tip with pink paint */}
          <path d="M 46,14 C 46,14 47,2 50,2 C 53,2 54,14 54,14 Z" fill="#EE98AD" stroke="#4e6a53" strokeWidth="2.5" strokeLinejoin="round" />
        </g>

        {/* Left Ear */}
        <path d="M 30,35 L 14,8 L 44,22 Z" fill="#ffffff" stroke="#4e6a53" strokeWidth="4" strokeLinejoin="round" />
        <path d="M 28,29 L 18,13 L 37,20 Z" fill="#EE98AD" />

        {/* Right Ear */}
        <path d="M 70,35 L 86,8 L 56,22 Z" fill="#ffffff" stroke="#4e6a53" strokeWidth="4" strokeLinejoin="round" />
        <path d="M 72,29 L 82,13 L 63,20 Z" fill="#EE98AD" />

        {/* Head/Face */}
        <path d="M 20,48 C 20,30 32,24 50,24 C 68,24 80,30 80,48 C 80,66 72,82 50,82 C 28,82 20,66 20,48 Z" fill="#ffffff" stroke="#4e6a53" strokeWidth="4" strokeLinejoin="round" />

        {/* Eyes */}
        <circle cx="38" cy="46" r="5" fill="#2D3748" />
        <circle cx="62" cy="46" r="5" fill="#2D3748" />
        {/* Eye highlights */}
        <circle cx="36" cy="44" r="1.5" fill="#ffffff" />
        <circle cx="60" cy="44" r="1.5" fill="#ffffff" />

        {/* Blushing cheeks */}
        <circle cx="29" cy="54" r="4.5" fill="#EE98AD" opacity="0.65" />
        <circle cx="71" cy="54" r="4.5" fill="#EE98AD" opacity="0.65" />

        {/* Cute mouth (W shape) */}
        <path d="M 44,52 Q 47,55 50,52 Q 53,55 56,52" fill="none" stroke="#2D3748" strokeWidth="3" strokeLinecap="round" />

        {/* Cute whiskers */}
        <path d="M 16,50 L 5,49 M 16,56 L 7,57" stroke="#4e6a53" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M 84,50 L 95,49 M 84,56 L 93,57" stroke="#4e6a53" strokeWidth="2.5" strokeLinecap="round" />

        {/* Little paw on the side holding the paintbrush */}
        <circle cx="76" cy="62" r="5" fill="#ffffff" stroke="#4e6a53" strokeWidth="2.5" />
      </svg>
    </div>
  );
}

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
    <div className="h-[100dvh] w-screen bg-[#fbf9f4] text-[#2D3748] pt-[calc(6px+env(safe-area-inset-top))] pb-[calc(6px+env(safe-area-inset-bottom))] px-1.5 sm:p-6 md:p-8 font-sans flex items-center justify-center relative overflow-hidden select-none">
      
      {/* Decorative desktop elements: gentle lilac, soft peach, and sage blobs */}
      <div className="absolute top-8 left-12 w-32 h-32 bg-[#9097F3]/5 rounded-full filter blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute bottom-12 right-12 w-48 h-48 bg-[#EE98AD]/5 rounded-full filter blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute top-1/3 right-1/4 w-36 h-36 bg-[#8daa91]/8 rounded-full filter blur-3xl pointer-events-none" />

      {/* Tiny physical details in background */}
      <div className="absolute top-4 left-4 text-[#64748B] font-mono text-[10px] tracking-widest hidden lg:block opacity-40">
        LATITUDE: 35.6762° N | TIMEZONE: JST
      </div>

      {/* Main Leather/Cardboard Notebook Binder Wrapper in warm organic style */}
      <div className="w-full max-w-5xl h-full md:h-[82vh] bg-[#8daa91] rounded-3xl shadow-[0_20px_50px_rgba(141,170,145,0.15),_inset_0_1px_3px_rgba(255,255,255,0.4),_inset_0_-1px_10px_rgba(0,0,0,0.05)] p-1.5 sm:p-3 relative flex flex-col-reverse md:flex-row border border-[#8daa91]/40">
        
        {/* Binder texture stitches around border */}
        <div className="absolute inset-2 border border-dashed border-white/20 rounded-2xl pointer-events-none opacity-50" />

        {/* Sidebar/Navigation Bookmarks */}
        <div className="w-full md:w-56 flex flex-row md:flex-col justify-between items-center md:items-stretch py-2 px-3 md:px-2 md:py-6 bg-white/15 rounded-2xl md:rounded-r-none relative z-10 md:mr-1 border-t md:border-t-0 md:border-r border-white/10">
          
          {/* Logo Brand area (Moss Green aesthetic) with cute cat with brush */}
          <div className="hidden md:flex flex-col items-center mb-6 px-2">
            <CuteCatLogo size={60} />
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
                  className={`flex items-center md:gap-3 px-2 sm:px-3 py-2 md:py-2.5 rounded-xl text-xs font-serif font-medium transition-all duration-300 relative select-none cursor-pointer flex-shrink-0 ${
                    isActive
                       ? 'bg-[#fbf9f4] shadow-sm border border-white/20 translate-y-[-1px] md:translate-x-[4px]'
                       : 'hover:bg-white/10'
                  }`}
                  id={`tab-btn-${tab.id}`}
                >
                  <IconComp className="w-4 h-4" style={{ color: isActive ? '#8daa91' : 'rgba(255, 255, 255, 0.8)' }} />
                  <span className="hidden md:block">{tab.label}</span>
                  
                  {tab.badge !== undefined && tab.badge > 0 && (
                    <span className="absolute -top-1 -right-1 md:top-2 md:right-3 bg-[#EE98AD] text-white text-[9px] font-sans font-bold px-1.5 py-0.5 rounded-full flex items-center justify-center animate-bounce shadow-xs">
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
            
            {user && (
              <button
                onClick={onLogout}
                className="flex items-center md:hidden gap-3 px-2 sm:px-3 py-2 rounded-xl text-xs font-serif font-medium transition-all duration-300 relative select-none cursor-pointer flex-shrink-0 text-white/80 hover:text-white hover:bg-white/10"
                title="Sign Out"
                id="tab-btn-logout"
              >
                <LogOut className="w-4 h-4 text-white/80" />
                <span className="hidden md:block">Sign Out</span>
              </button>
            )}
          </nav>

          {/* Logout Button */}
          {user && (
            <button
              onClick={onLogout}
              className="hidden md:block mt-auto text-white/80 hover:text-white text-2xs font-mono tracking-widest uppercase py-1.5 px-3 border border-white/20 hover:border-white/50 rounded-xl transition-all cursor-pointer text-center mx-1 select-none"
            >
              Sign Out
            </button>
          )}
        </div>

        {/* Paper Page of the Sketchbook */}
        <div className="flex-grow bg-white rounded-3xl shadow-[inset_0_2px_4px_rgba(255,255,255,0.9),_0_10px_20px_rgba(0,0,0,0.06)] relative overflow-hidden flex flex-col border border-[#CBD5E1]">
          
          {/* Notebook Spiral Binding visual accent (Metal loop rings overlay on left margin of paper page on desktop) */}
          <div className="absolute top-0 bottom-0 left-0 w-4 bg-gradient-to-r from-slate-200/40 via-slate-300/10 to-transparent pointer-events-none border-r border-[#CBD5E1]/30 z-20 hidden md:block" />
          
          {/* Subtle paper texture overlays */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#8daa91]/2 via-transparent to-transparent pointer-events-none z-10" />
          
          {/* Faint dot-grid paper background */}
          <div className="absolute inset-0 bg-[radial-gradient(#CBD5E1_1px,transparent_1px)] [background-size:16px_16px] opacity-20 pointer-events-none" />

          {/* Mobile top logo header with cute cat with brush and no social challenge line */}
          <div className="md:hidden flex items-center justify-between border-b border-stone-100/60 pb-3 pt-4 px-5 bg-white relative z-20">
            <div className="flex items-center gap-2.5">
              <CuteCatLogo size={36} />
              <span className="font-serif font-black text-[#8daa91] text-base tracking-wide leading-none">InkLink</span>
            </div>
            {user && (
              <div className="flex items-center gap-1.5 px-2.5 py-1 bg-[#8daa91]/10 rounded-full border border-[#8daa91]/10">
                <span className="text-[10px] font-mono font-black text-[#8daa91]">🔥 {user.currentStreak}d streak</span>
              </div>
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
