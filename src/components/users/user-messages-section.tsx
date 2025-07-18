// src/components/users/user-messages-section.tsx
import { useState, useRef } from "react";
import {
  Message,
  Send2,
  Eye,
  EyeSlash,
  Warning2,
  Danger,
  Sms,
} from "iconsax-react";
import Button from "@/components/actions/button";
import Badge from "@/components/badge";
import { Input } from "@/components/forms/Input";
import { Textarea } from "@/components/forms/Textarea";
import Modal, { type ModalRef } from "@/components/ui/Modal";
import type { UserMessage, MessageFormData } from "@/types/user.types";
import { ArrowBendDoubleUpLeft } from "@phosphor-icons/react";

interface UserMessagesSectionProps {
  messages: UserMessage[];
  onMessageReply: (messageId: string, response: MessageFormData) => void;
  onMessageStatusChange: (messageId: string, status: UserMessage["status"]) => void;
  onMarkAsRead: (messageId: string) => void;
}

export default function UserMessagesSection({
  messages,
  onMessageReply,
  onMessageStatusChange,
  onMarkAsRead,
}: UserMessagesSectionProps) {
  const [selectedMessage, setSelectedMessage] = useState<UserMessage | null>(null);
  const [replyForm, setReplyForm] = useState<MessageFormData>({
    subject: "",
    content: "",
    sendEmail: true,
  });
  const [showOnlyUnread, setShowOnlyUnread] = useState(false);

  const replyModalRef = useRef<ModalRef>(null);
  const detailModalRef = useRef<ModalRef>(null);

  const filteredMessages = showOnlyUnread 
    ? messages.filter(msg => !msg.isRead)
    : messages;

  const sortedMessages = [...filteredMessages].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const generateAvatar = (firstName: string, lastName: string, avatar?: string) => {
    if (avatar) return avatar;
    return `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(`${firstName} ${lastName}`)}`;
  };

  const getPriorityColor = (priority: UserMessage["priority"]) => {
    switch (priority) {
      case "urgent":
        return "bg-red-100 text-red-800";
      case "high":
        return "bg-orange-100 text-orange-800";
      case "normal":
        return "bg-blue-100 text-blue-800";
      case "low":
        return "bg-gray-100 text-gray-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const getPriorityIcon = (priority: UserMessage["priority"]) => {
    switch (priority) {
      case "urgent":
        return <Danger size={14} color="#DC2626" />;
      case "high":
        return <Warning2 size={14} color="#EA580C" />;
      default:
        return <Message size={14} color="#6B7280" />;
    }
  };

  const getStatusColor = (status: UserMessage["status"]) => {
    switch (status) {
      case "open":
        return "bg-green-100 text-green-800";
      case "in_progress":
        return "bg-yellow-100 text-yellow-800";
      case "resolved":
        return "bg-blue-100 text-blue-800";
      case "closed":
        return "bg-gray-100 text-gray-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const handleViewMessage = (message: UserMessage) => {
    setSelectedMessage(message);
    if (!message.isRead) {
      onMarkAsRead(message.id);
    }
    detailModalRef.current?.open();
  };

  const handleReplyToMessage = (message: UserMessage) => {
    setSelectedMessage(message);
    setReplyForm({
      subject: `Re: ${message.subject}`,
      content: "",
      sendEmail: true,
    });
    replyModalRef.current?.open();
  };

  const handleSendReply = () => {
    if (selectedMessage && replyForm.content.trim()) {
      onMessageReply(selectedMessage.id, replyForm);
      setReplyForm({ subject: "", content: "", sendEmail: true });
      replyModalRef.current?.close();
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-purple-100 rounded-lg">
            <Message size={20} color="#7C3AED" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Recent Messages</h3>
            <p className="text-sm text-gray-600">
              {filteredMessages.length} message{filteredMessages.length !== 1 ? 's' : ''} 
              {showOnlyUnread && ' (unread only)'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button
            onClick={() => setShowOnlyUnread(!showOnlyUnread)}
            className={`px-3 py-2 rounded-lg transition-colors ${
              showOnlyUnread 
                ? "bg-purple-100 text-purple-700" 
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {showOnlyUnread ? (
              <EyeSlash size={16} color="currentColor" />
            ) : (
              <Eye size={16} color="currentColor" />
            )}
            <span className="ml-2">{showOnlyUnread ? "Show All" : "Unread Only"}</span>
          </Button>
        </div>
      </div>

      {/* Messages List */}
      <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
        {sortedMessages.map((message) => {
          const avatar = generateAvatar(message.user.firstName, message.user.lastName, message.user.avatar);
          
          return (
            <div
              key={message.id}
              className={`p-4 hover:bg-gray-50 transition-colors cursor-pointer ${
                !message.isRead ? "bg-blue-50" : ""
              }`}
              onClick={() => handleViewMessage(message)}
            >
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 relative">
                  <img
                    src={avatar}
                    alt={`${message.user.firstName} ${message.user.lastName}`}
                    className="w-10 h-10 rounded-full"
                  />
                  {!message.isRead && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full"></div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <h4 className="text-sm font-medium text-gray-900 truncate">
                        {message.user.firstName} {message.user.lastName}
                      </h4>
                      <div className="flex items-center space-x-1">
                        {getPriorityIcon(message.priority)}
                        <Badge className={`text-xs px-2 py-1 ${getPriorityColor(message.priority)}`}>
                          {message.priority}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-gray-500">
                        {formatTimeAgo(message.createdAt)}
                      </span>
                      <Badge className={`text-xs px-2 py-1 ${getStatusColor(message.status)}`}>
                        {message.status.replace('_', ' ')}
                      </Badge>
                    </div>
                  </div>

                  <h5 className="text-sm font-medium text-gray-900 mb-1 truncate">
                    {message.subject}
                  </h5>
                  
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {message.message}
                  </p>

                  <div className="flex items-center justify-between mt-3">
                    <div className="text-xs text-gray-500">
                      {message.user.email}
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {message.responses.length > 0 && (
                        <span className="text-xs text-gray-500">
                          {message.responses.length} response{message.responses.length !== 1 ? 's' : ''}
                        </span>
                      )}
                      
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleReplyToMessage(message);
                        }}
                        className="px-2 py-1 text-xs bg-purple-600 text-white hover:bg-purple-700 rounded"
                      >
                        <ArrowBendDoubleUpLeft size={12} color="white" />
                        <span className="ml-1">Reply</span>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {sortedMessages.length === 0 && (
        <div className="text-center py-8">
          <Message size={48} color="#9CA3AF" className="mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900">
            {showOnlyUnread ? "No unread messages" : "No messages yet"}
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            {showOnlyUnread 
              ? "All messages have been read" 
              : "User messages will appear here when they contact support"
            }
          </p>
        </div>
      )}

      {/* Message Detail Modal */}
      <Modal
        ref={detailModalRef}
        title="Message Details"
        size="lg"
      >
        {selectedMessage && (
          <div className="p-6 space-y-6">
            {/* Message Header */}
            <div className="flex items-start space-x-4 pb-4 border-b border-gray-200">
              <img
                src={generateAvatar(selectedMessage.user.firstName, selectedMessage.user.lastName, selectedMessage.user.avatar)}
                alt={`${selectedMessage.user.firstName} ${selectedMessage.user.lastName}`}
                className="w-12 h-12 rounded-full"
              />
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-lg font-medium text-gray-900">
                    {selectedMessage.user.firstName} {selectedMessage.user.lastName}
                  </h4>
                  <div className="flex items-center space-x-2">
                    <Badge className={`text-xs px-2 py-1 ${getPriorityColor(selectedMessage.priority)}`}>
                      {selectedMessage.priority}
                    </Badge>
                    <Badge className={`text-xs px-2 py-1 ${getStatusColor(selectedMessage.status)}`}>
                      {selectedMessage.status.replace('_', ' ')}
                    </Badge>
                  </div>
                </div>
                <p className="text-sm text-gray-600">{selectedMessage.user.email}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(selectedMessage.createdAt).toLocaleString()}
                </p>
              </div>
            </div>

            {/* Message Content */}
            <div>
              <h5 className="text-lg font-medium text-gray-900 mb-3">
                {selectedMessage.subject}
              </h5>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-700 whitespace-pre-wrap">
                  {selectedMessage.message}
                </p>
              </div>
            </div>

            {/* Responses */}
            {selectedMessage.responses.length > 0 && (
              <div>
                <h6 className="text-md font-medium text-gray-900 mb-3">
                  Responses ({selectedMessage.responses.length})
                </h6>
                <div className="space-y-3">
                  {selectedMessage.responses.map((response) => (
                    <div key={response.id} className="bg-blue-50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-blue-900">
                          {response.isFromAdmin ? 'Admin Response' : 'User Reply'}
                        </span>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-blue-600">
                            {new Date(response.sentAt).toLocaleString()}
                          </span>
                          {response.emailSent && (
                            <Badge className="text-xs px-2 py-1 bg-green-100 text-green-800">
                              <Sms size={12} color="#059669" />
                              <span className="ml-1">Emailed</span>
                            </Badge>
                          )}
                        </div>
                      </div>
                      <p className="text-blue-800 whitespace-pre-wrap">
                        {response.content}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <div className="flex space-x-2">
                <select
                  value={selectedMessage.status}
                  onChange={(e) => onMessageStatusChange(selectedMessage.id, e.target.value as UserMessage["status"])}
                  className="text-sm border border-gray-300 rounded px-3 py-1"
                >
                  <option value="open">Open</option>
                  <option value="in_progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
              
              <Button
                onClick={() => {
                  detailModalRef.current?.close();
                  handleReplyToMessage(selectedMessage);
                }}
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg"
              >
                <ArrowBendDoubleUpLeft size={16} color="white" />
                <span className="ml-2">Reply</span>
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Reply Modal */}
      <Modal
        ref={replyModalRef}
        title={`Reply to ${selectedMessage?.user.firstName} ${selectedMessage?.user.lastName}`}
        size="md"
      >
        <div className="p-6 space-y-4">
          <Input
            label="Subject"
            value={replyForm.subject}
            onChange={(e) => setReplyForm(prev => ({ ...prev, subject: e.target.value }))}
            placeholder="Reply subject"
          />
          
          <Textarea
            label="Message"
            value={replyForm.content}
            onChange={(e) => setReplyForm(prev => ({ ...prev, content: e.target.value }))}
            placeholder="Type your reply..."
            rows={6}
          />
          
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="sendEmail"
              checked={replyForm.sendEmail}
              onChange={(e) => setReplyForm(prev => ({ ...prev, sendEmail: e.target.checked }))}
              className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
            />
            <label htmlFor="sendEmail" className="text-sm text-gray-700">
              Send response via email
            </label>
          </div>
          
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <Button
              onClick={() => replyModalRef.current?.close()}
              className="px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSendReply}
              disabled={!replyForm.content.trim()}
              className="px-4 py-2 bg-purple-600 text-white hover:bg-purple-700 rounded-lg disabled:opacity-50"
            >
              <Send2 size={16} color="white" />
              <span className="ml-2">Send Reply</span>
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}