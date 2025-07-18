// src/pages/admin/UsersManagement.tsx
import React, { useState, useRef } from "react";
import { People, Add, Message, Star1 } from "iconsax-react";
import Button from "@/components/Button";
import UserOverviewCards from "@/components/users/user-overview-cards";
import UserFiltersComponent from "@/components/users/user-filters";
import UserTable from "@/components/users/user-table";
import UserMessagesSection from "@/components/users/user-messages-section";
import UserReviewsSection from "@/components/users/user-reviews-section";
import ConfirmationModal from "@/components/modals/confirmation-modal";
import { useToast } from "@/context/toast-context";
import { 
  mockUsers, 
  mockUserStats, 
  mockUserMessages, 
  mockUserReviews 
} from "@/mocks/users.mocks";
import type { 
  User, 
  UserStats, 
  UserFilters, 
  UserFormData, 
  UserMessage, 
  UserReview,
  MessageFormData 
} from "@/types/user.types";
import type { ModalRef } from "@/types/modal-ref";
import UserFormModal from "@/components/users/user-form-modal";

export default function UsersManagement() {
  const toast = useToast();
  const userFormModalRef = useRef<ModalRef>(null);
  const deleteModalRef = useRef<ModalRef>(null);
  
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [stats, setStats] = useState<UserStats>(mockUserStats);
  const [messages, setMessages] = useState<UserMessage[]>(mockUserMessages);
  const [reviews, setReviews] = useState<UserReview[]>(mockUserReviews);
  const [filters, setFilters] = useState<UserFilters>({});
  const [showFilters, setShowFilters] = useState(false);
  const [isLoading] = useState(false);
  const [userToEdit, setUserToEdit] = useState<User | null>(null);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [, setUserToContact] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<'users' | 'messages' | 'reviews'>('users');

  // Filter users based on current filters
  const filteredUsers = users.filter((user) => {
    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const matchesSearch = 
        user.firstName.toLowerCase().includes(searchLower) ||
        user.lastName.toLowerCase().includes(searchLower) ||
        user.email.toLowerCase().includes(searchLower) ||
        (user.phone && user.phone.toLowerCase().includes(searchLower));
      if (!matchesSearch) return false;
    }

    // Status filter
    if (filters.status && user.status !== filters.status) {
      return false;
    }

    // Active status filter
    if (filters.isActive !== undefined && user.isActive !== filters.isActive) {
      return false;
    }

    // Has phone filter
    if (filters.hasPhone !== undefined) {
      const hasPhone = !!user.phone;
      if (hasPhone !== filters.hasPhone) return false;
    }

    // Date filters
    if (filters.createdAfter) {
      const createdDate = new Date(user.createdAt);
      const filterDate = new Date(filters.createdAfter);
      if (createdDate < filterDate) return false;
    }

    if (filters.createdBefore) {
      const createdDate = new Date(user.createdAt);
      const filterDate = new Date(filters.createdBefore);
      if (createdDate > filterDate) return false;
    }

    if (filters.lastLoginAfter && user.lastLoginAt) {
      const lastLoginDate = new Date(user.lastLoginAt);
      const filterDate = new Date(filters.lastLoginAfter);
      if (lastLoginDate < filterDate) return false;
    }

    return true;
  });

  // Update stats when users change
  React.useEffect(() => {
    const newStats: UserStats = {
      totalUsers: users.length,
      verifiedUsers: users.filter(u => u.status === 'verified').length,
      pendingUsers: users.filter(u => u.status === 'pending').length,
      suspendedUsers: users.filter(u => u.status === 'suspended').length,
      activeUsers: users.filter(u => u.isActive).length,
      inactiveUsers: users.filter(u => !u.isActive).length,
      onlineUsers: users.filter(u => u.isOnline).length,
      newUsersThisMonth: users.filter(u => {
        const created = new Date(u.createdAt);
        const now = new Date();
        return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear();
      }).length,
      loginActivityToday: users.filter(u => {
        if (!u.lastLoginAt) return false;
        const lastLogin = new Date(u.lastLoginAt);
        const today = new Date();
        return lastLogin.toDateString() === today.toDateString();
      }).length,
    };
    setStats(newStats);
  }, [users]);

  // Handler functions
  const handleCreateUser = () => {
    setUserToEdit(null);
    userFormModalRef.current?.open();
  };

  const handleUserEdit = (user: User) => {
    setUserToEdit(user);
    userFormModalRef.current?.open();
  };

  const handleUserDelete = (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (user) {
      if (user.isActive) {
        toast.error("Cannot Delete", "You must deactivate the user before deletion.");
        return;
      }
      setUserToDelete(user);
      deleteModalRef.current?.open();
    }
  };

  const handleUserView = (user: User) => {
    console.log("View user:", user);
    toast.info("View User", `User details for ${user.firstName} ${user.lastName}`);
  };

  const handleUserToggleStatus = (userId: string, newStatus: boolean) => {
    setUsers(prevUsers => 
      prevUsers.map(user => 
        user.id === userId 
          ? { 
              ...user, 
              isActive: newStatus, 
              updatedAt: new Date().toISOString() 
            }
          : user
      )
    );
    
    const user = users.find(u => u.id === userId);
    if (user) {
      toast.success(
        "Status Changed", 
        `${user.firstName} ${user.lastName} is now ${newStatus ? 'active' : 'inactive'}`
      );
    }
  };

  const handleUserVerify = (userId: string) => {
    setUsers(prevUsers => 
      prevUsers.map(user => 
        user.id === userId 
          ? { 
              ...user, 
              status: 'verified' as const, 
              updatedAt: new Date().toISOString() 
            }
          : user
      )
    );
    
    const user = users.find(u => u.id === userId);
    if (user) {
      toast.success("User Verified", `${user.firstName} ${user.lastName} has been verified`);
    }
  };

  const handleUserSuspend = (userId: string) => {
    setUsers(prevUsers => 
      prevUsers.map(user => 
        user.id === userId 
          ? { 
              ...user, 
              status: 'suspended' as const, 
              isActive: false,
              updatedAt: new Date().toISOString() 
            }
          : user
      )
    );
    
    const user = users.find(u => u.id === userId);
    if (user) {
      toast.success("User Suspended", `${user.firstName} ${user.lastName} has been suspended`);
    }
  };

  const handleUserContact = (user: User) => {
    setUserToContact(user);
    toast.info("Contact User", `Opening contact options for ${user.firstName} ${user.lastName}`);
  };

  const handleClearFilters = () => {
    setFilters({});
    toast.info("Filters Reset", "All filters have been cleared");
  };

  // Modal handlers
  const confirmDelete = () => {
    if (userToDelete) {
      setUsers(prevUsers => prevUsers.filter(u => u.id !== userToDelete.id));
      
      toast.success(
        "User Deleted",
        `${userToDelete.firstName} ${userToDelete.lastName} has been successfully deleted.`
      );
      
      setUserToDelete(null);
    }
  };

  const cancelDelete = () => {
    setUserToDelete(null);
  };

  const handleUserSave = (userData: UserFormData) => {
    if (userToEdit) {
      // Edit existing user
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user.id === userToEdit.id 
            ? {
                ...user,
                firstName: userData.firstName,
                lastName: userData.lastName,
                email: userData.email,
                phone: userData.phone || undefined,
                updatedAt: new Date().toISOString(),
              }
            : user
        )
      );
      
      toast.success(
        "User Updated",
        `${userData.firstName} ${userData.lastName} has been successfully updated.`
      );
    } else {
      // Create new user
      const newUser: User = {
        id: `user_${Date.now()}`,
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        phone: userData.phone || undefined,
        status: 'pending',
        isActive: true,
        loginCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isOnline: false,
      };
      
      setUsers(prevUsers => [...prevUsers, newUser]);
      
      toast.success(
        "User Created",
        `${userData.firstName} ${userData.lastName} has been successfully created.`
        + (userData.sendWelcomeEmail ? " Verification email sent." : "")
      );
    }
    
    setUserToEdit(null);
  };

  const handleUserFormCancel = () => {
    setUserToEdit(null);
  };

  // Message handlers
  const handleMessageReply = (messageId: string, response: MessageFormData) => {
    setMessages(prevMessages =>
      prevMessages.map(msg =>
        msg.id === messageId
          ? {
              ...msg,
              status: 'in_progress' as const,
              isRead: true,
              updatedAt: new Date().toISOString(),
              responses: [
                ...msg.responses,
                {
                  id: `resp_${Date.now()}`,
                  messageId,
                  content: response.content,
                  isFromAdmin: true,
                  sentAt: new Date().toISOString(),
                  sentBy: 'admin_1',
                  emailSent: response.sendEmail,
                }
              ]
            }
          : msg
      )
    );
    
    toast.success("Reply Sent", "Your response has been sent to the user.");
  };

  const handleMessageStatusChange = (messageId: string, status: UserMessage["status"]) => {
    setMessages(prevMessages =>
      prevMessages.map(msg =>
        msg.id === messageId
          ? { ...msg, status, updatedAt: new Date().toISOString() }
          : msg
      )
    );
    
    toast.success("Status Updated", `Message status changed to ${status.replace('_', ' ')}`);
  };

  const handleMarkAsRead = (messageId: string) => {
    setMessages(prevMessages =>
      prevMessages.map(msg =>
        msg.id === messageId
          ? { ...msg, isRead: true, updatedAt: new Date().toISOString() }
          : msg
      )
    );
  };

  // Review handlers
  const handleReviewStatusChange = (reviewId: string, status: UserReview["status"]) => {
    setReviews(prevReviews =>
      prevReviews.map(review =>
        review.id === reviewId
          ? { ...review, status }
          : review
      )
    );
    
    toast.success("Review Status Updated", `Review has been ${status}`);
  };

  const handleReviewResponse = (reviewId: string, response: string) => {
    setReviews(prevReviews =>
      prevReviews.map(review =>
        review.id === reviewId
          ? {
              ...review,
              adminResponse: {
                content: response,
                respondedBy: 'admin_1',
                respondedAt: new Date().toISOString(),
              }
            }
          : review
      )
    );
    
    toast.success("Response Saved", "Your response has been saved to the review");
  };

  const handleReviewVisibilityChange = (reviewId: string, isPublic: boolean) => {
    setReviews(prevReviews =>
      prevReviews.map(review =>
        review.id === reviewId
          ? { ...review, isPublic }
          : review
      )
    );
    
    toast.success(
      "Visibility Updated", 
      `Review is now ${isPublic ? 'public' : 'private'}`
    );
  };

  const tabs = [
    { key: 'users' as const, label: 'Users Management', count: filteredUsers.length },
    { key: 'messages' as const, label: 'Recent Messages', count: messages.length },
    { key: 'reviews' as const, label: 'User Reviews', count: reviews.length },
  ];

  return (
    <div className="space-y-6 grow p-5 mt-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-blue-100 rounded-xl">
            <People size={32} color="#1D4ED8" variant="Bold" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              User Management
            </h1>
            <p className="text-gray-600 mt-1">
              Manage users, messages, and reviews
            </p>
          </div>
        </div>
        <Button
          onClick={handleCreateUser}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg flex items-center space-x-2"
        >
          <Add size={20} color="white" />
          <span>Add User</span>
        </Button>
      </div>

      {/* Overview Cards */}
      <UserOverviewCards
        stats={stats}
        trends={{
          totalUsers: 5.2,
          verifiedUsers: 8.1,
          onlineUsers: 12.5,
          loginActivity: 3.2,
        }}
      />

      {/* Tabs Navigation */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.key
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                {tab.key === 'users' && <People size={16} color="currentColor" />}
                {tab.key === 'messages' && <Message size={16} color="currentColor" />}
                {tab.key === 'reviews' && <Star1 size={16} color="currentColor" />}
                <span>{tab.label}</span>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  activeTab === tab.key
                    ? "bg-blue-100 text-blue-800"
                    : "bg-gray-100 text-gray-600"
                }`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* Users Tab */}
          {activeTab === 'users' && (
            <div className="space-y-6">
              {/* Filters */}
              <UserFiltersComponent
                filters={filters}
                onFiltersChange={setFilters}
                onClearFilters={handleClearFilters}
                onToggleFilters={() => setShowFilters(!showFilters)}
                showFilters={showFilters}
              />

              {/* Users Table */}
              <UserTable
                users={filteredUsers}
                onUserEdit={handleUserEdit}
                onUserDelete={handleUserDelete}
                onUserView={handleUserView}
                onUserToggleStatus={handleUserToggleStatus}
                onUserVerify={handleUserVerify}
                onUserSuspend={handleUserSuspend}
                onUserContact={handleUserContact}
                isLoading={isLoading}
              />

              {/* Results Summary */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>
                    Showing {filteredUsers.length} user{filteredUsers.length !== 1 ? 's' : ''} of {users.length} total
                  </span>
                  {Object.keys(filters).length > 0 && (
                    <span>Filters applied</span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Messages Tab */}
          {activeTab === 'messages' && (
            <UserMessagesSection
              messages={messages}
              onMessageReply={handleMessageReply}
              onMessageStatusChange={handleMessageStatusChange}
              onMarkAsRead={handleMarkAsRead}
            />
          )}

          {/* Reviews Tab */}
          {activeTab === 'reviews' && (
            <UserReviewsSection
              reviews={reviews}
              onReviewStatusChange={handleReviewStatusChange}
              onReviewResponse={handleReviewResponse}
              onReviewVisibilityChange={handleReviewVisibilityChange}
            />
          )}
        </div>
      </div>

      {/* Modals */}
      <ConfirmationModal
        ref={deleteModalRef}
        title="Delete User"
        message={`Are you sure you want to delete ${userToDelete?.firstName} ${userToDelete?.lastName}?`}
        description="This action cannot be undone. All user data including reservations and messages will be permanently deleted."
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />

      <UserFormModal
        ref={userFormModalRef}
        user={userToEdit}
        onSave={handleUserSave}
        onCancel={handleUserFormCancel}
      />
    </div>
  );
}