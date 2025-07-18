// src/mocks/users.mocks.ts
import type { User, UserStats, UserMessage, UserReview, ChatConversation } from '@/types/user.types';

// Helper function to generate avatar
const generateAvatar = (name: string): string => {
  return `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`;
};

// Helper function to generate random dates
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const randomDate = (start: Date, end: Date): string => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())).toISOString();
};

// Mock Users
export const mockUsers: User[] = [
  {
    id: "user_1",
    firstName: "Sophie",
    lastName: "Martin",
    email: "sophie.martin@example.com",
    phone: "+33123456789",
    avatar: generateAvatar("Sophie Martin"),
    status: "verified",
    isActive: true,
    lastLoginAt: "2024-07-18T08:30:00Z",
    loginCount: 45,
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-07-18T08:30:00Z",
    lastActivity: "2024-07-18T10:15:00Z",
    isOnline: true,
  },
  {
    id: "user_2",
    firstName: "Thomas",
    lastName: "Dubois",
    email: "thomas.dubois@example.com",
    phone: "+33987654321",
    avatar: generateAvatar("Thomas Dubois"),
    status: "verified",
    isActive: true,
    lastLoginAt: "2024-07-17T14:20:00Z",
    loginCount: 23,
    createdAt: "2024-02-20T09:30:00Z",
    updatedAt: "2024-07-17T14:20:00Z",
    lastActivity: "2024-07-17T16:45:00Z",
    isOnline: false,
  },
  {
    id: "user_3",
    firstName: "Marie",
    lastName: "Leclerc",
    email: "marie.leclerc@example.com",
    // No phone number
    avatar: generateAvatar("Marie Leclerc"),
    status: "pending",
    isActive: true,
    loginCount: 0,
    createdAt: "2024-07-17T16:00:00Z",
    updatedAt: "2024-07-17T16:00:00Z",
    isOnline: false,
  },
  {
    id: "user_4",
    firstName: "Pierre",
    lastName: "Bernard",
    email: "pierre.bernard@example.com",
    phone: "+33555666777",
    avatar: generateAvatar("Pierre Bernard"),
    status: "verified",
    isActive: false, // Deactivated user
    lastLoginAt: "2024-07-10T12:00:00Z",
    loginCount: 67,
    createdAt: "2023-11-05T08:15:00Z",
    updatedAt: "2024-07-15T09:00:00Z",
    lastActivity: "2024-07-10T13:30:00Z",
    isOnline: false,
  },
  {
    id: "user_5",
    firstName: "Julie",
    lastName: "Moreau",
    email: "julie.moreau@example.com",
    phone: "+33444555666",
    avatar: generateAvatar("Julie Moreau"),
    status: "suspended",
    isActive: false,
    lastLoginAt: "2024-07-05T11:45:00Z",
    loginCount: 12,
    createdAt: "2024-06-01T14:30:00Z",
    updatedAt: "2024-07-12T10:00:00Z",
    lastActivity: "2024-07-05T12:30:00Z",
    isOnline: false,
  },
  {
    id: "user_6",
    firstName: "David",
    lastName: "Rousseau",
    email: "david.rousseau@example.com",
    // No phone
    avatar: generateAvatar("David Rousseau"),
    status: "verified",
    isActive: true,
    lastLoginAt: "2024-07-18T07:15:00Z",
    loginCount: 134,
    createdAt: "2023-08-10T11:20:00Z",
    updatedAt: "2024-07-18T07:15:00Z",
    lastActivity: "2024-07-18T09:30:00Z",
    isOnline: true,
  },
  {
    id: "user_7",
    firstName: "Camille",
    lastName: "Petit",
    email: "camille.petit@example.com",
    phone: "+33777888999",
    avatar: generateAvatar("Camille Petit"),
    status: "verified",
    isActive: true,
    lastLoginAt: "2024-07-16T19:30:00Z",
    loginCount: 89,
    createdAt: "2024-03-12T13:45:00Z",
    updatedAt: "2024-07-16T19:30:00Z",
    lastActivity: "2024-07-16T20:15:00Z",
    isOnline: false,
  },
];

