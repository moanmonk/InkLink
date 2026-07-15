import React, { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db, subscribeAuth, signOutUser, getNotificationsForUser, markNotificationAsRead, clearNotificationsForUser } from './lib/firebase';
import { Profile, InkNotification } from './types';

// Importing views and layout
import JournalLayout from './components/JournalLayout';
import AuthView from './components/AuthView';
import OnboardingView from './components/OnboardingView';
import TodayView from './components/TodayView';
import FeedView from './components/FeedView';
import ChallengesView from './components/ChallengesView';
import FriendsView from './components/FriendsView';
import ProfileView from './components/ProfileView';
import SettingsView from './components/SettingsView';
import AdminView from './components/AdminView';
import ConfirmationModal from './components/ConfirmationModal';

// Icons for notification panel
import { Bell, BellRing, MailOpen, Trash2, Check, Sparkles, AlertCircle, Compass } from 'lucide-react';

export default function App() {
  const [user, setUser] = useState<Profile | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('today');
  const [notifications, setNotifications] = useState<InkNotification[]>([]);
  const [selectedFeedSubId, setSelectedFeedSubId] = useState<string | undefined>(undefined);
  
  // Confirmation dialog states
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showClearNotificationsConfirm, setShowClearNotificationsConfirm] = useState(false);

  // Sync auth state
  useEffect(() => {
    const unsubscribe = subscribeAuth((profile) => {
      setUser(profile);
      setAuthChecked(true);
    });
    return () => unsubscribe();
  }, []);

  // Listen to notifications in real-time if user is logged in
  useEffect(() => {
    if (!user) {
      setNotifications([]);
      return;
    }

    const q = query(collection(db, 'notifications'), where('recipientId', '==', user.id));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list: InkNotification[] = [];
      snapshot.forEach(doc => {
        list.push(doc.data() as InkNotification);
      });
      // Sort newest first
      list.sort((a,b) => b.timestamp.localeCompare(a.timestamp));
      setNotifications(list);
    }, (err) => {
      console.warn('Notification snapshot query fail, falling back to interval', err);
      // Fallback periodic polling
      const poll = async () => {
        const list = await getNotificationsForUser(user.id);
        setNotifications(list);
      };
      poll();
      const interval = setInterval(poll, 15000);
      return () => clearInterval(interval);
    });

    return () => unsubscribe();
  }, [user]);

  const handleLogout = async () => {
    setShowLogoutConfirm(true);
  };

  const handleLogoutConfirmed = async () => {
    setShowLogoutConfirm(false);
    await signOutUser();
    setActiveTab('today');
  };

  const handleRefreshUser = async () => {
    if (user) {
      // Re-trigger sync
      subscribeAuth((profile) => {
        setUser(profile);
      })();
    }
  };

  const handleMarkAsRead = async (notifId: string) => {
    try {
      await markNotificationAsRead(notifId);
      setNotifications(prev => prev.map(n => n.id === notifId ? { ...n, read: true } : n));
    } catch (err) {
      console.error(err);
    }
  };

  const handleClearNotifications = async () => {
    if (!user) return;
    setShowClearNotificationsConfirm(true);
  };

  const handleClearNotificationsConfirmed = async () => {
    if (!user) return;
    setShowClearNotificationsConfirm(false);
    try {
      await clearNotificationsForUser(user.id);
      setNotifications([]);
    } catch (err) {
      console.error(err);
    }
  };

  const handleNavigateToFeedWithSubmission = (submissionId?: string) => {
    setSelectedFeedSubId(submissionId);
    setActiveTab('feed');
  };

  if (!authChecked) {
    return (
      <div className="min-h-screen bg-[#fbf9f4] text-[#4e6a53] flex flex-col items-center justify-center font-serif italic gap-2.5 select-none">
        <div className="w-12 h-12 rounded-full border border-[#8daa91]/40 flex items-center justify-center animate-spin">
          <span className="text-xs font-bold not-italic font-mono text-[#8daa91]">ink</span>
        </div>
        <span>Opening InkLink vault...</span>
      </div>
    );
  }

  // Awaiting Login
  if (!user) {
    return (
      <div className="min-h-screen bg-[#fbf9f4] p-4 flex items-center justify-center select-none">
        <AuthView onAuthSuccess={(profile) => setUser(profile)} />
      </div>
    );
  }

  // Awaiting Onboarding (if no avatar selected yet)
  const needsOnboarding = !user.avatarUrl;
  if (needsOnboarding) {
    return (
      <div className="min-h-screen bg-[#fbf9f4] p-4 flex items-center justify-center select-none">
        <OnboardingView 
          user={user} 
          onOnboardingComplete={(updatedProfile) => setUser(updatedProfile)} 
        />
      </div>
    );
  }

  const unreadNotifications = notifications.filter(n => !n.read);

  return (
    <JournalLayout
      activeTab={activeTab}
      setActiveTab={(tab) => {
        // Reset sub link when navigating
        if (tab !== 'feed') {
          setSelectedFeedSubId(undefined);
        }
        setActiveTab(tab);
      }}
      user={user}
      notificationsCount={unreadNotifications.length}
      onLogout={handleLogout}
    >
      {/* TODAY'S PAGE TAB */}
      {activeTab === 'today' && (
        <TodayView 
          user={user} 
          onNavigateToFeed={handleNavigateToFeedWithSubmission}
          onRefreshUser={handleRefreshUser}
        />
      )}

      {/* FRIENDS FEED / GALLERY TAB */}
      {activeTab === 'feed' && (
        <FeedView 
          currentUser={user} 
          initialSelectedSubmissionId={selectedFeedSubId}
          onClearSelectedSubmissionId={() => setSelectedFeedSubId(undefined)}
        />
      )}

      {/* PRIVATE DUELS TAB */}
      {activeTab === 'challenges' && (
        <ChallengesView user={user} />
      )}

      {/* FRIENDS CIRCLE CONNECTOR TAB */}
      {activeTab === 'friends' && (
        <FriendsView currentUser={user} />
      )}

      {/* PERSONAL SKETCHBOOK TAB */}
      {activeTab === 'profile' && (
        <ProfileView 
          user={user} 
          onRefreshUser={handleRefreshUser}
          onSelectSubmissionInFeed={handleNavigateToFeedWithSubmission}
        />
      )}

      {/* LETTERBOX / NOTIFICATIONS TAB */}
      {activeTab === 'notifications' && (
        <div className="flex flex-col h-full justify-between gap-4 relative select-none">
          
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#C7BFB5] pb-3">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#8C8379] font-bold flex items-center gap-1">
                <BellRing className="w-3.5 h-3.5 text-[#5A5A40]" />
                <span>Circle Letterbox</span>
              </span>
              <h3 className="font-serif text-lg font-black text-[#3E3C3A] leading-tight mt-0.5">
                My Notifications
              </h3>
            </div>

            {notifications.length > 0 && (
              <button
                onClick={handleClearNotifications}
                className="px-3 py-1.5 border border-[#C7BFB5] hover:border-[#E67E22] text-[#3E3C3A] hover:text-[#E67E22] rounded-lg text-2xs font-serif font-bold transition-all cursor-pointer flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Burn Letters</span>
              </button>
            )}
          </div>

          {/* Notifications scroll list */}
          <div className="flex-grow my-2">
            {notifications.length === 0 ? (
              <div className="py-16 border border-dashed border-[#C7BFB5] rounded-2xl bg-[#F9F7F2]/60 text-center text-[#8C8379] font-serif italic p-6">
                <MailOpen className="w-8 h-8 text-[#C7BFB5] mx-auto mb-2" />
                <span>Your mailbox is empty. Complete prompts and comment on friends' work to trigger letters!</span>
              </div>
            ) : (
              <div className="space-y-3 max-h-[460px] overflow-y-auto no-scrollbar pr-1">
                {notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className={`p-4 rounded-xl border flex items-start justify-between gap-4 transition-all ${
                      notif.read 
                        ? 'bg-[#F9F7F2]/40 border-[#C7BFB5]/60 opacity-70' 
                        : 'bg-white border-[#C7BFB5] shadow-xs relative ring-1 ring-[#5A5A40]/10'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      
                      {/* Sender Avatar */}
                      <div className="w-9 h-9 rounded-full overflow-hidden bg-[#DED8D1] border border-[#C7BFB5]/50 flex-shrink-0 flex items-center justify-center font-bold text-xs">
                        {notif.senderAvatar ? (
                          <img src={notif.senderAvatar} alt="notif-sender" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        ) : (
                          notif.senderName.charAt(0)
                        )}
                      </div>

                      {/* Message details */}
                      <div className="leading-tight">
                        <p className="text-xs font-serif text-[#3E3C3A]">
                          {notif.message}
                        </p>
                        <p className="text-[9px] font-mono text-[#8C8379] mt-1 uppercase">
                          {new Date(notif.timestamp).toLocaleDateString(undefined, { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>

                    </div>

                    {/* Actions panel */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      
                      {/* Deep link button if attached to drawing submission */}
                      {notif.submissionId && (
                        <button
                          onClick={() => {
                            handleMarkAsRead(notif.id);
                            handleNavigateToFeedWithSubmission(notif.submissionId!);
                          }}
                          className="px-2.5 py-1.5 bg-[#5A5A40] hover:bg-[#5A5A40]/90 text-white rounded-lg text-3xs font-serif font-bold cursor-pointer shadow-[1.5px_1.5px_0_rgba(140,131,121,0.25)]"
                        >
                          View sketch
                        </button>
                      )}

                      {/* Deep link button if attached to challenge invite */}
                      {notif.challengeId && (
                        <button
                          onClick={() => {
                            handleMarkAsRead(notif.id);
                            setActiveTab('challenges');
                          }}
                          className="px-2.5 py-1.5 bg-[#5A5A40] hover:bg-[#5A5A40]/90 text-white rounded-lg text-3xs font-serif font-bold cursor-pointer shadow-[1.5px_1.5px_0_rgba(140,131,121,0.25)]"
                        >
                          View duel
                        </button>
                      )}

                      {/* Mark read button */}
                      {!notif.read && (
                        <button
                          onClick={() => handleMarkAsRead(notif.id)}
                          className="p-1 hover:bg-[#F5F2ED]/80 text-[#8C8379] hover:text-[#5A5A40] rounded-lg cursor-pointer"
                          title="Mark read"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                      )}

                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* STUDIO SETTINGS TAB */}
      {activeTab === 'settings' && (
        <SettingsView 
          user={user} 
          onRefreshUser={handleRefreshUser}
          onLogout={handleLogout}
        />
      )}

      {/* STUDIO ADMIN TAB */}
      {activeTab === 'admin' && (
        <AdminView />
      )}

      {/* Confirmation Modals */}
      <ConfirmationModal
        isOpen={showLogoutConfirm}
        title="Close Sketchbook & Sign Out"
        message="Are you sure you want to close your physical sketchbook and sign out of your InkLink studio session?"
        confirmLabel="Yes, Sign Out"
        type="info"
        onConfirm={handleLogoutConfirmed}
        onCancel={() => setShowLogoutConfirm(false)}
      />

      <ConfirmationModal
        isOpen={showClearNotificationsConfirm}
        title="Burn Letterbox Inbox"
        message="Are you sure you want to burn all of the read and unread messages inside your letterbox inbox? This action cannot be undone."
        confirmLabel="Burn Inbox"
        type="danger"
        onConfirm={handleClearNotificationsConfirmed}
        onCancel={() => setShowClearNotificationsConfirm(false)}
      />

    </JournalLayout>
  );
}
