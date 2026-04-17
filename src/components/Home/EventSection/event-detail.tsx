"use client";

import { useState, useEffect } from "react";
import { Calendar, MapPin, Clock, Users, Star, MessageSquare, Share2, Heart, Edit, Trash2 } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import Swal from "sweetalert2";
import { getEventByIdAction, type Event } from "@/src/app/(CommonLayout)/action/event";
import {
  addReviewAction,
  getEventReviewsAction,
  updateReviewAction,
  deleteReviewAction,
  type Review,
} from "@/src/app/(CommonLayout)/action/review";
import { getLoggedInUser } from "@/src/app/(DashboardLayout)/(UserLayout)/action/event";
import { joinEventAction } from "@/src/app/(DashboardLayout)/(UserLayout)/action/participant";

interface EventDetailProps {
  eventId: string;
}

const EventDetail = ({ eventId }: EventDetailProps) => {
  const [event, setEvent] = useState<Event | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<{ id: string } | null>(null);
  const [newReview, setNewReview] = useState({ rating: 5, reviewText: "" });
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const [registrationMessage, setRegistrationMessage] = useState<{ ok: boolean; text: string } | null>(null);

  useEffect(() => {
    loadEvent();
    loadReviews();
    loadCurrentUser();
  }, [eventId]);

  const loadCurrentUser = async () => {
    try {
      const user = await getLoggedInUser();
      setCurrentUser(user);
    } catch {
      setCurrentUser(null);
    }
  };

  const loadEvent = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const eventData = await getEventByIdAction(eventId);

      if (eventData) {
        setEvent(eventData);
      } else {
        setError("Event not found");
      }
    } catch (err) {
      setError("Failed to load event details. Please try again.");
      console.error("Error loading event:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const loadReviews = async () => {
    try {
      const reviewsData = await getEventReviewsAction(eventId);
      setReviews(reviewsData);
    } catch (err) {
      console.error("Error loading reviews:", err);
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReview.reviewText.trim()) return;

    setIsSubmittingReview(true);
    try {
      const result = await addReviewAction(eventId, newReview.rating, newReview.reviewText);
      setMessage({ ok: result.success, text: result.message });
      if (result.success) {
        setNewReview({ rating: 5, reviewText: "" });
        await loadReviews();
      }
    } catch (err) {
      setMessage({ ok: false, text: "Failed to submit review. Please try again." });
    } finally {
      setIsSubmittingReview(false);
      setTimeout(() => setMessage(null), 5000);
    }
  };

  const handleUpdateReview = async (reviewId: string, rating: number, reviewText: string) => {
    try {
      const result = await updateReviewAction(reviewId, rating, reviewText);
      setMessage({ ok: result.success, text: result.message });
      if (result.success) {
        setEditingReview(null);
        await loadReviews();
      }
    } catch (err) {
      setMessage({ ok: false, text: "Failed to update review. Please try again." });
    } finally {
      setTimeout(() => setMessage(null), 5000);
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) return;

    try {
      const deleteResult = await deleteReviewAction(reviewId);
      setMessage({ ok: deleteResult.success, text: deleteResult.message });
      if (deleteResult.success) {
        await loadReviews();
        await Swal.fire({
          title: "Deleted!",
          text: "Your review has been deleted.",
          icon: "success",
        });
      }
    } catch (err) {
      setMessage({ ok: false, text: "Failed to delete review. Please try again." });
    } finally {
      setTimeout(() => setMessage(null), 5000);
    }
  };

  const isCurrentUserReview = (review: Review) => {
    return currentUser?.id === review.userId;
  };

  const isOrganizer = () => {
    return currentUser?.id === event?.organizerId;
  };

  const handleRegister = async () => {
    setIsRegistering(true);
    setRegistrationMessage(null);
    try {
      const result = await joinEventAction(eventId);
      setRegistrationMessage({ ok: result.success, text: result.message });
    } catch (err) {
      setRegistrationMessage({ ok: false, text: "Failed to register for event. Please try again." });
    } finally {
      setIsRegistering(false);
      setTimeout(() => setRegistrationMessage(null), 5000);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const isFree = !event?.fee || event.fee === 0;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Event Not Found</h1>
          <p className="text-gray-600">{error || "The event you're looking for doesn't exist."}</p>
        </div>
      </div>
    );
  }

  console.log(event?.image);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-96 w-full bg-gray-200">
        {event.image ? (
          <img
            src={event.image}
            alt={event.title}
            className="w-full h-full object-cover"
          />
        ) : null}
    
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-4">
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  isFree
                    ? "bg-green-100 text-green-800"
                    : "bg-blue-100 text-blue-800"
                }`}
              >
                {isFree ? "Free" : `$${event.fee}`}
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                {event.type.replace("_", " ")}
              </span>
              {event.eventCategory && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                  {event.eventCategory}
                </span>
              )}
            </div>
            <h1 className="text-4xl font-bold text-white mb-4">{event.title}</h1>
            <div className="flex items-center text-white">
              {event.organizer.image && (
                <img
                  src={event.organizer.image}
                  alt={event.organizer.name || "Organizer"}
                  width={40}
                  height={40}
                  className="rounded-full mr-3 object-cover"
                />
              )}
              <span>by {event.organizer.name || "Unknown"}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Event Details */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h2 className="text-2xl font-semibold mb-4">Event Details</h2>
              <div className="space-y-4">
                <div className="flex items-center text-gray-600">
                  <Calendar className="w-5 h-5 mr-3" />
                  <span>{formatDate(event.date)}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Clock className="w-5 h-5 mr-3" />
                  <span>{event.time}</span>
                </div>
                {event.venue && (
                  <div className="flex items-center text-gray-600">
                    <MapPin className="w-5 h-5 mr-3" />
                    <span>{event.venue}</span>
                  </div>
                )}
                {event.participants && (
                  <div className="flex items-center text-gray-600">
                    <Users className="w-5 h-5 mr-3" />
                    <span>{event.participants.length} participants</span>
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h2 className="text-2xl font-semibold mb-4">About This Event</h2>
              <p className="text-gray-700 leading-relaxed">{event.description}</p>
            </div>

            {/* Reviews Section */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h2 className="text-2xl font-semibold mb-6">Reviews & Comments</h2>

              {/* Message Display */}
              {message && (
                <div
                  className={`mb-4 rounded-md border px-3 py-2 text-sm ${
                    message.ok
                      ? "border-green-200 bg-green-50 text-green-800"
                      : "border-red-200 bg-red-50 text-red-800"
                  }`}
                >
                  {message.text}
                </div>
              )}

              {/* Add Review Form - Only for logged in users who are not organizers */}
              {currentUser && !isOrganizer() && (
                <form onSubmit={handleReviewSubmit} className="mb-8 p-4 bg-gray-50 rounded-lg">
                  <h3 className="text-lg font-medium mb-4">Leave a Review</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Rating
                      </label>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setNewReview({ ...newReview, rating: star })}
                            className="p-1"
                          >
                            <Star
                              className={`w-6 h-6 ${
                                star <= newReview.rating
                                  ? "text-yellow-400 fill-current"
                                  : "text-gray-300"
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Comment
                      </label>
                      <textarea
                        value={newReview.reviewText}
                        onChange={(e) => setNewReview({ ...newReview, reviewText: e.target.value })}
                        placeholder="Share your experience with this event..."
                        className="w-full p-3 border border-gray-300 rounded-md resize-none"
                        rows={4}
                        required
                      />
                    </div>
                    <Button
                      type="submit"
                      disabled={isSubmittingReview || !newReview.reviewText.trim()}
                    >
                      {isSubmittingReview ? "Submitting..." : "Submit Review"}
                    </Button>
                  </div>
                </form>
              )}

              {isOrganizer() && (
                <div className="mb-8 p-4 bg-gray-50 rounded-lg text-center">
                  <p className="text-gray-600 text-sm">
                    You are the organizer of this event and cannot leave a review.
                  </p>
                </div>
              )}

              {!currentUser && (
                <div className="mb-8 p-4 bg-gray-50 rounded-lg text-center">
                  <p className="text-gray-600 text-sm">
                    Please <a href="/login" className="text-blue-600 hover:underline">login</a> to leave a review
                  </p>
                </div>
              )}

              {/* Existing Reviews */}
              <div className="space-y-4">
                {reviews && reviews.length > 0 ? (
                  reviews.map((review) => (
                    <div key={review.id} className="border-b pb-4 last:border-b-0">
                      {editingReview?.id === review.id ? (
                        // Edit Mode
                        <div className="p-4 bg-gray-50 rounded-lg">
                          <h4 className="font-medium mb-4">Edit Your Review</h4>
                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Rating
                              </label>
                              <div className="flex gap-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <button
                                    key={star}
                                    type="button"
                                    onClick={() => setEditingReview({ ...editingReview, rating: star })}
                                    className="p-1"
                                  >
                                    <Star
                                      className={`w-6 h-6 ${
                                        star <= editingReview.rating
                                          ? "text-yellow-400 fill-current"
                                          : "text-gray-300"
                                      }`}
                                    />
                                  </button>
                                ))}
                              </div>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Comment
                              </label>
                              <textarea
                                value={editingReview.reviewText || ""}
                                onChange={(e) => setEditingReview({ ...editingReview, reviewText: e.target.value })}
                                className="w-full p-3 border border-gray-300 rounded-md resize-none"
                                rows={3}
                              />
                            </div>
                            <div className="flex gap-2">
                              <Button
                                onClick={() => handleUpdateReview(review.id, editingReview.rating, editingReview.reviewText || "")}
                                size="sm"
                              >
                                Save Changes
                              </Button>
                              <Button
                                onClick={() => setEditingReview(null)}
                                variant="outline"
                                size="sm"
                              >
                                Cancel
                              </Button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        // View Mode
                        <>
                          <div className="flex items-start gap-3">
                            {review.user.image && (
                              <img
                                src={review.user.image}
                                alt={review.user.name || "User"}
                                width={40}
                                height={40}
                                className="rounded-full object-cover"
                              />
                            )}
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-2">
                                <h4 className="font-medium">{review.user.name || "Anonymous"}</h4>
                                <div className="flex items-center">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <Star
                                      key={star}
                                      className={`w-4 h-4 ${
                                        star <= review.rating
                                          ? "text-yellow-400 fill-current"
                                          : "text-gray-300"
                                      }`}
                                    />
                                  ))}
                                </div>
                              </div>
                              <p className="text-gray-700">{review.reviewText}</p>
                              
                              {/* User-specific controls */}
                              {isCurrentUserReview(review) && (
                                <div className="flex gap-2 mt-3">
                                  <Button
                                    onClick={() => setEditingReview(review)}
                                    variant="outline"
                                    size="sm"
                                  >
                                    <Edit className="w-3 h-3 mr-1" />
                                    Edit
                                  </Button>
                                  <Button
                                    onClick={() => handleDeleteReview(review.id)}
                                    variant="destructive"
                                    size="sm"
                                  >
                                    <Trash2 className="w-3 h-3 mr-1" />
                                    Delete
                                  </Button>
                                </div>
                              )}
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-8">
                    No reviews yet. Be the first to share your experience!
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Action Buttons */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              {registrationMessage && (
                <div
                  className={`mb-3 rounded-md border px-3 py-2 text-sm ${
                    registrationMessage.ok
                      ? "border-green-200 bg-green-50 text-green-800"
                      : "border-red-200 bg-red-50 text-red-800"
                  }`}
                >
                  {registrationMessage.text}
                </div>
              )}
              
              {isOrganizer() ? (
                <Button className="w-full mb-3" size="lg" disabled>
                  You are the organizer
                </Button>
              ) : currentUser ? (
                <Button
                  className="w-full mb-3"
                  size="lg"
                  onClick={handleRegister}
                  disabled={isRegistering}
                >
                  {isRegistering ? "Registering..." : "Register for Event"}
                </Button>
              ) : (
                <Button className="w-full mb-3" size="lg" variant="outline">
                  <a href="/login">Login to Register</a>
                </Button>
              )}
            </div>

            {/* Event Info Card */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="font-semibold mb-4">Event Information</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Price:</span>
                  <span className="font-medium">{isFree ? "Free" : `$${event.fee}`}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Type:</span>
                  <span className="font-medium">{event.type.replace("_", " ")}</span>
                </div>
                {event.eventCategory && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Category:</span>
                    <span className="font-medium">{event.eventCategory}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600">Date:</span>
                  <span className="font-medium">{formatDate(event.date)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Time:</span>
                  <span className="font-medium">{event.time}</span>
                </div>
                {event.venue && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Venue:</span>
                    <span className="font-medium">{event.venue}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Organizer Info */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="font-semibold mb-4">Organizer</h3>
              <div className="flex items-center gap-3 mb-3">
                {event.organizer.image && (
                  <img
                    src={event.organizer.image}
                    alt={event.organizer.name || "Organizer"}
                    width={48}
                    height={48}
                    className="rounded-full object-cover"
                  />
                )}
                <div>
                  <h4 className="font-medium">{event.organizer.name || "Unknown"}</h4>
                  <p className="text-sm text-gray-600">Event Organizer</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetail;