// Mock User Stats
export const mockUserStats: UserStats = {
  totalUsers: mockUsers.length,
  verifiedUsers: mockUsers.filter(u => u.status === 'verified').length,
  pendingUsers: mockUsers.filter(u => u.status === 'pending').length,
  suspendedUsers: mockUsers.filter(u => u.status === 'suspended').length,
  activeUsers: mockUsers.filter(u => u.isActive).length,
  inactiveUsers: mockUsers.filter(u => !u.isActive).length,
  onlineUsers: mockUsers.filter(u => u.isOnline).length,
  newUsersThisMonth: mockUsers.filter(u => {
    const created = new Date(u.createdAt);
    const now = new Date();
    return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear();
  }).length,
  loginActivityToday: mockUsers.filter(u => {
    if (!u.lastLoginAt) return false;
    const lastLogin = new Date(u.lastLoginAt);
    const today = new Date();
    return lastLogin.toDateString() === today.toDateString();
  }).length,
};

// Mock User Messages
export const mockUserMessages: UserMessage[] = [
  {
    id: "msg_1",
    userId: "user_1",
    user: {
      firstName: "Sophie",
      lastName: "Martin",
      email: "sophie.martin@example.com",
      avatar: generateAvatar("Sophie Martin"),
    },
    subject: "Issue with room booking",
    message: "Hello, I'm having trouble booking room A101 for next week. The system shows an error when I try to confirm my reservation.",
    isRead: false,
    priority: "normal",
    status: "open",
    createdAt: "2024-07-18T09:15:00Z",
    updatedAt: "2024-07-18T09:15:00Z",
    responses: [],
  },
  {
    id: "msg_2",
    userId: "user_2",
    user: {
      firstName: "Thomas",
      lastName: "Dubois",
      email: "thomas.dubois@example.com",
      avatar: generateAvatar("Thomas Dubois"),
    },
    subject: "Request for extended stay",
    message: "Hi, I would like to extend my current reservation for room B205 by one week. Is this possible?",
    isRead: true,
    priority: "normal",
    status: "resolved",
    createdAt: "2024-07-17T14:30:00Z",
    updatedAt: "2024-07-17T16:45:00Z",
    responses: [
      {
        id: "resp_1",
        messageId: "msg_2",
        content: "Hello Thomas, yes we can extend your reservation. I've updated your booking to include the additional week.",
        isFromAdmin: true,
        sentAt: "2024-07-17T16:45:00Z",
        sentBy: "admin_1",
        emailSent: true,
      },
    ],
  },
  {
    id: "msg_3",
    userId: "user_6",
    user: {
      firstName: "David",
      lastName: "Rousseau",
      email: "david.rousseau@example.com",
      avatar: generateAvatar("David Rousseau"),
    },
    subject: "Urgent: Payment issue",
    message: "My payment was charged twice for the same reservation. Please help resolve this issue as soon as possible.",
    isRead: true,
    priority: "urgent",
    status: "in_progress",
    createdAt: "2024-07-18T08:00:00Z",
    updatedAt: "2024-07-18T10:30:00Z",
    responses: [
      {
        id: "resp_2",
        messageId: "msg_3",
        content: "Hi David, I'm looking into this payment issue. I'll get back to you within 2 hours with a resolution.",
        isFromAdmin: true,
        sentAt: "2024-07-18T10:30:00Z",
        sentBy: "admin_1",
        emailSent: true,
      },
    ],
  },
];

