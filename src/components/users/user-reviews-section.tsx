// src/components/users/user-reviews-section.tsx
import { useState, useRef } from "react";
import {
  Star1,
  Eye,
  EyeSlash,
  TickSquare,
  CloseSquare,
  Clock,
  Buildings2,
  Send2,
} from "iconsax-react";
import Button from "@/components/actions/button";
import Badge from "@/components/badge";
import { Textarea } from "@/components/forms/Textarea";
import Modal, { type ModalRef } from "@/components/ui/Modal";
import type { UserReview } from "@/types/user.types";
import { ArrowBendDoubleUpLeft } from "@phosphor-icons/react";

interface UserReviewsSectionProps {
  reviews: UserReview[];
  onReviewStatusChange: (reviewId: string, status: UserReview["status"]) => void;
  onReviewResponse: (reviewId: string, response: string) => void;
  onReviewVisibilityChange: (reviewId: string, isPublic: boolean) => void;
}

export default function UserReviewsSection({
  reviews,
  onReviewStatusChange,
  onReviewResponse,
  onReviewVisibilityChange,
}: UserReviewsSectionProps) {
  const [selectedReview, setSelectedReview] = useState<UserReview | null>(null);
  const [responseText, setResponseText] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterCategory, setFilterCategory] = useState<string>("all");

  const responseModalRef = useRef<ModalRef>(null);
  const detailModalRef = useRef<ModalRef>(null);

  const generateAvatar = (firstName: string, lastName: string, avatar?: string) => {
    if (avatar) return avatar;
    return `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(`${firstName} ${lastName}`)}`;
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star1
            key={star}
            size={16}
            color={star <= rating ? "#FCD34D" : "#E5E7EB"}
            variant={star <= rating ? "Bold" : "Outline"}
          />
        ))}
      </div>
    );
  };

  const getStatusColor = (status: UserReview["status"]) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const getStatusIcon = (status: UserReview["status"]) => {
    switch (status) {
      case "approved":
        return <TickSquare size={14} color="#059669" />;
      case "pending":
        return <Clock size={14} color="#F59E0B" />;
      case "rejected":
        return <CloseSquare size={14} color="#DC2626" />;
      default:
        return <Clock size={14} color="#6B7280" />;
    }
  };

  const getCategoryColor = (category: UserReview["category"]) => {
    switch (category) {
      case "room":
        return "bg-blue-100 text-blue-800";
      case "service":
        return "bg-purple-100 text-purple-800";
      case "booking":
        return "bg-green-100 text-green-800";
      case "support":
        return "bg-orange-100 text-orange-800";
      case "general":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const filteredReviews = reviews.filter(review => {
    if (filterStatus !== "all" && review.status !== filterStatus) return false;
    if (filterCategory !== "all" && review.category !== filterCategory) return false;
    return true;
  });

  const sortedReviews = [...filteredReviews].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const handleViewReview = (review: UserReview) => {
    setSelectedReview(review);
    detailModalRef.current?.open();
  };

  const handleRespondToReview = (review: UserReview) => {
    setSelectedReview(review);
    setResponseText(review.adminResponse?.content || "");
    responseModalRef.current?.open();
  };

  const handleSendResponse = () => {
    if (selectedReview && responseText.trim()) {
      onReviewResponse(selectedReview.id, responseText);
      setResponseText("");
      responseModalRef.current?.close();
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString();
  };

  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
    : 0;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Star1 size={20} color="#F59E0B" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Recent Reviews</h3>
              <p className="text-sm text-gray-600">
                {reviews.length} review{reviews.length !== 1 ? 's' : ''} • Average: {averageRating.toFixed(1)} stars
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {renderStars(Math.round(averageRating))}
            <span className="text-sm font-medium text-gray-700">
              {averageRating.toFixed(1)}
            </span>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center space-x-4">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="text-sm border border-gray-300 rounded px-3 py-1"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
          
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="text-sm border border-gray-300 rounded px-3 py-1"
          >
            <option value="all">All Categories</option>
            <option value="room">Room</option>
            <option value="service">Service</option>
            <option value="booking">Booking</option>
            <option value="support">Support</option>
            <option value="general">General</option>
          </select>
          
          <span className="text-sm text-gray-500">
            {filteredReviews.length} review{filteredReviews.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      {/* Reviews List */}
      <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
        {sortedReviews.map((review) => {
          const avatar = generateAvatar(review.user.firstName, review.user.lastName, review.user.avatar);
          
          return (
            <div
              key={review.id}
              className="p-4 hover:bg-gray-50 transition-colors cursor-pointer"
              onClick={() => handleViewReview(review)}
            >
              <div className="flex items-start space-x-4">
                <img
                  src={avatar}
                  alt={`${review.user.firstName} ${review.user.lastName}`}
                  className="w-10 h-10 rounded-full"
                />

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <h4 className="text-sm font-medium text-gray-900">
                        {review.user.firstName} {review.user.lastName}
                      </h4>
                      {review.roomCode && (
                        <div className="flex items-center space-x-1 text-xs text-gray-500">
                          <Buildings2 size={12} color="#6B7280" />
                          <span>{review.roomCode}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-gray-500">
                        {formatTimeAgo(review.createdAt)}
                      </span>
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          onReviewVisibilityChange(review.id, !review.isPublic);
                        }}
                        className="p-1 text-gray-400 hover:text-gray-600"
                        title={review.isPublic ? "Make private" : "Make public"}
                      >
                        {review.isPublic ? (
                          <Eye size={14} color="currentColor" />
                        ) : (
                          <EyeSlash size={14} color="currentColor" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 mb-2">
                    {renderStars(review.rating)}
                    <Badge className={`text-xs px-2 py-1 ${getCategoryColor(review.category)}`}>
                      {review.category}
                    </Badge>
                    <div className="flex items-center space-x-1">
                      {getStatusIcon(review.status)}
                      <Badge className={`text-xs px-2 py-1 ${getStatusColor(review.status)}`}>
                        {review.status}
                      </Badge>
                    </div>
                  </div>

                  <h5 className="text-sm font-medium text-gray-900 mb-1">
                    {review.title}
                  </h5>
                  
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {review.comment}
                  </p>

                  <div className="flex items-center justify-between mt-3">
                    <div className="text-xs text-gray-500">
                      {review.user.email}
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {review.adminResponse && (
                        <Badge className="text-xs px-2 py-1 bg-blue-100 text-blue-800">
                          Responded
                        </Badge>
                      )}
                      
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRespondToReview(review);
                        }}
                        className="px-2 py-1 text-xs bg-yellow-600 text-white hover:bg-yellow-700 rounded"
                      >
                        <ArrowBendDoubleUpLeft size={12} color="white" />
                        <span className="ml-1">
                          {review.adminResponse ? "Edit" : "Respond"}
                        </span>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {sortedReviews.length === 0 && (
        <div className="text-center py-8">
          <Star1 size={48} color="#9CA3AF" className="mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900">No reviews found</h3>
          <p className="text-sm text-gray-500 mt-1">
            {filterStatus !== "all" || filterCategory !== "all"
              ? "Try adjusting your filters"
              : "User reviews will appear here"
            }
          </p>
        </div>
      )}

      {/* Review Detail Modal */}
      <Modal
        ref={detailModalRef}
        title="Review Details"
        size="md"
      >
        {selectedReview && (
          <div className="p-6 space-y-4">
            {/* Review Header */}
            <div className="flex items-start space-x-4 pb-4 border-b border-gray-200">
              <img
                src={generateAvatar(selectedReview.user.firstName, selectedReview.user.lastName, selectedReview.user.avatar)}
                alt={`${selectedReview.user.firstName} ${selectedReview.user.lastName}`}
                className="w-12 h-12 rounded-full"
              />
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-lg font-medium text-gray-900">
                    {selectedReview.user.firstName} {selectedReview.user.lastName}
                  </h4>
                  <div className="flex items-center space-x-2">
                    <Badge className={`text-xs px-2 py-1 ${getCategoryColor(selectedReview.category)}`}>
                      {selectedReview.category}
                    </Badge>
                    <Badge className={`text-xs px-2 py-1 ${getStatusColor(selectedReview.status)}`}>
                      {selectedReview.status}
                    </Badge>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4 mb-2">
                  {renderStars(selectedReview.rating)}
                  <span className="text-sm font-medium text-gray-700">
                    {selectedReview.rating}/5 stars
                  </span>
                  {selectedReview.roomCode && (
                    <div className="flex items-center space-x-1 text-sm text-gray-600">
                      <Buildings2 size={14} color="#6B7280" />
                      <span>Room {selectedReview.roomCode}</span>
                    </div>
                  )}
                </div>
                
                <p className="text-sm text-gray-600">{selectedReview.user.email}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(selectedReview.createdAt).toLocaleString()}
                </p>
              </div>
            </div>

            {/* Review Content */}
            <div>
              <h5 className="text-lg font-medium text-gray-900 mb-2">
                {selectedReview.title}
              </h5>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-700 whitespace-pre-wrap">
                  {selectedReview.comment}
                </p>
              </div>
            </div>

            {/* Admin Response */}
            {selectedReview.adminResponse && (
              <div>
                <h6 className="text-md font-medium text-gray-900 mb-2">Admin Response</h6>
                <div className="bg-blue-50 rounded-lg p-4">
                  <p className="text-blue-800 whitespace-pre-wrap">
                    {selectedReview.adminResponse.content}
                  </p>
                  <p className="text-xs text-blue-600 mt-2">
                    Responded by {selectedReview.adminResponse.respondedBy} • {" "}
                    {new Date(selectedReview.adminResponse.respondedAt).toLocaleString()}
                  </p>
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <div className="flex space-x-2">
                <select
                  value={selectedReview.status}
                  onChange={(e) => onReviewStatusChange(selectedReview.id, e.target.value as UserReview["status"])}
                  className="text-sm border border-gray-300 rounded px-3 py-1"
                >
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
                
                <Button
                  onClick={() => onReviewVisibilityChange(selectedReview.id, !selectedReview.isPublic)}
                  className={`px-3 py-1 text-sm rounded ${
                    selectedReview.isPublic 
                      ? "bg-gray-200 text-gray-700" 
                      : "bg-blue-100 text-blue-700"
                  }`}
                >
                  {selectedReview.isPublic ? (
                    <>
                      <EyeSlash size={14} color="currentColor" />
                      <span className="ml-1">Make Private</span>
                    </>
                  ) : (
                    <>
                      <Eye size={14} color="currentColor" />
                      <span className="ml-1">Make Public</span>
                    </>
                  )}
                </Button>
              </div>
              
              <Button
                onClick={() => {
                  detailModalRef.current?.close();
                  handleRespondToReview(selectedReview);
                }}
                className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg"
              >
                <ArrowBendDoubleUpLeft size={16} color="white" />
                <span className="ml-2">
                  {selectedReview.adminResponse ? "Edit Response" : "Respond"}
                </span>
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Response Modal */}
      <Modal
        ref={responseModalRef}
        title={`Respond to ${selectedReview?.user.firstName} ${selectedReview?.user.lastName}'s Review`}
        size="md"
      >
        <div className="p-6 space-y-4">
          {selectedReview && (
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                {renderStars(selectedReview.rating)}
                <span className="text-sm font-medium">"{selectedReview.title}"</span>
              </div>
              <p className="text-sm text-gray-600">
                {selectedReview.comment}
              </p>
            </div>
          )}
          
          <Textarea
            label="Admin Response"
            value={responseText}
            onChange={(e) => setResponseText(e.target.value)}
            placeholder="Write your response to this review..."
            rows={6}
          />
          
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <Button
              onClick={() => responseModalRef.current?.close()}
              className="px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSendResponse}
              disabled={!responseText.trim()}
              className="px-4 py-2 bg-yellow-600 text-white hover:bg-yellow-700 rounded-lg disabled:opacity-50"
            >
              <Send2 size={16} color="white" />
              <span className="ml-2">Save Response</span>
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}