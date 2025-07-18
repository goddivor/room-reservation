// src/components/users/user-table.tsx
import { useState } from "react";
import {
  Edit,
  Trash,
  Eye,
  StatusUp,
  Status,
  People,
  More,
  TickSquare,
  CloseCircle,
  Warning2,
  Call,
  Sms,
  Timer1,
} from "iconsax-react";
import Badge from "@/components/badge";
import Button from "@/components/actions/button";
import type { User } from "@/types/user.types";

interface UserTableProps {
  users: User[];
  onUserEdit: (user: User) => void;
  onUserDelete: (userId: string) => void;
  onUserView: (user: User) => void;
  onUserToggleStatus: (userId: string, newStatus: boolean) => void;
  onUserVerify: (userId: string) => void;
  onUserSuspend: (userId: string) => void;
  onUserContact: (user: User) => void;
  isLoading?: boolean;
}

export default function UserTable({
  users,
  onUserEdit,
  onUserDelete,
  onUserView,
  onUserToggleStatus,
  onUserContact,
  isLoading = false,
}: UserTableProps) {
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  const getStatusBadge = (status: User["status"]) => {
    switch (status) {
      case "verified":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "suspended":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: User["status"]) => {
    switch (status) {
      case "verified":
        return <TickSquare size={16} color="#059669" />;
      case "pending":
        return <Timer1 size={16} color="#F59E0B" />;
      case "suspended":
        return <Warning2 size={16} color="#DC2626" />;
      default:
        return <CloseCircle size={16} color="#6B7280" />;
    }
  };

  const getActivityStatus = (user: User) => {
    if (user.isOnline) {
      return { label: "Online", color: "bg-green-100 text-green-800" };
    }
    
    if (user.lastActivity) {
      const lastActivity = new Date(user.lastActivity);
      const now = new Date();
      const diffHours = (now.getTime() - lastActivity.getTime()) / (1000 * 60 * 60);
      
      if (diffHours < 24) {
        return { label: "Recently active", color: "bg-blue-100 text-blue-800" };
      }
    }
    
    return { label: "Inactive", color: "bg-gray-100 text-gray-600" };
  };

  const formatLastLogin = (lastLoginAt?: string) => {
    if (!lastLoginAt) return "Never";
    
    const lastLogin = new Date(lastLoginAt);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - lastLogin.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    
    return lastLogin.toLocaleDateString();
  };

  const generateAvatar = (firstName: string, lastName: string, avatar?: string) => {
    if (avatar) return avatar;
    return `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(`${firstName} ${lastName}`)}`;
  };

  const handleSelectUser = (userId: string) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSelectAll = () => {
    setSelectedUsers((prev) =>
      prev.length === users.length ? [] : users.map((user) => user.id)
    );
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-8 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Bulk actions header */}
      {selectedUsers.length > 0 && (
        <div className="bg-blue-50 border-b border-blue-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-blue-900">
              {selectedUsers.length} user{selectedUsers.length > 1 ? "s" : ""} selected
            </span>
            <div className="flex space-x-2">
              <Button className="text-sm px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700">
                <StatusUp size={14} color="white" />
                <span className="ml-1">Activate</span>
              </Button>
              <Button className="text-sm px-3 py-1 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700">
                <Status size={14} color="white" />
                <span className="ml-1">Deactivate</span>
              </Button>
              <Button className="text-sm px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                <Sms size={14} color="white" />
                <span className="ml-1">Send Email</span>
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left">
                <input
                  type="checkbox"
                  checked={selectedUsers.length === users.length && users.length > 0}
                  onChange={handleSelectAll}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                User
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contact
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Activity
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Last Login
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => {
              const activityStatus = getActivityStatus(user);
              const avatar = generateAvatar(user.firstName, user.lastName, user.avatar);

              return (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(user.id)}
                      onChange={() => handleSelectUser(user.id)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </td>

                  <td className="px-6 py-4 max-w-[280px]">
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0 relative">
                        <img
                          src={avatar}
                          alt={`${user.firstName} ${user.lastName}`}
                          className="w-10 h-10 rounded-full"
                        />
                        {user.isOnline && (
                          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-medium text-gray-900 truncate">
                          {user.firstName} {user.lastName}
                        </div>
                        <div className="text-sm text-gray-500 truncate">
                          ID: {user.id}
                        </div>
                        <div className="text-xs text-gray-400">
                          {user.loginCount} login{user.loginCount !== 1 ? 's' : ''}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="text-sm text-gray-900">{user.email}</div>
                      {user.phone ? (
                        <div className="flex items-center space-x-1 text-sm text-gray-600">
                          <Call size={12} color="#6B7280" />
                          <span>{user.phone}</span>
                        </div>
                      ) : (
                        <div className="text-xs text-gray-400 italic">No phone</div>
                      )}
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(user.status)}
                        <Badge className={`text-xs px-2 py-1 ${getStatusBadge(user.status)}`}>
                          {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                        </Badge>
                      </div>
                      <div>
                        <Badge 
                          className={`text-xs px-2 py-1 ${
                            user.isActive 
                              ? "bg-green-100 text-green-800" 
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {user.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <Badge className={`text-xs px-2 py-1 ${activityStatus.color}`}>
                      {activityStatus.label}
                    </Badge>
                    {user.lastActivity && (
                      <div className="text-xs text-gray-500 mt-1">
                        {new Date(user.lastActivity).toLocaleDateString()}
                      </div>
                    )}
                  </td>

                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {formatLastLogin(user.lastLoginAt)}
                    </div>
                    {user.lastLoginAt && (
                      <div className="text-xs text-gray-500">
                        {new Date(user.lastLoginAt).toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    )}
                  </td>

                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center space-x-2 justify-end">
                      <Button
                        onClick={() => onUserView(user)}
                        className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg"
                        title="View Details"
                      >
                        <Eye size={16} color="currentColor" />
                      </Button>

                      <Button
                        onClick={() => onUserContact(user)}
                        className="p-2 text-purple-600 hover:text-purple-800 hover:bg-purple-50 rounded-lg"
                        title="Contact User"
                      >
                        <Sms size={16} color="currentColor" />
                      </Button>

                      <Button
                        onClick={() => onUserEdit(user)}
                        className="p-2 text-green-600 hover:text-green-800 hover:bg-green-50 rounded-lg"
                        title="Edit"
                      >
                        <Edit size={16} color="currentColor" />
                      </Button>

                      <Button
                        onClick={() => onUserToggleStatus(user.id, !user.isActive)}
                        className={`p-2 rounded-lg ${
                          user.isActive
                            ? "text-yellow-600 hover:text-yellow-800 hover:bg-yellow-50"
                            : "text-green-600 hover:text-green-800 hover:bg-green-50"
                        }`}
                        title={user.isActive ? "Deactivate" : "Activate"}
                      >
                        {user.isActive ? (
                          <Status size={16} color="currentColor" />
                        ) : (
                          <StatusUp size={16} color="currentColor" />
                        )}
                      </Button>

                      <Button
                        onClick={() => onUserDelete(user.id)}
                        disabled={user.isActive}
                        className={`p-2 rounded-lg ${
                          user.isActive
                            ? "text-gray-300 cursor-not-allowed"
                            : "text-red-600 hover:text-red-800 hover:bg-red-50"
                        }`}
                        title={user.isActive ? "Deactivate user first" : "Delete"}
                      >
                        <Trash size={16} color="currentColor" />
                      </Button>

                      <Button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg">
                        <More size={16} color="currentColor" />
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {users.length === 0 && (
        <div className="text-center py-12">
          <People size={48} color="#9CA3AF" className="mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900">No users found</h3>
          <p className="text-sm text-gray-500 mt-1">
            Try adjusting your search criteria or filters.
          </p>
        </div>
      )}
    </div>
  );
}