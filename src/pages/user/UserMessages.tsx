import React, { useState, useRef } from "react";
import {
  Message,
  Send2,
  Add,
  Eye,
  EyeSlash,
  Warning2,
  Danger,
  Sms,
  Clock,
} from "iconsax-react";
import Button from "@/components/actions/button";
import Badge from "@/components/badge";
import { Input } from "@/components/forms/Input";
import { Textarea } from "@/components/forms/Textarea";
import Modal, { type ModalRef } from "@/components/ui/Modal";
import SpinLoader from "@/components/SpinLoader";
import type { UserMessage, MessageFormData } from "@/types/user.types";
import { useToast } from "@/context/toast-context";

const UserMessages: React.FC = () => {
  const { success, info, error: showError } = useToast();
  
  // Mock current user
  const currentUser = {
    id: "user_1",
    firstName: "Jean",
    lastName: "Dupont",
    email: "jean.dupont@company.com",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jean",
  };

  // Mock messages data - filtered for current user
  const [messages, setMessages] = useState<UserMessage[]>([
    {
      id: "msg_1",
      userId: currentUser.id,
      user: currentUser,
      subject: "Problem with room booking",
      message: "Hello, I'm having trouble booking Conference Room A for tomorrow. The system shows it's available but when I try to confirm, it says there's an error. Can you please help?",
      isRead: false,
      priority: "high",
      status: "in_progress",
      createdAt: "2025-08-19T10:30:00Z",
      updatedAt: "2025-08-19T14:15:00Z",
      responses: [
        {
          id: "resp_1",
          messageId: "msg_1",
          content: "Thank you for reaching out. I've checked the system and found there was a temporary glitch. The room is now available for booking. Please try again and let me know if you encounter any issues.",
          isFromAdmin: true,
          sentAt: "2025-08-19T14:15:00Z",
          sentBy: "admin_1",
          emailSent: true,
        }
      ],
    },
    {
      id: "msg_2",
      userId: currentUser.id,
      user: currentUser,
      subject: "Request for room amenities",
      message: "Could you please add a projector to Meeting Room B? We frequently use this room for presentations and it would be very helpful.",
      isRead: true,
      priority: "normal",
      status: "resolved",
      createdAt: "2025-08-15T09:20:00Z",
      updatedAt: "2025-08-16T11:30:00Z",
      responses: [
        {
          id: "resp_2",
          messageId: "msg_2",
          content: "Great suggestion! We've added a projector to Meeting Room B. It should be available for your next booking. Thank you for the feedback!",
          isFromAdmin: true,
          sentAt: "2025-08-16T11:30:00Z",
          sentBy: "admin_1",
          emailSent: true,
        }
      ],
    },
    {
      id: "msg_3",
      userId: currentUser.id,
      user: currentUser,
      subject: "Billing question",
      message: "I noticed I was charged twice for my reservation last week. Could you please check and refund if necessary?",
      isRead: true,
      priority: "urgent",
      status: "closed",
      createdAt: "2025-08-10T16:45:00Z",
      updatedAt: "2025-08-11T10:20:00Z",
      responses: [
        {
          id: "resp_3",
          messageId: "msg_3",
          content: "I've reviewed your account and confirmed the duplicate charge. A refund of $50.00 has been processed and should appear in your account within 3-5 business days. My apologies for the inconvenience.",
          isFromAdmin: true,
          sentAt: "2025-08-11T10:20:00Z",
          sentBy: "admin_1",
          emailSent: true,
        }
      ],
    },
  ]);

  const [selectedMessage, setSelectedMessage] = useState<UserMessage | null>(null);
  const [showOnlyUnread, setShowOnlyUnread] = useState(false);
  const [loading, setLoading] = useState(false);
  const [newMessageForm, setNewMessageForm] = useState<MessageFormData & { priority: UserMessage["priority"] }>({
    subject: "",
    content: "",
    sendEmail: true,
    priority: "normal",
  });

  const newMessageModalRef = useRef<ModalRef>(null);
  const detailModalRef = useRef<ModalRef>(null);

  const filteredMessages = showOnlyUnread 
    ? messages.filter(msg => !msg.isRead)
    : messages;

  const sortedMessages = [...filteredMessages].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

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
    detailModalRef.current?.open();
  };

  const handleNewMessage = () => {
    setNewMessageForm({
      subject: "",
      content: "",
      sendEmail: true,
      priority: "normal",
    });
    newMessageModalRef.current?.open();
  };

  const handleSendMessage = async () => {
    if (!newMessageForm.subject.trim() || !newMessageForm.content.trim()) {
      showError("Please fill in both subject and message");
      return;
    }

    setLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const newMessage: UserMessage = {
        id: `msg_${Date.now()}`,
        userId: currentUser.id,
        user: currentUser,
        subject: newMessageForm.subject,
        message: newMessageForm.content,
        isRead: false,
        priority: newMessageForm.priority,
        status: "open",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        responses: [],
      };

      setMessages(prev => [newMessage, ...prev]);
      setNewMessageForm({
        subject: "",
        content: "",
        sendEmail: true,
        priority: "normal",
      });
      
      newMessageModalRef.current?.close();
      success("Message sent successfully! You'll receive a response via email.");
    } catch (error) {
      showError("Failed to send message. Please try again.");
    } finally {
      setLoading(false);
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

  // Calculate stats
  const messageStats = {
    total: messages.length,
    unread: messages.filter(m => !m.isRead).length,
    open: messages.filter(m => m.status === 'open').length,
    inProgress: messages.filter(m => m.status === 'in_progress').length,
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
          <p className="text-gray-600 mt-1">
            Contact support and view your message history
          </p>
        </div>

        <Button
          onClick={handleNewMessage}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center space-x-2"
        >
          <Add size={16} color="#ffffff" />
          <span>New Message</span>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Messages</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{messageStats.total}</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <Message color="#3B82F6" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Unread</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{messageStats.unread}</p>
            </div>
            <div className="p-3 bg-orange-50 rounded-lg">
              <Sms color="#F97316" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Open</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{messageStats.open}</p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <Eye color="#10B981" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">In Progress</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{messageStats.inProgress}</p>
            </div>
            <div className="p-3 bg-yellow-50 rounded-lg">
              <Clock color="#F59E0B" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Messages List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Message size={20} color="#7C3AED" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Your Messages</h3>
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

        {/* Messages */}
        <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
          {sortedMessages.map((message) => (
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
                    src={message.user.avatar}
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
                      To: Support Team
                    </div>
                    
                    {message.responses.length > 0 && (
                      <span className="text-xs text-purple-600">
                        {message.responses.length} response{message.responses.length !== 1 ? 's' : ''} received
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
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
                : "Start a conversation with our support team"
              }
            </p>
            {!showOnlyUnread && (
              <Button
                onClick={handleNewMessage}
                className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
              >
                Send your first message
              </Button>
            )}
          </div>
        )}
      </div>

      {/* New Message Modal */}
      <Modal
        ref={newMessageModalRef}
        title="Send Message to Support"
        size="md"
      >
        <div className="p-6 space-y-4">
          <Input
            label="Subject"
            value={newMessageForm.subject}
            onChange={(e) => setNewMessageForm(prev => ({ ...prev, subject: e.target.value }))}
            placeholder="Brief description of your issue"
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Priority
            </label>
            <select
              value={newMessageForm.priority}
              onChange={(e) => setNewMessageForm(prev => ({ ...prev, priority: e.target.value as UserMessage["priority"] }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="low">Low - General inquiry</option>
              <option value="normal">Normal - Standard request</option>
              <option value="high">High - Important issue</option>
              <option value="urgent">Urgent - Critical problem</option>
            </select>
          </div>
          
          <Textarea
            label="Message"
            value={newMessageForm.content}
            onChange={(e) => setNewMessageForm(prev => ({ ...prev, content: e.target.value }))}
            placeholder="Describe your issue or question in detail..."
            rows={6}
          />
          
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="sendEmailNotif"
              checked={newMessageForm.sendEmail}
              onChange={(e) => setNewMessageForm(prev => ({ ...prev, sendEmail: e.target.checked }))}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="sendEmailNotif" className="text-sm text-gray-700">
              Receive response notifications via email
            </label>
          </div>
          
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <Button
              onClick={() => newMessageModalRef.current?.close()}
              className="px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSendMessage}
              disabled={loading || !newMessageForm.subject.trim() || !newMessageForm.content.trim()}
              className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg disabled:opacity-50 flex items-center space-x-2"
            >
              {loading ? (
                <SpinLoader />
              ) : (
                <Send2 size={16} color="white" />
              )}
              <span>{loading ? "Sending..." : "Send Message"}</span>
            </Button>
          </div>
        </div>
      </Modal>

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
                src={selectedMessage.user.avatar}
                alt={`${selectedMessage.user.firstName} ${selectedMessage.user.lastName}`}
                className="w-12 h-12 rounded-full"
              />
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-lg font-medium text-gray-900">
                    Your Message
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
                  Support Responses ({selectedMessage.responses.length})
                </h6>
                <div className="space-y-3">
                  {selectedMessage.responses.map((response) => (
                    <div key={response.id} className="bg-blue-50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-blue-900">
                          Support Team Response
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
          </div>
        )}
      </Modal>
    </div>
  );
};

export default UserMessages;