// Mock User Reviews
export const mockUserReviews: UserReview[] = [
  {
    id: "review_1",
    userId: "user_1",
    user: {
      firstName: "Sophie",
      lastName: "Martin",
      email: "sophie.martin@example.com",
      avatar: generateAvatar("Sophie Martin"),
    },
    reservationId: "res_123",
    roomCode: "A101",
    rating: 5,
    title: "Excellent stay!",
    comment: "The room was perfect, very clean and well-equipped. The booking process was smooth and the staff was helpful.",
    category: "room",
    isPublic: true,
    status: "approved",
    createdAt: "2024-07-15T10:30:00Z",
  },
  {
    id: "review_2",
    userId: "user_2",
    user: {
      firstName: "Thomas",
      lastName: "Dubois",
      email: "thomas.dubois@example.com",
      avatar: generateAvatar("Thomas Dubois"),
    },
    reservationId: "res_124",
    roomCode: "B205",
    rating: 4,
    title: "Good overall experience",
    comment: "Nice room with good amenities. The only issue was that the WiFi was a bit slow, but everything else was great.",
    category: "room",
    isPublic: true,
    status: "approved",
    createdAt: "2024-07-14T16:20:00Z",
    adminResponse: {
      content: "Thank you for your feedback Thomas! We've upgraded our WiFi infrastructure and the issue should be resolved now.",
      respondedBy: "admin_1",
      respondedAt: "2024-07-15T09:00:00Z",
    },
  },
  {
    id: "review_3",
    userId: "user_7",
    user: {
      firstName: "Camille",
      lastName: "Petit",
      email: "camille.petit@example.com",
      avatar: generateAvatar("Camille Petit"),
    },
    rating: 3,
    title: "Could be better",
    comment: "The booking system is a bit confusing and could use some improvements. The support team was helpful though.",
    category: "booking",
    isPublic: false,
    status: "pending",
    createdAt: "2024-07-18T11:00:00Z",
  },
];

// Mock Chat Conversations
export const mockChatConversations: ChatConversation[] = [
  {
    id: "chat_1",
    userId: "user_1",
    user: {
      firstName: "Sophie",
      lastName: "Martin",
      email: "sophie.martin@example.com",
      avatar: generateAvatar("Sophie Martin"),
    },
    subject: "Booking assistance needed",
    status: "open",
    priority: "normal",
    isUnread: true,
    lastMessageAt: "2024-07-18T10:45:00Z",
    createdAt: "2024-07-18T10:30:00Z",
    messages: [
      {
        id: "chat_msg_1",
        conversationId: "chat_1",
        content: "Hi, I need help with booking a room for next month",
        isFromUser: true,
        sentAt: "2024-07-18T10:30:00Z",
        sentBy: "user_1",
        isRead: true,
      },
      {
        id: "chat_msg_2",
        conversationId: "chat_1",
        content: "Hello Sophie! I'd be happy to help you with your booking. What dates are you looking for?",
        isFromUser: false,
        sentAt: "2024-07-18T10:32:00Z",
        sentBy: "admin_1",
        isRead: true,
        emailSent: true,
      },
      {
        id: "chat_msg_3",
        conversationId: "chat_1",
        content: "I need a room from August 15th to 20th, preferably with a kitchen",
        isFromUser: true,
        sentAt: "2024-07-18T10:45:00Z",
        sentBy: "user_1",
        isRead: false,
      },
    ],
  },
  {
    id: "chat_2",
    userId: "user_6",
    user: {
      firstName: "David",
      lastName: "Rousseau",
      email: "david.rousseau@example.com",
      avatar: generateAvatar("David Rousseau"),
    },
    subject: "Payment refund request",
    status: "in_progress",
    priority: "high",
    isUnread: false,
    lastMessageAt: "2024-07-18T09:15:00Z",
    createdAt: "2024-07-18T08:30:00Z",
    messages: [
      {
        id: "chat_msg_4",
        conversationId: "chat_2",
        content: "I was charged twice for my last booking and need a refund",
        isFromUser: true,
        sentAt: "2024-07-18T08:30:00Z",
        sentBy: "user_6",
        isRead: true,
      },
      {
        id: "chat_msg_5",
        conversationId: "chat_2",
        content: "I see the duplicate charge. I'm processing the refund now and you should see it in 3-5 business days.",
        isFromUser: false,
        sentAt: "2024-07-18T09:15:00Z",
        sentBy: "admin_1",
        isRead: true,
        emailSent: true,
      },
    ],
  },
];