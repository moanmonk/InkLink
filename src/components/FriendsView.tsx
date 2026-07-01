import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Search, UserPlus, UserCheck, UserMinus, Clock, Users, ArrowUpRight, Compass, ShieldAlert, Sparkles } from 'lucide-react';
import { 
  searchUsers, 
  sendFriendRequest, 
  acceptFriendRequest, 
  declineFriendRequest, 
  removeFriend, 
  getFriendships, 
  getFriendsList,
  getAllProfiles
} from '../lib/firebase';
import { Profile, Friendship } from '../types';

interface FriendsViewProps {
  currentUser: Profile;
}

export default function FriendsView({ currentUser }: FriendsViewProps) {
  const [activeSubTab, setActiveSubTab] = useState<'circle' | 'search'>('circle');
  const [friends, setFriends] = useState<Profile[]>([]);
  const [friendships, setFriendships] = useState<Friendship[]>([]);
  const [searchResults, setSearchResults] = useState<Profile[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestedProfiles, setSuggestedProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  const loadFriendsData = async () => {
    try {
      const [friendsList, fships] = await Promise.all([
        getFriendsList(currentUser.id),
        getFriendships(currentUser.id)
      ]);
      setFriends(friendsList);
      setFriendships(fships);

      // Load some general profiles as suggestions if search query is empty
      const allProfiles = await getAllProfiles();
      const filteredSuggestions = allProfiles
        .filter(p => p.id !== currentUser.id && !friendsList.some(f => f.id === p.id))
        .slice(0, 5);
      setSuggestedProfiles(filteredSuggestions);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFriendsData();
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setLoading(true);
    try {
      const results = await searchUsers(searchQuery);
      // Filter out self
      const cleanResults = results.filter(p => p.id !== currentUser.id);
      setSearchResults(cleanResults);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSendRequest = async (targetId: string) => {
    try {
      await sendFriendRequest(currentUser.id, targetId);
      alert('Friend request sent!');
      loadFriendsData();
    } catch (err: any) {
      console.error(err);
      alert('Failed to send request: ' + err.message);
    }
  };

  const handleAcceptRequest = async (fshipId: string) => {
    try {
      await acceptFriendRequest(fshipId);
      alert('Companion accepted!');
      loadFriendsData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeclineRequest = async (fshipId: string) => {
    try {
      await declineFriendRequest(fshipId);
      alert('Request removed.');
      loadFriendsData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleRemoveFriend = async (targetId: string) => {
    if (!window.confirm('Remove this companion artist from your circle?')) return;
    try {
      await removeFriend(currentUser.id, targetId);
      loadFriendsData();
    } catch (err) {
      console.error(err);
    }
  };

  // Helper to resolve friendship status between currentUser and targetProfile
  const getFriendshipStatus = (targetId: string): { status: 'none' | 'pending_sent' | 'pending_received' | 'accepted', friendshipId?: string } => {
    const f = friendships.find(item => 
      (item.senderId === currentUser.id && item.receiverId === targetId) ||
      (item.senderId === targetId && item.receiverId === currentUser.id)
    );

    if (!f) return { status: 'none' };
    if (f.status === 'accepted') return { status: 'accepted', friendshipId: f.id };
    if (f.senderId === currentUser.id) return { status: 'pending_sent', friendshipId: f.id };
    return { status: 'pending_received', friendshipId: f.id };
  };

  // Resolve pending requests received by current user
  const pendingReceivedFriendships = friendships.filter(f => f.status === 'pending' && f.receiverId === currentUser.id);
  const [pendingSenders, setPendingSenders] = useState<({ friendshipId: string; sender: Profile })[]>([]);

  useEffect(() => {
    const loadSenders = async () => {
      const sendersList: any[] = [];
      for (const f of pendingReceivedFriendships) {
        const pDoc = await getAllProfiles();
        const profileObj = pDoc.find(p => p.id === f.senderId);
        if (profileObj) {
          sendersList.push({ friendshipId: f.id, sender: profileObj });
        }
      }
      setPendingSenders(sendersList);
    };
    if (pendingReceivedFriendships.length > 0) {
      loadSenders();
    } else {
      setPendingSenders([]);
    }
  }, [friendships]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-[#64748B] font-serif italic">
        <Users className="w-8 h-8 text-[#8E94F2] animate-spin mb-2" />
        <span>Summoning your companion artists...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-full justify-between gap-4 relative select-none">
      
      {/* HEADER TABS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#CBD5E1] pb-2">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#64748B]">Social Circles</span>
          <h3 className="font-serif text-lg font-black text-[#2D3748] leading-tight">My Companions</h3>
        </div>

        {/* Sub tabs inside page */}
        <div className="flex bg-[#F0F4F8] p-1 rounded-lg border border-[#CBD5E1] self-start sm:self-auto">
          <button
            onClick={() => setActiveSubTab('circle')}
            className={`px-3 py-1.5 rounded text-2xs font-serif font-bold transition-all cursor-pointer ${
              activeSubTab === 'circle' ? 'bg-[#8E94F2] text-white shadow-xs' : 'text-[#64748B] hover:text-[#2D3748]'
            }`}
          >
            My Circle ({friends.length})
          </button>
          <button
            onClick={() => setActiveSubTab('search')}
            className={`px-3 py-1.5 rounded text-2xs font-serif font-bold transition-all cursor-pointer ${
              activeSubTab === 'search' ? 'bg-[#8E94F2] text-white shadow-xs' : 'text-[#64748B] hover:text-[#2D3748]'
            }`}
          >
            Find Artists
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 flex-grow my-2">
        
        {/* SUB TAB 1: MY CIRCLE & PENDING REQUESTS MANAGER */}
        {activeSubTab === 'circle' && (
          <>
            {/* LEFT SIDE: Companion List */}
            <div className="md:col-span-7 space-y-4">
              <h4 className="font-serif text-sm font-black text-[#2D3748]">Companions in Circle</h4>
              
              {friends.length === 0 ? (
                <div className="py-12 border border-dashed border-[#CBD5E1] rounded-xl bg-[#F8FAFC]/60 text-center text-[#64748B] font-serif italic px-6">
                  <span>No companions in your circle yet. Search and invite artists to share sketches and comment!</span>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 max-h-[460px] overflow-y-auto no-scrollbar pr-1">
                  {friends.map((friend) => (
                    <div key={friend.id} className="bg-white border border-[#CBD5E1] p-3.5 rounded-xl shadow-xs flex items-center justify-between gap-3 relative hover:border-[#8E94F2]/60 transition-colors">
                      <div className="flex items-center gap-2.5">
                        <div className="w-10 h-10 rounded-full bg-[#E1E8F0] border border-[#CBD5E1]/40 overflow-hidden flex-shrink-0 flex items-center justify-center font-bold font-serif shadow-xs">
                          {friend.avatarUrl ? (
                            <img src={friend.avatarUrl} alt="av" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                          ) : (
                            friend.displayName.charAt(0)
                          )}
                        </div>
                        <div className="leading-tight overflow-hidden max-w-[120px]">
                          <p className="text-xs font-serif font-bold text-[#2D3748] truncate">{friend.displayName}</p>
                          <p className="text-[10px] text-[#64748B] font-mono mt-0.5 truncate">@{friend.username}</p>
                        </div>
                      </div>

                      <button
                        onClick={() => handleRemoveFriend(friend.id)}
                        className="p-1 text-[#64748B] hover:text-[#F09A9D] hover:bg-[#F09A9D]/10 rounded-lg transition-colors cursor-pointer"
                        title="Remove Companion"
                      >
                        <UserMinus className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* RIGHT SIDE: Pending Requests received */}
            <div className="md:col-span-5 space-y-4">
              <h4 className="font-serif text-sm font-black text-[#2D3748]">Sealed Invitations</h4>
              
              {pendingSenders.length === 0 ? (
                <div className="p-4 border border-dashed border-[#CBD5E1]/80 rounded-xl text-center text-[#64748B] font-serif italic bg-[#F8FAFC]/40 text-2xs">
                  <span>No pending invitations at your front desk.</span>
                </div>
              ) : (
                <div className="space-y-3">
                  {pendingSenders.map(({ friendshipId, sender }) => (
                    <div key={friendshipId} className="bg-[#F8FAFC] border border-[#CBD5E1] p-4 rounded-xl flex items-center justify-between gap-3 shadow-xs">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-full bg-[#E1E8F0] border border-[#CBD5E1]/30 overflow-hidden flex-shrink-0">
                          {sender.avatarUrl ? (
                            <img src={sender.avatarUrl} alt="sender-av" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                          ) : (
                            sender.displayName.charAt(0)
                          )}
                        </div>
                        <div className="leading-tight">
                          <p className="text-xs font-serif font-bold text-[#2D3748]">{sender.displayName}</p>
                          <p className="text-[10px] text-[#64748B] font-serif italic mt-0.5">Would like to share sketches</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        <button
                          onClick={() => handleAcceptRequest(friendshipId)}
                          className="px-2.5 py-1.5 bg-[#8E94F2] hover:bg-[#8E94F2]/90 text-white rounded-lg text-3xs font-serif font-bold shadow-xs transition-colors cursor-pointer"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => handleDeclineRequest(friendshipId)}
                          className="px-2.5 py-1.5 bg-white hover:bg-[#F8FAFC] text-[#2D3748] rounded-lg text-3xs font-serif font-bold border border-[#CBD5E1] transition-colors cursor-pointer"
                        >
                          Decline
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {/* SUB TAB 2: FIND COMPANIONS & SEARCH RESULTS */}
        {activeSubTab === 'search' && (
          <div className="md:col-span-12 space-y-6">
            
            {/* Search Input area */}
            <form onSubmit={handleSearch} className="max-w-md flex gap-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search artists by username or display name..."
                className="flex-grow px-3 py-2 text-xs font-serif bg-white border border-[#CBD5E1] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#8E94F2] focus:border-[#8E94F2] text-[#2D3748]"
                required
              />
              <button
                type="submit"
                className="px-5 py-2 bg-[#8E94F2] hover:bg-[#8E94F2]/90 text-white rounded-lg text-xs font-serif font-bold cursor-pointer shadow-xs"
              >
                Search
              </button>
            </form>

            {/* Results Grid */}
            <div className="space-y-4">
              <h4 className="font-serif text-sm font-black text-[#2D3748]">
                {searchQuery ? 'Search Results' : 'Suggested Companion Artists'}
              </h4>

              {(() => {
                const listToRender = searchQuery ? searchResults : suggestedProfiles;

                if (listToRender.length === 0) {
                  return (
                    <p className="text-2xs font-serif italic text-[#64748B]">No companion artists matching search.</p>
                  );
                }

                return (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {listToRender.map((profile) => {
                      const { status } = getFriendshipStatus(profile.id);

                      return (
                        <div key={profile.id} className="bg-white border border-[#CBD5E1] p-4 rounded-xl shadow-xs flex flex-col items-center text-center justify-between gap-4 hover:border-[#8E94F2]/60 transition-colors">
                          <div className="space-y-2 flex flex-col items-center">
                            <div className="w-14 h-14 rounded-full bg-[#E1E8F0] border border-[#CBD5E1]/50 overflow-hidden shadow-xs flex items-center justify-center font-bold font-serif text-base">
                              {profile.avatarUrl ? (
                                <img src={profile.avatarUrl} alt="profile-av" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                              ) : (
                                profile.displayName.charAt(0)
                              )}
                            </div>
                            <div>
                              <h5 className="font-serif font-bold text-xs text-[#2D3748] leading-none">{profile.displayName}</h5>
                              <p className="text-[10px] text-[#64748B] font-mono mt-1">@{profile.username}</p>
                            </div>
                            {profile.bio && (
                              <p className="text-[10px] text-[#64748B] font-serif italic leading-snug line-clamp-2 max-w-[150px]">
                                "{profile.bio}"
                              </p>
                            )}
                          </div>

                          <div className="w-full border-t border-[#CBD5E1]/50 pt-3">
                            {status === 'none' && (
                              <button
                                onClick={() => handleSendRequest(profile.id)}
                                className="w-full py-1.5 bg-[#8E94F2] hover:bg-[#8E94F2]/90 text-white rounded-lg text-2xs font-serif font-bold flex items-center justify-center gap-1 cursor-pointer select-none shadow-[1.5px_1.5px_0_rgba(142,148,242,0.15)]"
                              >
                                <UserPlus className="w-3.5 h-3.5" />
                                <span>Invite to Circle</span>
                              </button>
                            )}
                            {status === 'pending_sent' && (
                              <div className="text-[#64748B] text-2xs font-serif italic flex items-center justify-center gap-1 py-1">
                                <Clock className="w-3.5 h-3.5 text-[#64748B]/60 animate-pulse" />
                                <span>Invitation sealed</span>
                              </div>
                            )}
                            {status === 'pending_received' && (
                              <div className="text-[#F09A9D] text-2xs font-serif font-bold flex items-center justify-center gap-1 py-1 animate-bounce">
                                <Sparkles className="w-3.5 h-3.5" />
                                <span>Invited You!</span>
                              </div>
                            )}
                            {status === 'accepted' && (
                              <div className="text-[#8E94F2] text-2xs font-serif font-bold flex items-center justify-center gap-1 py-1">
                                <UserCheck className="w-3.5 h-3.5" />
                                <span>Companion Artist</span>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })()}
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
