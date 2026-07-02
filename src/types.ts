export interface Profile {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string;
  bio: string;
  joinedDate: string;
  currentStreak: number;
  longestStreak: number;
  favoriteCategory: string;
  role: 'user' | 'admin';
}

export interface Prompt {
  id: string;
  title: string;
  text: string; // Keep text as alias to prevent breaking other components
  category: string;
}

export interface Submission {
  id: string;
  userId: string;
  username: string;
  userDisplayName: string;
  userAvatarUrl: string;
  promptId: string;
  promptText: string;
  season: number;
  dayOfSeason: number;
  imageUrl: string; // base64 encoded optimized string
  caption: string;
  drawingNote: string;
  device: string;
  uploadTime: string;
  ratingsCount: number;
  ratingsSum: number;
  reactions: { [type: string]: string[] }; // reactionType -> array of userIds
}

export interface Rating {
  id: string;
  userId: string;
  username: string;
  userDisplayName: string;
  submissionId: string;
  rating: number; // 1 to 5 stars
  timestamp: string;
}

export interface Comment {
  id: string;
  submissionId: string;
  userId: string;
  username: string;
  userDisplayName: string;
  userAvatar: string;
  text: string;
  parentId: string | null; // for threaded comments
  timestamp: string;
}

export interface Friendship {
  id: string; // sortedUser1_sortedUser2
  senderId: string;
  receiverId: string;
  status: 'pending' | 'accepted';
  timestamp: string;
}

export interface PrivateChallenge {
  id: string;
  creatorId: string;
  creatorName: string;
  promptText: string;
  deadline: string;
  invitedFriends: string[]; // list of userIds
  timestamp: string;
}

export interface ChallengeSubmission {
  id: string;
  challengeId: string;
  userId: string;
  username: string;
  userDisplayName: string;
  userAvatarUrl: string;
  imageUrl: string;
  caption: string;
  timestamp: string;
}

export interface InkNotification {
  id: string;
  recipientId: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  type: 'upload' | 'comment' | 'react' | 'rate' | 'challenge_invite';
  submissionId: string | null;
  challengeId: string | null;
  message: string;
  read: boolean;
  timestamp: string;
}
